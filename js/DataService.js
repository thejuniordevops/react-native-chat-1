'use strict'
var Config = require('./Config');
class DataService {
  connect (cb) {
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
      console.log(e);
    };

    ws.close = (e) => {
      // a message was received
      console.log("connection closed");
      that.ws = ws = null;
    };
  }

  autoConnect (cb) {
    if (!this.ws) {
      this.connect(cb);
    } else {
      cb && cb();
    }
  }

  register () {
    var that = this;
    this.autoConnect(() => {
      that.ws.send(JSON.stringify({
        action: "register",
        username: "testuser1",
        password: "testuser1"
      }));
    });
  }
}
module.exports = new DataService();