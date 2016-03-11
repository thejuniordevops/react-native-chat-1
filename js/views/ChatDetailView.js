'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, View} = React;
var DataService = require('../classes/DataService');
var ChatHistoryView = require('./ChatHistoryView');
var ChatMessageInputView = require('./ChatMessageInputView');
var Config = require('../Config');
var LocalizedText = require("../classes/LocalizedText");
var NavigationBar = require('react-native-navbar');
var ConversationManager = require('../classes/ConversationManager');
var UserManager = require('../classes/UserManager');

//props required: username
class ChatDetailView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      users: {}
    };
  }

  componentDidMount() {
    console.log('ChatDetailView:componentDidMount conversation', this.props.conversation);
    this.getMessages();
    this.setState({
      users: UserManager.getUsersInfoWithIdAsKeys({userIds: this.props.conversation.getMembers()})
    }, () => {
      console.log('this.state.users', this.state.users);
    });
  }

  getMessages() {
    var that = this;
    ConversationManager.getMessages({conversationId: this.props.conversation.get('id')}, (messages) => {
      console.log('ChatDetailView:getMessages', messages);
      console.log('ChatDetailView:getMessages users', that.state.users);
      that.setState({
        messages: messages
      });
    });
  }

  /**
   *
   * @param params {text: {string}}
   */
  send(params) {
    params.conversation_id = this.props.conversation.get('id');
    console.log('ChatDetailView:send message', params);
    var that = this;
    // send message to server
    ConversationManager.sendTextMessage(params, (response) => {
      that.getMessages();
    });
  }

  render() {
    var that = this;
    var leftButtonConfig = {
      title: 'back',
      handler: () => {
        that.props.navigator.pop();
        that.props.onBack && that.props.onBack();
      }
    };
    var displayName = this.props.conversation.getDisplayName();

    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={[styleCommon.background]}>
        <NavigationBar
          title={{title: displayName}}
          leftButton={leftButtonConfig}
        />
        <View style={styles.container}>
          <ChatHistoryView style={styles.history} messages={this.state.messages} users={this.state.users} />
          <ChatMessageInputView style={styles.inputView} onSend={this.send.bind(this)} />
        </View>
      </View>
    );
  }
}

var styleCommon = require("./../StylesCommon");

const styles = StyleSheet.create({
  container: {

  },
  history: {
    backgroundColor: '#ffffff',
    height: 450,
  },
  inputView: {
    height: 45,
    backgroundColor: '#ffffff'
  }
});

AppRegistry.registerComponent('ChatDetailView', () => ChatDetailView);

module.exports = ChatDetailView;
