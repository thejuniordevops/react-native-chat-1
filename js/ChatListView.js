'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, ListView, View} = React;
var DataService = require('./DataService');
var Config = require('./Config');
var Message = require("./Message");
var NavigationBar = require('react-native-navbar');
var Storage = require('./Storage');

class ChatListView extends Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([{title: 'user 1', lastMessage: 'did you?'}, {title: 'user 2', lastMessage: 'you, too?'}])
    };
  }

  componentDidMount() {
  }

  renderSeparator(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
      style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  }

  hasMore() {

  }

  renderRow(rowData) {
    return (
      <Text>
        {rowData.title} : {rowData.lastMessage}
      </Text>
    );
  }

  onEndReached () {

  }


  renderFooter() {
    return (
      <View  style={{alignItems: 'center'}}>
        END
      </View>
    );
  }

  render() {
    var rightButtonConfig = {
      title: 'New',
      handler: () => {
        console.log('new!');
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
          title={{title: this.props.title}}
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

var styleCommon = require("./StylesCommon");

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
