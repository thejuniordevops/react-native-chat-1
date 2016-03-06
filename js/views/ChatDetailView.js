'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, ListView, View} = React;
var DataService = require('../classes/DataService');
var ChatHistoryView = require('./ChatHistoryView');
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
    }]; //Storage.getMessages(this.props.username);
    this.setState({
      messages: messages
    });
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
        title={{title: this.props.username}}
        leftButton={leftButtonConfig}
        />
        <ChatHistoryView messages={this.state.messages} />
      </View>
      );
  }
}

var styleCommon = require("./../StylesCommon");

const styles = StyleSheet.create({
});

AppRegistry.registerComponent('ChatDetailView', () => ChatDetailView);

module.exports = ChatDetailView;
