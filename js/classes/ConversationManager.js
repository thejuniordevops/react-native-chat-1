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
      DataService.getConversations({conversationIds: conversationIds}, (conversations) => {

        //save these conversations into Storage
        console.log('getConversations:conversations', conversations);
        conversations.forEach((conversation) => {
          Storage.newConversation(conversation);
        });

        // NEXT fetch user id info
        UserManager.getUsersFromServer({
          userIds: DataService.getUserIdsFromConversations(conversations)
        }, (users) => {
          cb && cb({
            newMessages: newMessages,
            conversations: conversations,
            users: users
          });
        });
      });

    });
    //TODO: emit some event for UI to refresh
  }

  /**
   * return the new message
   */
  sendTextMessage(params, cb) {
    DataService.sendTextMessage(params, (message) => {
      Storage.newMessage(message, cb);
    });
  }

  /**
   * Fetch from storage
   */
  getMessages(params, cb) {
    Storage.getMessages(params, cb);
  }

}

module.exports = new ConversationManager();