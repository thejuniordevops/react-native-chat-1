jest.unmock('../ConversationManager.js');
var ConversationManager = require('../ConversationManager');

// some sample raw data. this can be returned by server or loaded from local sql
var ConvData1 = {
  id: 'jdfsoiwrf3827ryef',
  display_name: 'dummy conversation name',
  members: ['saewiuhewf', 'wriowehreiufgier']
};

describe('ConversationManager', function () {

  it('ConversationManager Create New Conversation', function () {
    ConversationManager.newConversation({id: 1});
  });
  
});