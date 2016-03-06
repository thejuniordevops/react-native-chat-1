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

  autoConnect(cb) {
    var that = this;
    if (!this.ws) {
      this.connect(() => {
        that.reHandshake(cb);
      });
    } else {
      cb && cb();
    }
  }

  doAction (params, cb) {
    var that = this;
    emitter.once(params.action, cb);
    this.autoConnect(() => {
      that.ws.send(JSON.stringify(params));
    });
  }

  register(data, cb) {
    this.doAction({
      action: 'register',
      username: data.username,
      password: data.password
    }, cb);
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
      Storage.setValueForKey('username', res.response.user.username);
      Storage.setValueForKey('token', res.response.token);
    }
    cb && cb(res);
  }

  /**
   *
   */
  login (param, cb) {
    var that = this;
    this.doAction({
      action: 'login',
      username: param.username,
      password: param.password
    }, (res) => {
      that.postHandshake(res);
      cb && cb(res);
    });
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

  sendTextMessage(params) {
    this.doAction({
      action: 'sendTextMessage',
      data: {
        toUsername: params.toUsername,
        text: params.text
      }
    }, (res) => {
      console.log('sendTextMessage', res);
    })
  }
}
module.exports = new DataService();