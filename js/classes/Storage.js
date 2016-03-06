'use strict';

var SQLite = require('react-native-sqlite-storage');

/**
 * DB tables
 *
 * Table user_defaults
 * key(primary):string, value:string
 *
 * Table recent_chats to show in the chat list
 * id(INDEX):int, chat_id:string
 *
 * Table conversation, all conversations are group chats
 * id(index):string (Mongodb object id), last_message:string, last_message_ts:int
 *
 * Table message
 * id(index):int, conversation_id:string, text:string, timestamp:int, from_username:string
 *
 * Contacts
 * id(index):int, user_id:string (Mongodb id), username:string, display_name:string
 *
 */

class Storage {

  constructor () {
    this.db = SQLite.openDatabase('chat.db', '1.0', 'Chat Database', 200000, this.openCB.bind(this), this.errorCB.bind(this));
    this.cached = {};
  }

  errorCB(err) {
    console.log('SQL Error: ' + err);
  }

  successCB() {
    console.log('SQL executed fine');
  }

  openCB() {
    console.log('Database OPENED');
    //this.nukeUserDefaultsTable();
    this.init();
    //this.setValueForKey("username", "asd");
    /*var username = this.getValueForKey('username', (result) => {
      console.log('username', result)
    });
    */
  }

  nukeUserDefaultsTable() {
    this.execQuery('DROP TABLE `user_defaults`');
  }

  init() {
    this.createUserDefaultsTable();
  }

  createUserDefaultsTable() {
    this.execQuery('CREATE TABLE IF NOT EXISTS `user_defaults` ' +
      '(`key` varchar(50) NOT NULL,`value` varchar(500) NOT NULL,' +
      'PRIMARY KEY (`key`));');
  }

  createChatListTable() {
    this.execQuery('CREATE TABLE IF NOT EXISTS `chat_list` ' +
      '(`id` int(11) NOT NULL,`key` varchar(50) NOT NULL,`value` varchar(500) NOT NULL,PRIMARY KEY (`key`));');
  }

  setValueForKey(key, value) {
    this.execQuery('INSERT OR REPLACE INTO `user_defaults` (`key`,`value`) VALUES ("' + key + '","' + value + '")');
    this.cached[key] = value;
  }

  getValueForKey(key, cb) {
    if (typeof(this.cached[key]) != 'undefined') {
      cb && cb(this.cached[key]);
      return;
    }
    var that = this;
    this.execQuery('SELECT value FROM `user_defaults` WHERE `key`="' + key + '"', (results) => {
      if (results.rows.length > 0) {
        var ret = results.rows.item(0);
        that.cached[key] = ret.value;
        cb && cb(ret.value);
      } else {
        cb && cb(null);
      }
    });
  }

  getMyInfo() {
    return {
      username: this.cached['username']
    };
  }

  updateConversatio() {

  }

  getChatList() {

  }

  execQuery(query, cb) {
    this.db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        console.log('Query completed', query);
        cb && cb(results);
      }, (err) => {
        console.log('Query error', err, query);
      });
    });
  }
}

module.exports = new Storage();
