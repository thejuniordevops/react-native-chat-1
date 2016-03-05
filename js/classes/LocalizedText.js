// Localized text
var lang = {};
lang.enUS = require('./../languages/en_us');
lang.zhCN = require('./../languages/zh_cn');
class LocalizedText {
  constructor () {
    this.defaultLang = "enUS";
  }
  text (id) {
    return lang[this.defaultLang][id];
  }
}

module.exports = new LocalizedText();
