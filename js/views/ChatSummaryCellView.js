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
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.displayName} numberOfLines={1}>
                {this.props.displayName}
              </Text>
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
  textContainer: {

  },
  row: {

  },
  displayName: {

  },
  lastMessage: {

  }
});

AppRegistry.registerComponent('ChatSummaryCellView', () => ChatSummaryCellView);

module.exports = ChatSummaryCellView;
