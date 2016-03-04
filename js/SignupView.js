'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Component,
  StyleSheet,
  TouchableHighlight,
  Text,
  View
  } = React;
var DataService = require('./DataService');
//var Config = require('./Config');

class SignupView extends Component {

  componentDidMount () {
    DataService.connect();
  }

  register () {
    console.log('register');
    DataService.register();
  }


  login () {
    console.log('login');
    this.props.navigator.push({
      name: 'Login'
    });
  }

  render() {
    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={[styleCommon.background, styles.container]}>
        <TextInput
          style={styleCommon.input}
          onChangeText={(username) => this.setState({username})}
          placeholder={"username"}
          value={this.state.username}
        />
        <TextInput
          secureTextEntry={true}
          style={styleCommon.input}
          onChangeText={(password) => this.setState({password})}
          placeholder={"password"}
          value={this.state.password}
        />

        <TouchableElement
        onPress={this.login.bind(this)}
        activeOpacity={0.8}
        underlayColor={Config.styles.colorWhite}
        style={[styleCommon.touchableButton, styles.login]}>
        <Text style={styleCommon.buttonMedium}>
        Login
        </Text>
        </TouchableElement>

        <TouchableElement
        onPress={this.register.bind(this)}
        activeOpacity={0.8}
        underlayColor={Config.styles.colorGreen}
        style={[styleCommon.touchableLink, styles.register]}>
        <Text style={styleCommon.textLink}>
        Register
        </Text>
        </TouchableElement>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 200,
    paddingBottom: 200,
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    width: 200,
    borderRadius:10
  },
  button: {
    fontSize: 16,
    textAlign: 'center',
    width: 200,
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    paddingTop:10,
    paddingBottom:20,
    paddingLeft:20,
    paddingRight:20,

  }
});

AppRegistry.registerComponent('SignupView', () => SignupView);

module.exports = SignupView;
