'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, View} = React;
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
      messages: [],
      users: {}
    };
  }

  componentDidMount() {
    this.getMessages();
  }

  getMessages() {
    var that = this;
    Storage.getMessages({conversationId: this.props.conversation.id}, (results) => {
      var messages = results.reverse();
      Storage.getUsersInfoWithIdAsKeys({userIds: that.props.conversation.members.split(',')}, (users) => {
        that.setState({
          messages: messages,
          users: users
        });
      });
    });

  }

  /**
   *
   * @param params {text: {string}}
   */
  send(params) {
    params.conversation_id = this.props.conversation.id;
    console.log('ChatDetailView:send message', params);
    var that = this;
    // send message to server
    DataService.sendTextMessage(params, (response) => {
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

    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={[styleCommon.background]}>
        <NavigationBar
          title={{title: this.props.conversation.display_name}}
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
