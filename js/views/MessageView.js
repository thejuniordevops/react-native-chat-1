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

  toDate(ts) {
    var date = new Date(ts);
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  }

  render() {
    return (
      <View style={[styles.container]}>
      <View style={styles.infoView}>
        <Text style={styles.username}>{this.props.fromUserDisplayName}</Text>
        <Text style={styles.tsText}>@{this.toDate(this.props.ts)}</Text>
      </View>

      <Text style={styles.messageText}>{this.props.text}</Text>
      </View>
    );
  }
}

var styleCommon = require('./../StylesCommon');

const styles = StyleSheet.create({
  container: {
    backgroundColor: Config.styles.colorWhite,
  },
  infoView: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
  },
  username: {
    color: '#0095ff'
  },
  messageText: {
    backgroundColor: Config.styles.colorLightGrey,
    width: 250,
    color: '#333333',
    fontSize: 14,
    marginLeft: 40,
    padding: 10,
    borderRadius: 5
  },
  tsText: {
    color: '#888888',
    fontSize: 12,
    marginLeft:5
  }
});

AppRegistry.registerComponent('MessageView', () => MessageView);

module.exports = MessageView;
