'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, TextInput, ListView, View} = React;
var DataService = require('../classes/DataService');
var Config = require('../Config');
var LocalizedText = require("../classes/LocalizedText");
var NavigationBar = require('react-native-navbar');
var ConversationManager = require('../classes/ConversationManager');
var UserManager = require('../classes/UserManager');
var Storage = require('../classes/Storage');

class NewChatView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toUsername: ''
    };
  }

  startChat() {
    var that = this;
    var myInfo = Storage.getMyInfo();
    if (myInfo.username == this.state.toUsername) {
      alert('cannot chat with your self');
      return;
    }
    DataService.usernameLookUp({username: this.state.toUsername}, (res) => {
      if (res.err || !res.response.data) {
        //TODO: show some error messages (invalid username)
        console.log('NewChatView:start chat error');
      } else {
        var user = res.response.data;
        ConversationManager.newConversation({userIds: [user.id]}, (data) => {
          console.log("newchatView: newConversation", data.conversation);
          // Go directly into conversation detail
          that.props.navigator.replace({
            name: 'ChatDetail',
            conversation: data.conversation,
            onBack: that.props.onBack
          });
          //that.props.onBack && that.props.onBack(); // call on back anyway to refresh chat list
        });
        console.log('NewChatView:start chat with user', user);
      }
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
      <View style={[styleCommon.background, styles.container]}>
        <NavigationBar
          title={{title: LocalizedText.text('new_conversation')}}
          leftButton={leftButtonConfig}
        />
        <TextInput
          style={[styleCommon.input, styles.input]}
          onChangeText={(toUsername) => this.setState({
            toUsername
          })}
          placeholder={LocalizedText.text('to_username')}
          value={this.state.toUsername}
        />
        <TouchableElement
          onPress={this.startChat.bind(this)}
          activeOpacity={0.8}
          underlayColor={Config.styles.colorWhite}
          style={[styleCommon.touchableLink, styles.button]}>
          <Text style={styleCommon.buttonMedium}>
            {LocalizedText.text('start_new_chat')}
          </Text>
        </TouchableElement>
      </View>
      );
  }
}

var styleCommon = require("./../StylesCommon");

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    flex: 0,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50
  }
});

AppRegistry.registerComponent('NewChatView', () => NewChatView);

module.exports = NewChatView;
