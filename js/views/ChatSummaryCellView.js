'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, View} = React;
var DataService = require('./../classes/DataService');
var Config = require('./../Config');
var LocalizedText = require("./../classes/LocalizedText");

class ChatSummaryCellView extends Component {

  render() {
    var TouchableElement = TouchableHighlight;
    return (
      <View style={styles.cell}>
        <TouchableElement
          style={styles.touchable}
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <View style={styles.textContainerLineOne}>
              <View style={styles.displayNameView}>
                <Text style={styles.displayNameText}>
                  {this.props.displayName}
                </Text>
              </View>
              <View style={styles.lastMessageTSView}>
                <Text style={styles.lastMessageTSText}>
                {this.props.lastMessageTS}
                </Text>
              </View>
            </View>
            <View style={styles.textContainerLineTwo}>
              <Text style={styles.lastMessage}>
                {this.props.lastMessage}
              </Text>
            </View>
          </View>
        </TouchableElement>
      </View>
    );
  }
}

var styleCommon = require('./../StylesCommon');

const styles = StyleSheet.create({
  cell: {
    backgroundColor: '#ffffff'
  },
  touchable: {

  },
  textContainerLineOne: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
  },
  textContainerLineTwo: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  row: {

  },
  displayNameView: {
    marginTop: 0,
    flex: 1,
    flexDirection: 'row',
  },
  displayNameText: {
    fontWeight: 'bold',
  },
  lastMessageTSView: {
    marginRight: 5,
    marginTop: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },

  lastMessageTSText: {
    color: Config.styles.colorDarkGrey,
  },
  lastMessage: {

  }
});

AppRegistry.registerComponent('ChatSummaryCellView', () => ChatSummaryCellView);

module.exports = ChatSummaryCellView;
