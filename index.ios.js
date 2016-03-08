/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {AppRegistry, Component, StyleSheet, Navigator, Text, View, AppStateIOS} = React;
var LoginView = require('./js/views/LoginView');
var SignUpView = require('./js/views/SignupView');
var ChatListView = require('./js/views/ChatListView');
var LoadingView = require('./js/views/LoadingView');
var NewChatView = require('./js/views/NewChatView');
var ChatDetailView = require('./js/views/ChatDetailView');
var SettingsView = require('./js/views/SettingsView');

(route, routeStack) => Navigator.SceneConfigs.FloatFromRight

class reactNativeChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      route: "Loading",
      appState: AppStateIOS.currentState,
      memoryWarnings: 0
    };
  }

  componentDidMount() {
    AppStateIOS.addEventListener('change', this._handleAppStateChange.bind(this));
    AppStateIOS.addEventListener('memoryWarning', this._handleMemoryWarning.bind(this));
  }

  componentWillUnmount() {
    AppStateIOS.removeEventListener('change', this._handleAppStateChange.bind(this));
    AppStateIOS.removeEventListener('memoryWarning', this._handleMemoryWarning).bind(this);
  }

  _handleMemoryWarning() {
    this.setState({memoryWarnings: this.state.memoryWarnings + 1});
    console.log('reactNativeChat:memoryWarning', this.state.memoryWarnings);
  }
  _handleAppStateChange(appState) {
    this.setState({
      appState
    });
    if (appState == 'active') {
      // TODO: emit some event to notify all UI components to do something.
    }
    console.log('reactNativeChat:AppStateChange', appState);
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
        return (<LoginView navigator={navigator} />);
      case 'Signup':
        return (<SignUpView navigator={navigator} />);
      case 'ChatList':
        return (<ChatListView navigator={navigator} />);
      case 'NewChat':
        return (<NewChatView navigator={navigator} onBack={route.onBack} />);
      case 'ChatDetail':
        return (<ChatDetailView navigator={navigator} conversation={route.conversation} onBack={route.onBack} />);
      case 'Settings':
        return (<SettingsView navigator={navigator} />);
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
