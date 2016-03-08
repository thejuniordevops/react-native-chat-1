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
    }
  }

  render() {
    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={[this.props.style, styles.container]}>
        <TextInput
          style={[styleCommon.input, styles.input]}
          onChangeText={(message) => this.setState({message})}
          value={this.state.message} />
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
    );
  }
}

var styleCommon = require("./../StylesCommon");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  input: {
    marginTop: 15,
    marginLeft: 5,
    marginRight:5,
    paddingLeft: 5,
    paddingRight: 5,
    width: 430,
    height: 20,
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  touchableSend: {
    marginTop: 15,
    marginRight: 5,
    width: 50,
    height: 20,
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonSend: {
    width: 50
  }
});

AppRegistry.registerComponent('ChatMessageInputView', () => ChatMessageInputView);

module.exports = ChatMessageInputView;
