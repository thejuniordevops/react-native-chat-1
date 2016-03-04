'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Component,
  StyleSheet,
  TextInput,
  ActivityIndicatorIOS,
  TouchableHighlight,
  Text,
  View
  } = React;
var DataService = require('./DataService');
var Config = require('./Config');


class LoginView extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      username: "",
      password: ""
    };
    this.register.bind(this);
    this.login.bind(this);
  }
  componentDidMount () {

  }

  register () {
    console.log('register');
    //DataService.register();
    this.props.navigator.push({
      name: 'Signup'
    });
  }

  login () {
    console.log('login');

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

var styleCommon = require("./StylesCommon");

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
  },
  register: {
    marginTop: 50,
  }

});

AppRegistry.registerComponent('LoginView', () => LoginView);

module.exports = LoginView;