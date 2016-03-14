'use strict';
var Config = require('./../Config');
var emitter = require('./Emitter');
var Storage = require('./Storage');
var DataService = require('./DataService');
var UserManager = require('./UserManager');
var Conversation = require('./Conversation');

/**
 * Manage all conversation resources
 */
class ConversationManager {
  constructor () {
    console.log('emitter', emitter);
    emitter.addListener('pushTextMessage', this.pushTextMessage.bind(this));
    emitter.addListener('appBecomeActive', this.getNewMessages.bind(this));
  }
  
  /**
   * return all conversations
   * return array<object>
   */
  getAllConversations(cb) {
    // We just need to load conversations from storage.
    // TODO: consider caching them, because there won't be too many conversations
    Storage.getConversations((conversations) => {
      cb && cb(conversations.map((conv) => {return new Conversation(conv)}));
    });
  }

  /**
   * Fetch conversation and save it to db
   * @param params {userIds: array<ids>}
   * @param cb
   */
  newConversation(params, cb) {
    DataService.newConversation(params, (conversation) => {
      //save this into Storage
      Storage.newConversation(conversation);
      // fetch users info
      // TODO: we simply fetch the user data after creating a new conversation.
      // however, we would like to more smart about it.
      // Maybe consider to only fetch if we don't have them
      UserManager.getUsersFromServer({userIds: conversation.members}, (users) => {
        cb && cb({
          conversation: new Conversation(conversation),
          users: users
        });
      });
    });
  }

  /**
   * Similar like getNewMessages. This is server pushed some message to client.
   * We fetch conversation data and user data
   * sample message data
   * {id: "56e38b973c63b7123bff56a4", created_by: "56e1dd81a573d003004183e2", created_at: "2016-03-12T03:23:03.389Z", text: "Ert", conversation_id: "56e38b923c63b7123bff56a3"
   */
  pushTextMessage(message) {
    console.log('pushTextMessage', message);
    if (message && message.id) {
      // acknowledge it
      DataService.acknowledgeNewMessages({message_ids: [message.id]});
      Storage.newMessage(message);
      this._fetchAndSaveConversations([message.conversation_id], (res) => {
        res.newMessages = [message];
        emitter.emit('newMessageReceived', res);
      });
    }
  }

  /**
   * Poll to fetch all new messages
   * Save those new messages into storage
   * Then ackonwledge new messages
   * @params cb:function weill be called with param = {newMessages:array, conversations: array, users: array}
   * if no cb is provided, event "newMessageReceived" will be emitted with the same result
   */
  getNewMessages(cb) {
    var that = this;
    DataService.getNewMessages({}, (newMessages) => {
      if (newMessages.length == 0) {
        cb && cb({}); // nothing to do
        return;
      }
      var messageIds = newMessages.map((n) => {return n.id});
      // Acknowledge the message so that server can delete this notif
      DataService.acknowledgeNewMessages({message_ids: messageIds});
      // store the message
      newMessages.forEach((message) => {
        Storage.newMessage(message);
      });
      // Next fetch the conversation info. Because the conversation data could be updated on the server side
      var conversationIds = newMessages.map((n) => {return n.conversation_id});
      that._fetchAndSaveConversations(conversationIds, (res) => {
        res.newMessages = newMessages;
        // res: {newMessages:array, conversations: array, users: array}
        if (cb) {
          cb(res);
        } else {
          emitter.emit('newMessageReceived', res);
        }
      });
    });
  }

  /**
   * Fetch conversation data with conversation ids
   * And fetch all users in that conversation
   * @param conversationIds: array of conversation ids
   * @param cb:function
   * cb will be called with param {conversations: array, users: array}
   */
  _fetchAndSaveConversations(conversationIds, cb) {
    var that = this;
    DataService.getConversations({conversationIds: conversationIds}, (conversations) => {

      //save these conversations into Storage
      console.log('getConversations:conversations', conversations);
      conversations.forEach((conversation) => {
        Storage.newConversation(conversation);
      });
      that._fetchAndSaveUsers(DataService.getUserIdsFromConversations(conversations), (res) => {
        res.conversations = conversations;
        cb && cb(res);
      });
    });
  }

  /**
   * Fetch user data with user ids
   * @param userIds: array of user ids
   * @param cb: function
   * cb will be called with {users: array<user>}
   */
  _fetchAndSaveUsers(userIds, cb) {
    // NEXT fetch user id info
    UserManager.getUsersFromServer({
      userIds: userIds
    }, (users) => {
      cb && cb({
        users: users
      });
    });
  }

  /**
   * Send a text message to another user
   * return the new message
   */
  sendTextMessage(params, cb) {
    DataService.sendTextMessage(params, (message) => {
      Storage.newMessage(message, cb);
    });
  }

  /**
   * Fetch messages from storage
   * (to get from the server, use getNewMessages)
   */
  getMessages(params, cb) {
    Storage.getMessages(params, cb);
  }

}

module.exports = new ConversationManager();