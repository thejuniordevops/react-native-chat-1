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

  componentDidUpdate() {
    // Auto scroll to bottom
    if("listHeight" in this.state &&
      "footerY" in this.state &&
      this.state.footerY > this.state.listHeight)
    {
      var scrollDistance = this.state.listHeight - this.state.footerY;
      this.refs.list.getScrollResponder().scrollTo({
        x: 0,
        y: -scrollDistance,
        animated: false
      });
    }
  }

  onListViewLayout(event) {
    var layout = event.nativeEvent.layout;

    this.setState({
      listHeight : layout.height
    });
    //console.log('ChatHistoryView:onListViewLayout');
  }

  renderFooter() {
    return (<View onLayout={(event)=>{
      this.setState({
        footerY : event.nativeEvent.layout.y
      });
    }}></View>);
  }

  getDisplayName(userId) {
    console.log('this.props.users', this.props.users);
    if (this.props.users[userId]) {
      return this.props.users[userId].getDisplayName();
    }
    return 'unknown user';
  }

  renderRow(message) {
    return (
      <MessageView ts={message.created_at} text={message.text} fromUserDisplayName={this.getDisplayName(message.created_by)} />
    );
  }

  renderSeparator(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean) {
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={styles.rowSeparator}/>
    );
  }

  onEndReached() {
    console.log('ChatHistoryView:onEndReached');
  }

  render() {

    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={this.props.style}>
        <ListView
        ref="list"
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        renderSeparator={() => {}}
        onEndReached={this.onEndReached}
        onLayout={this.onListViewLayout.bind(this)}
        renderFooter={this.renderFooter.bind(this)}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
        />
      </View>
    );
}
}

var styleCommon = require("./../StylesCommon");

const styles = StyleSheet.create({
  rowSeparator: {
    height: 1,
  },
});

AppRegistry.registerComponent('ChatHistoryView', () => ChatHistoryView);

module.exports = ChatHistoryView;
