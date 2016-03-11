'use strict';
var Config = require('./../Config');
var emitter = require('./Emitter');
var Storage = require('./Storage');
var DataService = require('./DataService');
var User = require('./User');

/**
 * Manage all conversation resources
 */
var _userData = {};
class UserManager {
  constructor () {
    this.init();
  }

  init() {
    var that = this;
    Storage.whenInitialized(() => {
      console.log('call init')
      Storage.getAllUsersInfo({}, (users) => {
        console.log('all users info', users);
        that.setUsers(users);
      });
    });
  }

  setUsers(users) {
    var that = this;
    users.forEach((user) => {
      that.setUser(user);
    });
  }

  setUser(user) {
    _userData[user.id] = new User(user);
  }

  getUser(userId) {
    return _userData[userId];
  }

  /**
   * returns user object with id as the key
   * @param params {userIds: array<id>}
   */
  getUsersInfoWithIdAsKeys(params) {
    var ret = {};
    for(var i = 0; i < params.userIds.length; i++) {
      var userId = params.userIds[i];
      ret[userId] = this.getUser(userId);
    }
    return ret;
  }

  /**
   * Load users data from server and save to db
   */
  getUsersFromServer(params, cb) {
    var that = this;
    DataService.getUsers(params, (users) => {
      //save this into Storage
      console.log('UserManager:getUsersFromServer', users);
      users.forEach((user) => {
        Storage.saveUserInfo(user);
        that.setUser(user);
      });
      cb && cb(users);
    });
  }

  getMyId() {
    return Storage.getMyInfo().user_id;
  }
}

module.exports = new UserManager();