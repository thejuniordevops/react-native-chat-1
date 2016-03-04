'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TextInput, ActivityIndicatorIOS, TouchableHighlight, Text, View} = React;
var DataService = require('./DataService');
var Config = require('./Config');
var Message = require('./Message');

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errMsg: ''
    };
  }
  componentDidMount() {}

  register() {
    console.log('register');
    //DataService.register();
    this.props.navigator.push({
      name: 'Signup'
    });
  }

  login() {
    console.log('login');
    var that = this;
    DataService.login({
      username: this.state.username,
      password: this.state.password
    }, function (data) {
      console.log('login received', data);
      if (data && !data.err) {
        //data.response includes token, expires, user
        console.log("login success");
      } else {
        that.showError(data.response.msg);
      }
    });
  }

  showError(errMsg) {
    this.setState({errMsg: errMsg});
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
        onPress={this.login.bind(this)}
        activeOpacity={0.8}
        underlayColor={Config.styles.colorWhite}
        style={[styleCommon.touchableButton, styles.login]}>
            <Text style={styleCommon.buttonMedium}>
              {Message.text('login')}
            </Text>
        </TouchableElement>

        <TouchableElement
        onPress={this.register.bind(this)}
        activeOpacity={0.8}
        underlayColor={Config.styles.colorGreen}
        style={[styleCommon.touchableLink, styles.register]}>
            <Text style={styleCommon.textLink}>
              {Message.text('sign_up')}
            </Text>
        </TouchableElement>
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