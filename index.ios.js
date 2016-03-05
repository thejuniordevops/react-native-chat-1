/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {AppRegistry, Component, StyleSheet, Navigator, Text, View} = React;
var LoginView = require('./js/views/LoginView');
var SignUpView = require('./js/views/SignupView');
var ChatListView = require('./js/views/ChatListView');
var LoadingView = require('./js/views/LoadingView');
var NewChatView = require('./js/views/NewChatView');

(route, routeStack) => Navigator.SceneConfigs.FloatFromRight

class reactNativeChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      route: "Loading"
    };
  }

  componentDidMount() {

  }
  render() {
    return (
      <Navigator
      style={styles.container}
      initialRoute = {{
        name: 'Loading',
        index: 0
      }}
      renderScene = {this.navigatorRenderScene}
      />
      );
  }
  navigatorRenderScene(route, navigator) {
    switch (route.name) {
      case 'Loading':
        return (<LoadingView navigator={navigator} />);
      case 'Login':
        return (<LoginView navigator={navigator} title="Login"/>);
      case 'Signup':
        return (<SignUpView navigator={navigator} title="Sign Up" />);
      case 'ChatList':
        return (<ChatListView navigator={navigator} title="Chat" />);
      case 'NewChat':
        return (<NewChatView navigator={navigator} title="New Chat" />);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});

AppRegistry.registerComponent('reactNativeChat', () => reactNativeChat);
