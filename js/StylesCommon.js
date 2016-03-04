'use strict';
var React = require('react-native');
var {
  StyleSheet
  } = React;
var Config = require('./Config');


const styles = StyleSheet.create({
  background: {
    backgroundColor: Config.styles.colorGreen
  },
  touchableButton: {
    backgroundColor: Config.styles.colorLightGrey
  },
  touchableLink: {

  },
  textLink: {
    fontSize: 14,
    color: Config.styles.colorWhite
  },
  buttonMedium: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
    textAlign: 'center',
    width: 200,
    borderRadius: 5,
    backgroundColor: Config.styles.colorLightGrey,
    paddingTop:15,
    paddingBottom:15,
    paddingLeft:20,
    paddingRight:20
  },
  buttonSmall: {
    fontSize: 12,
  },
  buttonLarge: {
    fontSize: 16,
  },
  buttonPlain: {
    fontSize: 14,
  },
  input: {
    fontSize: 14,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop:5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: Config.styles.colorWhite
  }
});
module.exports = styles;