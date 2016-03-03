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

class LoginView extends Component {

  componentDidMount () {
    DataService.connect();
  }

  register () {
    console.log('register');
    DataService.register();
  }


  login () {
    console.log('login');
  }

  render() {
    var TouchableElement = TouchableHighlight; // for ios
    return (
      <View style={styles.container}>
        <TouchableElement onPress={this.register} style={styles.touchable}>
          <Text style={styles.button}>
            Register
          </Text>
        </TouchableElement>
        <TouchableElement onPress={this.login} style={styles.touchable}>
          <Text style={styles.button}>
          Login
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

AppRegistry.registerComponent('LoginView', () => LoginView);

module.exports = LoginView;