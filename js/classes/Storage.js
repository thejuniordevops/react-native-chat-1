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
 * id(index):string (Mongodb object id),
 * members:array (members user_ids), created_by:string (Mongodb object id)
 * last_message:string, last_message_ts:int
 *
 * Table message
 * id(index):objectId, conversation_id:objectId, text:string, meta: string, create_at:int, created_by:objectId
 *
 * Contacts
 * id(index):int, user_id:string (Mongodb id), username:string, display_name:string
 *
 *
 * Storage should only read and write to local db.
 */
var _initialized = false;
var _initCallbacks = [];
class Storage {

  constructor () {
    this.db = SQLite.openDatabase('chat.db', '1.0', 'Chat Database', 200000, this.openCB.bind(this), this.errorCB.bind(this));
    this.cached = {};
  }

  whenInitialized(cb) {
    if (!_initialized) {
      console.log('whenInitialized push');
      _initCallbacks.push(cb);
    } else {
      cb && cb();
    }
  }

  errorCB(err) {
    console.log('Storage:SQL Error: ' + err);
  }

  successCB() {
    console.log('Storage:SQL executed fine');
  }

  openCB() {
    console.log('Storage:Database OPENED');
    this.init();
  }

  nukeDB() {
    this.execQuery('DELETE FROM `user_defaults`');
    this.execQuery('DELETE FROM `conversation`');
    this.execQuery('DELETE FROM `user`');
    this.execQuery('DELETE FROM `message`');
  }

  init() {
    var tablesCreated = 0;
    var tableCreateFunctions = [
      this.createUserDefaultsTable.bind(this),
      this.createConversationTable.bind(this),
      this.createMessageTable.bind(this),
      this.createUserTable.bind(this)
    ];
    var callback = function () {
      if (++tablesCreated >= tableCreateFunctions.length) {
        console.log('call _initCallbacks', _initCallbacks);
        _initCallbacks.forEach((func) => {
          func && func();
        });
      }
    };
    tableCreateFunctions.forEach((func) => {
      func(callback);
    });
  }

  createUserDefaultsTable(cb) {
    this.execQuery('CREATE TABLE IF NOT EXISTS `user_defaults` ' +
      '(`key` varchar(50) NOT NULL,`value` varchar(500) NOT NULL,' +
      'PRIMARY KEY (`key`))', cb);
  }

  createConversationTable(cb) {
    this.execQuery('CREATE TABLE IF NOT EXISTS `conversation` ' +
      '(`id` varchar(64) NOT NULL,' +
      '`members` varchar(1000) NOT NULL,' +
      '`display_name` varchar(1000) NOT NULL,' +
      '`created_by` varchar(64) NOT NULL,' +
      '`last_message` varchar(500) NOT NULL,' +
      '`last_message_ts` int(11) NOT NULL,' +
      'PRIMARY KEY (`id`))', cb);
  }

  createMessageTable(cb) {
    this.execQuery('CREATE TABLE IF NOT EXISTS `message` (' +
    '`id` varchar(64) NOT NULL,' +
    '`conversation_id` varchar(64) NOT NULL,' +
    '`created_by` varchar(64) NOT NULL,' +
    '`created_at` int(11) NOT NULL,' +
    '`meta_type` varchar(200) NOT NULL,' +
    '`text` varchar(1000) NOT NULL,' +
    'PRIMARY KEY (`id`))', cb);
  }
  
  createUserTable(cb) {
     this.execQuery('CREATE TABLE IF NOT EXISTS `user` (' +
    '`id` varchar(64) NOT NULL,' +
    '`username` varchar(100) NOT NULL,' +
    '`display_name` varchar(100) NOT NULL,' +
    'PRIMARY KEY (`id`))', cb);
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
      if (results.length > 0) {
        var ret = results[0];
        that.cached[key] = ret.value;
        cb && cb(ret.value);
      } else {
        cb && cb(null);
      }
    });
  }

  getAllUsersInfo(params, cb) {
    var query = 'SELECT * FROM `user`';
    this.execQuery(query, cb);
  }

  /**
   * return users array
   * @param params {UserIds: array<id>}
   */
  getUsersInfo(params, cb) {
    if (params.userIds && params.userIds.length > 0) {
      var query = 'SELECT * FROM `user` WHERE `id` IN ("' + params.userIds.join('","') + '")';
      this.execQuery(query, cb);
    }
  }

  /**
   * Save a single user info into db
   */
  saveUserInfo(params, cb) {
    if (params.id) {
      params.displayName = params.displayName || '';
      this.execQuery('INSERT OR REPLACE INTO `user` (`id`,`username`, `display_name`) VALUES ("' +
        params.id + '","' + params.username + '","'  + params.displayName + '")');
    }
  }

  getMyInfo() {
    return {
      username: this.cached.username,
      user_id: this.cached.user_id
    };
  }

  /**
   * Create or update new conversation
   */
  newConversation(params, cb) {
    console.log('Storage:newConversation', params);
    var query = 'INSERT OR REPLACE INTO `conversation` ' +
    '(`id`, `members`, `display_name`, `created_by`, `last_message`, `last_message_ts`) VALUES ' +
    '("' + params.id +'", "' + params.members.join(',') + '", "' +
    params.displayName + '", "' + params.created_by + '","", 0)';
    this.execQuery(query, cb);
  }
  /**
   * @param params {id: ObjectId, created_by: objectId, created_at: timestamp, text: string, conversation_id: objectId, recipients: array<objectId>, meta: object}
   */
  newMessage(params, cb) {
    var createdAtTS = Date.parse(params.created_at);
    var query = 'INSERT INTO `message` ' +
      '(`id`, `conversation_id`, `created_at`, `created_by`, `meta_type`, `text`) VALUES ' +
      '("' + params.id +'", "' + params.conversation_id + '", "' +
      createdAtTS + '", "' + params.created_by + '", "' + params.meta.type + '", "' + params.text + '")';
    this.execQuery(query, cb);
  }

  /**
   * @param params {conversation_id: {objectId}};
   * return latest chats ordered by created_at, DESC
   */
  getMessages(params, cb) {
    this.execQuery('SELECT * FROM `message` WHERE `conversation_id`="' + params.conversationId +
      '" ORDER BY `created_at` DESC LIMIT 100', (messages) => {
      cb && cb(messages.reverse()); //reverse order
    });
  }

  /**
   * get all conversations
   */
  getConversations(cb) {
    this.execQuery('SELECT * FROM `conversation`', cb);
  }

  /**
   * The conversation info can be updated
   * For example, adding member, changing conversation display_name
   */
  updateConversation() {

  }

  execQuery(query, cb) {
    var that = this;
    this.db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        console.log('Storage:Query completed', query);
        cb && cb(that.toArray(results));
      }, (err) => {
        console.log('Storage:Query error', err, query);
      });
    });
  }

  /**
   * Convert sql results object to array
   */
  toArray(results) {
    var ret = [];
    if (results.rows) {
      for (var i = 0; i < results.rows.length; i++) {
        ret.push(results.rows.item(i));
      }
    }
    return ret;
  }
}

module.exports = new Storage();
