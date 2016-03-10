'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, View} = React;
var Config = require('./../Config');
var LocalizedText = require('./../classes/LocalizedText');

class MessageView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    }
  }

  render() {
    //var TouchableElement = TouchableHighlight; // for ios
    var date = new Date(this.props.ts);
    return (
      <View style={[styles.container]}>
        <Text style={styles.messageText}>{this.props.text}</Text>
        <Text style={styles.username}>{this.props.fromUserDisplayName}</Text>
        <Text style={styles.tsText}>{date.toString()}</Text>
      </View>
    );
  }
}

var styleCommon = require('./../StylesCommon');

const styles = StyleSheet.create({
  container: {
    backgroundColor: Config.styles.colorWhite,
  },
  username: {

  },
  messageText: {
    color: '#333333',
    fontSize: 14
  },
  tsText: {
    color: '#888888',
    fontSize: 12
  }
});

AppRegistry.registerComponent('MessageView', () => MessageView);

module.exports = MessageView;
