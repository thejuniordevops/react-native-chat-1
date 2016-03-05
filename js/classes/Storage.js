'use strict';

var SQLite = require('react-native-sqlite-storage');

class Storage {
  constructor () {
    this.db = SQLite.openDatabase('chat.db', '1.0', 'Chat Database', 200000, this.openCB.bind(this), this.errorCB.bind(this));
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
    this.execQuery('CREATE TABLE IF NOT EXISTS `user_defaults` (`key` varchar(50) NOT NULL,`value` varchar(500) NOT NULL,PRIMARY KEY (`key`));');
  }

  setValueForKey(key, value) {
    this.execQuery('INSERT OR REPLACE INTO `user_defaults` (`key`,`value`) VALUES ("' + key + '","' + value + '")');
  }

  getValueForKey(key, cb) {
    this.execQuery('SELECT value FROM `user_defaults` WHERE `key`="' + key + '"', (results) => {
      if (results.rows.length > 0) {
        var ret = results.rows.item(0);
        cb && cb(ret.value);
      } else {
        cb && cb(null);
      }
    });
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
