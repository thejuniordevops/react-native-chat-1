'use strict';
var Config = require('./Config');
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
    var ws = this.ws = new WebSocket(Config.serverURL);
    var that = this;
    ws.onopen = () => {
      // connection opened
      //ws.send('something');
      console.log("connection opened");
      cb && cb();
    };

    ws.onmessage = (e) => {
      // a message was received
      var r = this.parseRes(e);
      console.log("onmessage received", r);
      emitter.emit(r.action, r.data);
    };

    ws.close = (e) => {
      // a message was received
      console.log("connection closed");
      that.ws = ws = null;
    };
  }

  autoConnect(cb) {
    if (!this.ws) {
      this.connect(cb);
    } else {
      cb && cb();
    }
  }

  doAction (params, cb) {
    var that = this;
    emitter.addListener(params.action, cb);
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

  loginWithToken(cb) {
    var that = this;
    Storage.getValueForKey('token', (token) => {
      if (token) {
        that.doAction({
          action: 'handshake',
          token: token
        }, cb);
      } else {
        cb && cb({err: 'no token'})
      }
    });

  }

  login (param, cb) {
    //Storage
    this.doAction({
      action: 'login',
      username: param.username,
      password: param.password
    }, (res) => {
      if (res && !res.err) {
        Storage.setValueForKey('username', res.response.user.username);
        Storage.setValueForKey('token', res.response.token);
      }
      cb && cb(res);
    });
  }
}
module.exports = new DataService();