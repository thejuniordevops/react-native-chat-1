'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TextInput, ActivityIndicatorIOS, TouchableHighlight, Text, View} = React;
var Storage = require('../classes/Storage');
var Config = require('../Config');
var LocalizedText = require('../classes/LocalizedText');
var NavigationBar = require('react-native-navbar');
var DataService = require('../classes/DataService');

class SettingsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }
  }
  componentDidMount() {
    Storage.getValueForKey('username', function (username) {
      this.setState({username: username});
    }.bind(this));
  }

  logout() {
    this.props.navigator.push({
      name: 'Login'
    });
    DataService.logout();
  }

  render() {
    var TouchableElement = TouchableHighlight; // for ios
    var that = this;
    var leftButtonConfig = {
      title: 'Back',
      handler: () => {
        that.props.navigator.pop();
      }
    };
    return (
      <View>
        <NavigationBar
          title={{
            title: LocalizedText.text('setting')
          }}
          leftButton={leftButtonConfig}
        />
        <View style={[styleCommon.background, styles.container]}>
          <Text>{LocalizedText.text('username')}: {this.state.username}</Text>
          <TouchableElement
          onPress={this.logout.bind(this)}
          activeOpacity={0.8}
          underlayColor={Config.styles.colorWhite}
          style={[styleCommon.touchableButton, styles.login]}>
          <Text style={styleCommon.buttonMedium}>
            {LocalizedText.text('logout')}
          </Text>
          </TouchableElement>
        </View>
      </View>
    );
  }
}

var styleCommon = require('./../StylesCommon');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 200,
    paddingBottom: 200,
  },
  login: {
    marginTop: 20,
  }
});

AppRegistry.registerComponent('SettingsView', () => SettingsView);

module.exports = SettingsView;