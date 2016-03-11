'use strict';
var BaseModel = require('./BaseModel');
/**
 * A Conversation object
 */
class User extends BaseModel{

  getDisplayName() {
    return this.get('display_name') || this.get('username');
  }

}

module.exports = User;