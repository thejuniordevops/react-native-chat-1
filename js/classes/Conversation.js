'use strict';
var BaseModel = require('./BaseModel');
var UserManager = require('./UserManager');
var Utils = require('./Utils');
/**
 * A Conversation object
 */
class Conversation extends BaseModel{
  getMembers() {
    var members = this.get('members');
    if (typeof(members) == 'string') {
      members = members.split(',');
    }
    return members;
  }

  getDisplayName() {
    if (this.get('display_name')) {
      return this.get('display_name');
    } else {
      var myId = UserManager.getMyId();
      var displayName = [];
      this.getMembers().forEach((userId) => {
        if(myId != userId) {
          var user = UserManager.getUser(userId);
          displayName.push((user && user.getDisplayName()) || 'unknown user');
        }
      });
      return displayName.join(', ');
    }
  }

  getLastTSHumanReadable() {
    var lastTs = this.get('last_message_ts');
    return lastTs && Utils.tsToHumanReadable(lastTs);
  }
  
  isEqual(otherConversation) {
    return JSON.stringify(otherConversation._data) == JSON.stringify(this._data);
  }
}

module.exports = Conversation;