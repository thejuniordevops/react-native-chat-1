'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, ListView, View} = React;
var DataService = require('../classes/DataService');
var Config = require('../Config');
var LocalizedText = require("../classes/LocalizedText");
var NavigationBar = require('react-native-navbar');
var Storage = require('../classes/Storage');
var ChatSummaryCellView = require('./ChatSummaryCellView');

class ChatListView extends Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {r1 != r2}
    });
    this.state = {
      dataSource: ds
    };
  }

  getDataSource(rows: Array<any>): ListView.DataSource {
    var rowIds = [];
    for (var i = 0; i < rows.length; i++) {
      rowIds.push(rows[i].id);
    }
    return this.state.dataSource.cloneWithRows(rows, rowIds);
  }

  componentDidMount() {
    var that = this;
    Storage.getConversations((results) => {
      var newListData = [];
      for (var i = 0; i < results.rows.length; i++) {
        newListData.push({
          id: results.rows.item(i).id,
          displayName: results.rows.item(i).display_name,
          lastMessage: results.rows.item(i).last_message,
          lastMessageTS: results.rows.item(i).last_message_ts
        });
      }
      console.log('ChatList', newListData);
      that.setState({dataSource: that.state.dataSource.cloneWithRows(newListData)});
    });
  }

  selectConversation(conversation) {
    console.log('selectConversation', conversation);
    this.props.navigator.push({
      name: 'ChatDetail',
      conversation: conversation
    });
  }

  renderRow(
    conversation: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void
  ) {
    return (
      <ChatSummaryCellView
        onSelect={() => this.selectConversation(conversation)}
        id={conversation.id}
        displayName={conversation.displayName}
        lastMessage={conversation.lastMessage}
        lastMessageTS={conversation.lastMessageTS}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
      />
    );
  }

  render() {
    var that = this;
    var rightButtonConfig = {
      title: 'New',
      handler: () => {
        that.props.navigator.push({
          name: 'NewChat'
        });
      }
    };
    var leftButtonConfig = {
      title: 'Setting',
      handler: () => {
        that.props.navigator.push({
          name: 'Settings'
        });
      }
    };
    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={[styleCommon.background, styles.container]}>
        <NavigationBar
        title={{
          title: LocalizedText.text('chat')
        }}
        leftButton={leftButtonConfig}
        rightButton={rightButtonConfig}
        />
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        />
        <Text>{this.state.test}</Text>
      </View>
      );
  }
}

var styleCommon = require("./../StylesCommon");

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

AppRegistry.registerComponent('ChatListView', () => ChatListView);

module.exports = ChatListView;
