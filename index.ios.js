/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {AppRegistry, Component, StyleSheet, Navigator, Text, View} = React;
var LoginView = require('./js/LoginView');
var SignUpView = require('./js/SignupView');

(route, routeStack) => Navigator.SceneConfigs.FloatFromRight

class reactNativeChat extends Component {
  componentDidMount() {}
  render() {
    return (
      <Navigator
      style={styles.container}
      initialRoute = {{
        name: 'Signup',
        index: 0
      }}
      renderScene = {this.navigatorRenderScene}
      />
      );
  }
  navigatorRenderScene(route, navigator) {
    switch (route.name) {
      case 'Login':
        return (<LoginView navigator={navigator} title="Login"/>);
      case 'Signup':
        return (<SignUpView navigator={navigator} title="Sign Up" />);
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
