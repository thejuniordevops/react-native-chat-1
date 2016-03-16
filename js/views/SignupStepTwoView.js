'use strict';

var React = require('react-native');
var {AppRegistry, Component, StyleSheet, TouchableHighlight, Text, TextInput, View} = React;
var DataService = require('../classes/DataService');
//var Config = require('./Config');

class SignupView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayName: "",
      email: ""
    };
  }

  next() {
    DataService.updateProfile({
      displayName: this.state.displayName,
      email: this.state.email
    });
    this.props.navigator.replace({name: 'ChatList'});
  }

  render() {
    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={styles.container}>
        <TextInput
          style={styleCommon.input}
          placeholder={"Display Name"}
          onChangeText={(displayName) => this.setState({displayName})}
          value={this.state.name}
        />
        <TextInput
          style={styleCommon.input}
          placeholder={"Email"}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
        />
        <TouchableElement onPress={this.next.bind(this)} style={[styleCommon.touchableButton, styles.touchable]}>
          <Text style={styleCommon.buttonMedium}>
            Start
          </Text>
        </TouchableElement>

      </View>
      );
  }
}

var styleCommon = require("./../StylesCommon");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 100,
  },
  input: {

  },
  touchable: {
    width: 200,
    borderRadius: 10,
    marginTop: 10
  },
  button: {
    fontSize: 16,
    textAlign: 'center',
    width: 200,
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,

  }
});

AppRegistry.registerComponent('SignupView', () => SignupView);

module.exports = SignupView;
