'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, ListView, View} = React;
var DataService = require('../classes/DataService');
var Config = require('../Config');
var LocalizedText = require("../classes/LocalizedText");
var NavigationBar = require('react-native-navbar');
var Storage = require('../classes/Storage');
var ConversationManager = require('../classes/ConversationManager');
var UserManager = require('../classes/UserManager');
var ChatSummaryCellView = require('./ChatSummaryCellView');

class ChatListView extends Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {r1 != r2}
    });
    this.state = {
      dataSource: ds,
      users: {}
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
    //first fetch from local
    this.updateDataSource();
    this.fetchNewMessages();
  }

  fetchNewMessages() {
    var that = this;
    // fetch any new messages from server
    ConversationManager.getNewMessages((res) => {
      if (res.newMessages) {
        that.updateDataSource();
      }
    });
  }

  /**
   * @param params {fromServer: boolean}
   */
  updateDataSource() {
    var that = this;
    console.log('updateDataSource');
    ConversationManager.getAllConversations((conversations) => {
      console.log('ChatListView:updateDataSource:getConversations', conversations);
      that.setState({dataSource: that.state.dataSource.cloneWithRows(conversations)});
    });
  }

  /**
   * Fetch users data from server
   */
  updateUsersFromDataService(userIds) {
    // fetch users data
    var that = this;
    DataService.getUsers({userIds: userIds}, (users) => {
      var usersObj = {};
      for (var j = 0; j < users.length; j++) {
        usersObj[users[j].id] = users[j];
      }
      that.setState({users: usersObj});
    });
  }

  /**
   * Fetch users data from storage
   */
  updateUsersFromStorage(userIds) {
    // nothing to do here
  }

  /**
   * Select a conversation and jump into details
   */
  selectConversation(conversation) {
    console.log('selectConversation', conversation);
    this.props.navigator.push({
      name: 'ChatDetail',
      conversation: conversation,
      onBack: this.back.bind(this)
    });
  }

  back() {
    console.log('ChatListView:back:updateDataSource');
    this.updateDataSource();
    this.fetchNewMessages();
  }

  renderRow(
    conversation: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void
  ) {
  console.log('render row', conversation.get('last_message_ts'));
    return (
      <ChatSummaryCellView
        onSelect={() => this.selectConversation(conversation)}
        id={conversation.get('id')}
        displayName={conversation.getDisplayName()}
        lastMessage={conversation.get('last_message')}
        lastMessageTS={conversation.get('last_message_ts')}
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
          name: 'NewChat',
          onBack: that.back.bind(that)
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
