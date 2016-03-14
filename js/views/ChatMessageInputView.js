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
      this.props.onSend({text: this.state.message});
      this.setState({message: ''});
    }
  }

  render() {
    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={[this.props.style, styles.container]}>
        <View style={styles.inputView}>
            <TextInput
              returnKeyType={'send'}
              style={[styleCommon.input, styles.input]}
              onChangeText={(message) => this.setState({message})}
              onSubmitEditing={this.sendMessage.bind(this)}
              value={this.state.message} />
        </View>
        <View style={styles.buttonView}>
          <TouchableElement
            onPress={this.sendMessage.bind(this)}
            activeOpacity={0.8}
            underlayColor={Config.styles.colorWhite}
            style={[styleCommon.touchableButton, styles.touchableSend]}>
            <Text style={[styleCommon.buttonSmall, styles.buttonSend]}>
              {LocalizedText.text('send')}
            </Text>
          </TouchableElement>
        </View>
      </View>
    );
  }
}

var styleCommon = require("./../StylesCommon");
const BUTTON_WIDTH = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: Config.styles.colorLightGrey,
    height: 45
  },
  inputView: {
    flex: 1
  },
  input: {
    paddingLeft: 5,
    paddingRight: 5,
    height: 25,
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonView: {
    width: BUTTON_WIDTH,
    marginTop: 5
  },
  touchableSend: {

  },
  buttonSend: {
    backgroundColor: Config.styles.colorGreen,
    width: BUTTON_WIDTH,
    height: 25
  }
});

AppRegistry.registerComponent('ChatMessageInputView', () => ChatMessageInputView);

module.exports = ChatMessageInputView;
