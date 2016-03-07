'use strict';
var Config = require('./../Config');
var emitter = require('./Emitter');
var Storage = require('./Storage');

class DataService {
  constructor () {
    this.callbacks = {};
  }

  parseRes (res) {
    if (res.type == 'message') {
      return JSON.parse(res.data);
    }
    return res;
  }

  connect(cb) {
    this.ws = new WebSocket(Config.serverURL);
    var that = this;
    this.ws.onopen = () => {
      // connection opened
      console.log("connection opened");
      cb && cb();
    };

    this.ws.onmessage = (e) => {
      // a message was received
      var r = this.parseRes(e);
      console.log("onmessage received", r);
      emitter.emit(r.action, r.data);
    };

    this.ws.close = (e) => {
      // a message was received
      console.log("connection closed");
      that.ws = null;
    };
  }

  /**
   *
   * @param cb
   * @param skipHandshake {boolean} (optional)
   */
  autoConnect(cb, skipHandshake) {
    var that = this;
    if (!this.ws) {
      this.connect(() => {
        if (!skipHandshake) {
          that.reHandshake(cb);
        } else {
          cb && cb();
        }
      });
    } else {
      cb && cb();
    }
  }

  /**
   * @param params
   * @param cb
   * @param skipHandshake {boolean} (optional)
   */
  doAction (params, cb, skipHanshake) {
    var that = this;
    emitter.once(params.action, cb);
    this.autoConnect(() => {
      that.ws.send(JSON.stringify(params));
    }, skipHanshake);
  }

  register(params, cb) {
    this.doAction({
      action: 'register',
      username: params.username,
      password: params.password
    }, cb, true);
  }

  /**
   * Re-handshake after disconnect
   */
  reHandshake(cb) {
    var that = this;
    Storage.getValueForKey('token', (token) => {
      if (token) {
        emitter.addListener('handshake', cb);
        that.ws.send(JSON.stringify({
          action: 'handshake',
          token: token
        }));
      }
    });
  }

  /**
   * First time login with token
   */
  doFirstLogin(params, cb) {
    emitter.addListener(params.action, cb);
    var that = this;
    this.connect(() => {
      that.ws.send(JSON.stringify(params));
    });
  }
  /**
   * For app init auto login with token
   */
  loginWithToken(cb) {
    var that = this;
    Storage.getValueForKey('token', (token) => {
      if (token && token != 'undefined') {
        that.doFirstLogin({
          action: 'handshake',
          token: token
        }, (res) => {
          that.postHandshake(res, cb);
        });
      } else {
        cb && cb({err: 'no token'})
      }
    });
  }

  postHandshake(res, cb) {
    if (res && !res.err) {
      console.log('post_handshake', res.response);
      Storage.setValueForKey('username', res.response.user.username);
      Storage.setValueForKey('token', res.response.token);
    }
    cb && cb(res);
  }

  /**
   *
   */
  login (params, cb) {
    var that = this;
    this.doAction({
      action: 'login',
      username: params.username,
      password: params.password
    }, (res) => {
      that.postHandshake(res);
      cb && cb(res);
    }, true); // skip handshake
  }

  logout (cb) {
    var myInfo = Storage.getMyInfo();
    this.doAction({
      action: 'logout',
      username: myInfo.username
    });
    Storage.nukeDB();
    console.log('close ws');
    this.ws.close(); // TODO: this seems to be not working
  }

  /**
   * Lookup a username, return userdata if valid, return null if username does not exist
   */
  usernameLookUp (params, cb) {
    this.doAction({
      action: 'usernameLookUp',
      data: {username: params.username}
    }, (res) => {
      cb && cb(res);
    });
  }

  /**
   *  @param params {userIds: [string]}
   */
  newConversation(params, cb) {
    this.doAction({
      action: 'newConversation',
      data: {
        user_ids: params.userIds
      }
    }, (res) => {
      if (res && !res.err) {
        //save this into Storage
        Storage.newConversation(res.response.data);
        cb && cb(res.response.data);
      }
    });
  }

  sendTextMessage(params, cb) {
    this.doAction({
      action: 'sendTextMessage',
      data: {
        conversation_id: params.conversation_id,
        text: params.text
      }
    }, (res) => {
      if (res && !res.err) {
        console.log('sendTextMessage', res.response.data);
        /*
         {_id: ObjectId,
         created_by: '56dcde2941118427247c1e5d',
         created_at: '2016-03-07T03:07:20.632Z',
         text: '21333',
         conversation_id: '56dc8c259df943742f4ba3a0',
         recipients: [ '56d92d4007886a7e0d02c5cd' ],
         meta: { type: 'text' } }
         */
        // TODO: store it into db
        Storage.newMessage(res.response.data);
        cb && cb(res.response.data);
      }
    });
  }
}
module.exports = new DataService();