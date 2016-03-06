'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, ListView, View} = React;
var DataService = require('./../classes/DataService');
var Config = require('./../Config');
var LocalizedText = require("./../classes/LocalizedText");
var NavigationBar = require('react-native-navbar');
var Storage = require('./../classes/Storage');

class ChatListView extends Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows([{
        title: 'user 1',
        lastMessage: 'did you?'
      }, {
        title: 'user 2',
        lastMessage: 'you, too?'
      }])
    };
  }

  componentDidMount() {
    /*DataService.sendTextMessage({
      toUsername: "aas",
      text: "123"
    });
    */
  }

  renderRow(rowData) {
    return (
      <Text>
        {rowData.title} : {rowData.lastMessage}
      </Text>
    );
  }

  onEndReached() {}


  renderFooter() {
    return (
      <View  style={{
        alignItems: 'center'
      }}>
        END
      </View>
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
        console.log('Setting!');
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
        renderRow={this.renderRow}
        />
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
