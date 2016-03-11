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
    cb && cb();
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
    cb && cb(params.response);
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
      console.log('DataService:post_handshake', res.response);
      Storage.setValueForKey('username', res.response.user.username);
      Storage.setValueForKey('user_id', res.response.user.id);
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
      // TODO: save user info into db
      cb && cb(res);
    });
  }

  /**
   * @param params {userIds: array}
   */
  getUsers(params, cb) {
    console.log('DataService:getUsers userIds', params.userIds);
    if (params.userIds && params.userIds.length > 0) {
      // save these user info
      this.doAction({
        action: 'getUsers',
        data: {
          user_ids: params.userIds
        }
      }, (res) => {
        if (res && !res.err) {
          //save this into Storage
          console.log('DataService:loadUserInfo response.data', res.response.data);
          res.response.data.forEach((user) => {
            Storage.saveUserInfo(user);
          });
          cb && cb(res.response.data);
        }
      });
    }

  }

  /**
   *  @param params {userIds: [string]}
   */
  newConversation(params, cb) {
    var that = this;
    this.doAction({
      action: 'newConversation',
      data: {
        user_ids: params.userIds
      }
    }, (res) => {
      if (res && !res.err) {
        //save this into Storage
        Storage.newConversation(res.response.data);
        // fetch users info
        that.getUsers({userIds: res.response.data.members});
        cb && cb(res.response.data);
      }
    });
  }

  /**
   * Get conversation info from server
   */
  getConversations(params, cb) {
    var that = this;
    this.doAction({
      action: 'getConversations',
      data: {
        conversation_ids: params.conversationIds
      }
    }, (res) => {
      if (res && !res.err && res.response.data.length > 0) {
        //save this into Storage
        console.log('getConversations:res.response.data', res.response.data);
        res.response.data.forEach((conversation) => {
          Storage.newConversation(conversation);
        });
        // get all users info
        that.getUsers({
          userIds: that.getUserIdsFromConversations(res.response.data)
        });
        cb && cb(res.response.data);
      }
    });
  }

  getUserIdsFromConversations(conversations) {
    var users = {};
    conversations.forEach((conversation) => {
      conversation.members.split(',').forEach((userId) => {
        users[userId] = 1;
      });
    });
    return Object.keys(users);
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
        console.log('DataService:sendTextMessage', res.response.data);
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

  getNewMessages(params, cb) {
    var that = this;
    // First, let's retrive all new messages from the server
    this.doAction({
      action: 'getNewMessages',
      data: {}
    }, (res) => {
      // res.data is an array containing Message models
      // If ther are any new message, we will store them into db
      if (res.response.data.length > 0) {
        var messageIds = res.response.data.map((n) => {return n.id});
        // Acknowledge the message so that server can delete this notif
        that.acknowledgeNewMessages({message_ids: messageIds});
        // store the message
        res.response.data.forEach((message) => {
          Storage.newMessage(message);
        });
        // Next fetch the conversation info. Because the conversation data could be updated on the server side
        var conversationIds = res.response.data.map((n) => {return n.conversation_id});
        that.getConversations({conversationIds: conversationIds});
        cb && cb(res.data);
      }

    });
  }

  acknowledgeNewMessages(params, cb) {
    this.doAction({
      action: 'acknowledgeNewMessages',
      data: {message_ids: params.message_ids}
    }, (res) => {

    });
  }

  getMessage(params, cb) {

  }
}
module.exports = new DataService();