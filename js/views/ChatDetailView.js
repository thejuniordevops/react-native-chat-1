'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, ListView, View} = React;
var DataService = require('../classes/DataService');
var ChatHistoryView = require('./ChatHistoryView');
var ChatMessageInputView = require('./ChatMessageInputView');
var Config = require('../Config');
var LocalizedText = require("../classes/LocalizedText");
var NavigationBar = require('react-native-navbar');
var Storage = require('../classes/Storage');

//props required: username
class ChatDetailView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    this.getMessages();
  }

  getMessages() {
    var messages = [{
      ts: 'yesterday',
      fromUsername: 'asd',
      message: 'How are you'
    }, {
      ts: '3 hours ago',
      fromUsername: 'qwe',
      message: 'I\'m fine. And you?'
    }]; //Storage.getMessages(this.props.conversationId);
    this.setState({
      messages: messages
    });
  }

  send(params) {
    params.conversationId = this.props.conversation.id;
    console.log('send message', params);
    // TODO: send message to server
  }

  render() {
    var that = this;
    var leftButtonConfig = {
      title: 'back',
      handler: () => {
        that.props.navigator.pop();
      }
    };

    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={[styleCommon.background]}>
        <NavigationBar
        title={{title: this.props.conversation.id}}
        leftButton={leftButtonConfig}
        />
        <ChatHistoryView messages={this.state.messages} />
        <ChatMessageInputView onSend={this.send.bind(this)} />
      </View>
    );
  }
}

var styleCommon = require("./../StylesCommon");

const styles = StyleSheet.create({
});

AppRegistry.registerComponent('ChatDetailView', () => ChatDetailView);

module.exports = ChatDetailView;
