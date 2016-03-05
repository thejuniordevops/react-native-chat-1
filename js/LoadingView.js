'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, Text, View} = React;
var DataService = require('./DataService');

class LoadingView extends Component {

  componentDidMount() {
    var that = this;
    DataService.loginWithToken((res) => {
      if (res.err) {
        this.props.navigator.push({
          name: 'Signup'
        });
      } else {
        this.props.navigator.push({
          name: 'ChatList'
        });
      }
    });
  }

  render() {
    return (
      <View style={[styleCommon.background, styles.container]}>
        <Text style={styles.container}>Loading</Text>
      </View>
    );
  }
}

var styleCommon = require('./StylesCommon');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 200,
    paddingBottom: 200,
  }

});

AppRegistry.registerComponent('LoadingView', () => LoadingView);

module.exports = LoadingView;