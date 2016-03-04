'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, TextInput, View} = React;
var DataService = require('./DataService');
var Config = require('./Config');
var Message = require("./Message");

class SignupView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errMsg: ""
    };
  }

  componentDidMount() {
    DataService.connect();
  }

  register() {
    var that = this;
    DataService.register({
      username: this.state.username,
      password: this.state.password
    }, function (data) {
      console.log("register received", data);
      if (data && !data.err) {
        //data.response includes token, expires, user
        that.goToStepTwo();
      } else {
        that.showError(data.response.msg);
      }
    });
  }

  goToStepTwo() {

  }

  showError(errMsg) {
    this.setState({errMsg: errMsg});
  }

  login() {
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
        onChangeText={(username) => this.setState({
          username
        })}
        placeholder={Message.text('username')}
        value={this.state.username}
        />
        <TextInput
        secureTextEntry={true}
        style={styleCommon.input}
        onChangeText={(password) => this.setState({
          password
        })}
        placeholder={Message.text('password')}
        value={this.state.password}
        />
        <Text style={styleCommon.error}>
          {this.state.errMsg}
        </Text>
        <TouchableElement
        onPress={this.register.bind(this)}
        activeOpacity={0.8}
        underlayColor={Config.styles.colorWhite}
        style={[styleCommon.touchableButton, styles.register]}>
        <Text style={styleCommon.buttonMedium}>
          {Message.text('sign_up')}
        </Text>
        </TouchableElement>

        <TouchableElement
        onPress={this.login.bind(this)}
        activeOpacity={0.8}
        underlayColor={Config.styles.colorGreen}
        style={[styleCommon.touchableLink, styles.login]}>
        <Text style={styleCommon.textLink}>
          {Message.text('login')}
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
    marginTop: 50,
  },
  register: {
    marginTop: 20,
  }
});

AppRegistry.registerComponent('SignupView', () => SignupView);

module.exports = SignupView;
