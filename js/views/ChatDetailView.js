'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, View, Dimensions, DeviceEventEmitter} = React;
var DataService = require('../classes/DataService');
var ChatHistoryView = require('./ChatHistoryView');
var ChatMessageInputView = require('./ChatMessageInputView');
var Config = require('../Config');
var LocalizedText = require("../classes/LocalizedText");
var NavigationBar = require('react-native-navbar');
var ConversationManager = require('../classes/ConversationManager');
var UserManager = require('../classes/UserManager');
var emitter = require('../classes/Emitter');

//props required: username
class ChatDetailView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      users: {},
      visibleHeight: Dimensions.get('window').height
    };
  }

  componentWillMount () {
    DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    emitter.addListener('newMessageReceived', this.newMessageReceived.bind(this));
  }

  componentWillUnmount () {
    DeviceEventEmitter.removeAllListeners('keyboardWillShow');
    DeviceEventEmitter.removeAllListeners('keyboardWillHide');
    emitter.removeAllListeners('newMessageReceived');
  }

  keyboardWillShow (e) {
    let newSize = Dimensions.get('window').height - e.endCoordinates.height;
    this.setState({visibleHeight: newSize});
  }

  keyboardWillHide (e) {
    this.setState({visibleHeight: Dimensions.get('window').height});
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
      that.setState({
        messages: messages
      });
    });
  }

  newMessageReceived() {
    this.getMessages();
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
    console.log('chatDetailView Height', this.state.visibleHeight);
    return (
      <View style={[styleCommon.background]}>
        <NavigationBar
          title={{title: displayName}}
          leftButton={leftButtonConfig}
        />
        <View style={styles.container}>
          <ChatHistoryView style={[styles.history, {height: this.state.visibleHeight - NAV_HEIGHT - INPUT_HEIGHT}]} messages={this.state.messages} users={this.state.users} />
          <ChatMessageInputView style={styles.inputView} onSend={this.send.bind(this)} />
        </View>
      </View>
    );
  }
}

const NAV_HEIGHT = 64;
const INPUT_HEIGHT = 45;

var styleCommon = require("./../StylesCommon");

const styles = StyleSheet.create({
  container: {

  },
  history: {
    backgroundColor: '#ffffff',
  },
  inputView: {
    height: INPUT_HEIGHT,
    backgroundColor: '#ffffff'
  }
});

AppRegistry.registerComponent('ChatDetailView', () => ChatDetailView);

module.exports = ChatDetailView;
