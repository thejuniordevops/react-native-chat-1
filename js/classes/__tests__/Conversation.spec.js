jest.unmock('../Conversation.js');
var Conversation = require('../Conversation');

// some sample raw data. this can be returned by server or loaded from local sql
var ConvData1 = {
  id: 'jdfsoiwrf3827ryef',
  display_name: 'dummy conversation name',
  members: ['saewiuhewf', 'wriowehreiufgier']
};

describe('Conversation model', function () {

  it('create new conversation', function () {
    var conv = new Conversation(ConvData1)
    expect(conv.get('id')).toEqual(ConvData1.id);
    expect(conv.get('display_name')).toEqual(ConvData1.display_name);
    expect(conv.get('members')).toEqual(ConvData1.members);
    expect(conv.toPlainObject()).toEqual(ConvData1);
  });
  
});