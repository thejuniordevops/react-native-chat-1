'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, TextInput, View} = React;
var MessageView = require('./MessageView');
var Config = require('../Config');
var LocalizedText = require("../classes/LocalizedText");

class ChatMessageInputView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  sendMessage () {
    if (this.props.onSend) {
      this.props.onSend({message: this.state.message});
    }
  }

  render() {
    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={[styleCommon.background, styles.container]}>
        <TextInput
          style={[styleCommon.input, styles.input]}
          onChangeText={(message) => this.setState({message})}
          value={this.state.message} />
        <TouchableElement
          onPress={this.sendMessage.bind(this)}
          activeOpacity={0.8}
          underlayColor={Config.styles.colorGreen}
          style={[styleCommon.touchableLink]}>
          <Text style={styleCommon.buttonMedium}>
            {LocalizedText.text('send')}
          </Text>
        </TouchableElement>
      </View>
    );
  }
}

var styleCommon = require("./../StylesCommon");

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff'
  }
});

AppRegistry.registerComponent('ChatMessageInputView', () => ChatMessageInputView);

module.exports = ChatMessageInputView;
