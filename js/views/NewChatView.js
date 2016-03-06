'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, TextInput, ListView, View} = React;
var DataService = require('./../classes/DataService');
var Config = require('./../Config');
var LocalizedText = require("./../classes/LocalizedText");
var NavigationBar = require('react-native-navbar');
var Storage = require('./../classes/Storage');

class NewChatView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toUsername: ''
    };
  }

  startChat() {
    this.props.navigator.replace({
      name: 'ChatDetail',
      username: this.state.toUsername
    });
  }

  render() {
    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={[styleCommon.background, styles.container]}>
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
  input: {
    marginTop: 40
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
