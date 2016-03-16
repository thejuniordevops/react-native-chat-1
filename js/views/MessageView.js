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
    var styles = this.props.isMine ? stylesMine : stylesNotMine;
    return (
      <View style={[stylesShared.container, styles.container]}>
      <View style={[stylesShared.infoView, styles.infoView]}>
        <Text style={[stylesShared.username, styles.username]}>{this.props.fromUserDisplayName}</Text>
        <Text style={styles.tsText}> @{this.toDate(this.props.ts)}</Text>
      </View>
      <View style={[stylesShared.messageTextView, styles.messageTextView]}>
        <Text style={[stylesShared.messageText, styles.messageText]}>{this.props.text}</Text>
      </View>
      </View>
    );
  }
}

var styleCommon = require('./../StylesCommon');
const TEXT_BOX_MARGIN = 25;

const stylesShared = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: Config.styles.colorWhite,
  },
  infoView: {
    flex: 1,
    marginTop: 5,
    marginBottom: 0
  },

  messageTextView: {
    flex:1,
    flexDirection: 'row',
    //backgroundColor: '#cccccc',
  },
  messageText: {
    color: '#333333',
    fontSize: 14,
    padding: 15,
    marginTop: 5,
    marginBottom: 10,
    // TODO: borderRadius property is buggy. To find out a way to do border radius.
  },
  tsText: {
    color: '#888888',
    fontSize: 12,
  }
});

const stylesMine = StyleSheet.create({
  infoView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'flex-end',
    marginRight: 10
  },
  username: {
    color: '#1e9609'
  },
  messageTextView: {
    justifyContent:'flex-end',
    marginRight: TEXT_BOX_MARGIN
  },
  messageText: {
    backgroundColor: '#85c47d'
  }
});

const stylesNotMine = StyleSheet.create({
  infoView: {
    flexDirection: 'row',
    justifyContent:'flex-start',
    marginLeft: 10,
  },
  username: {
    color: '#0095ff'
  },
  messageTextView: {
    justifyContent:'flex-start',
    marginLeft: TEXT_BOX_MARGIN
  },
  messageText: {
    backgroundColor: Config.styles.colorLightGrey
  }
});

AppRegistry.registerComponent('MessageView', () => MessageView);

module.exports = MessageView;
