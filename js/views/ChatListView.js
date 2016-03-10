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
    // fetch all users from server
    DataService.getNewMessages();
    this.updateDataSource({fromServer: true});
  }

  /**
   * @param params {fromServer: boolean}
   */
  updateDataSource(params) {
    var that = this;
    params = params || {};
    Storage.getConversations((newListData) => {
      console.log('ChatListView:updateDataSource:getConversations length=', newListData);
      if (params.fromServer) {
        that.updateUsersFromDataService(DataService.getUserIdsFromConversations(newListData));
      } else {
        that.updateUsersFromStorage(DataService.getUserIdsFromConversations(newListData));
      }
      that.setState({dataSource: that.state.dataSource.cloneWithRows(newListData)});
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
        usersObj[users[j]._id] = users[j];
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
   * Lazy processing display name.
   * It will be saved into conversations data once done
   * if the conversation display_name is set, use it
   * Otherwise concat the users display names
   * TODO: probably this should be done in DataService not here.
   * TODO: However this isn't very ideal. Because if server push a change into client. client won't update display name until it get's back into this screen
   */
  getConversationDisplayName(conversation) {
    if (conversation.display_name) {
      return conversation.display_name;
    } else {
      var displayName = [];
      var that = this;
      var myInfo = Storage.getMyInfo();
      var myId = myInfo.user_id;
      console.log('myId', myId);
      conversation.members.split(',').forEach((userId) => {
        if(myId != userId && that.state.users[userId]) {
          displayName.push(that.state.users[userId].display_name || that.state.users[userId].username);
        }
      });
      conversation.display_name = displayName.join(', ');
      return conversation.display_name;
    }
  }

  /**
   * new conversation is created
   */
  onNewConversation() {
    // TODO: listen to an event new converation created, then update the list
    this.updateDataSource({fromServer: true});
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
    this.updateDataSource({fromServer: false});
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
        displayName={this.getConversationDisplayName(conversation)}
        lastMessage={conversation.last_message}
        lastMessageTS={conversation.last_message_ts}
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
