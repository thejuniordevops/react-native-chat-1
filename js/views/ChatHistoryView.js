'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, ListView, View} = React;
var MessageView = require('./MessageView');

class ChatHistoryView extends Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.messages)
    });
  }

  renderRow(message) {
    return (
      <MessageView ts={message.created_at} text={message.text} fromUserId={message.created_by} />
    );
  }

  render() {
    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={[styleCommon.background, styles.container]}>
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        />
      </View>
    );
}
}

var styleCommon = require("./../StylesCommon");

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  }
});

AppRegistry.registerComponent('ChatHistoryView', () => ChatHistoryView);

module.exports = ChatHistoryView;
