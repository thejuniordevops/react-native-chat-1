var lang = {};
lang.enUS = require('./languages/en_us');
lang.zhCN = require('./languages/zh_cn');
class Message {
  constructor () {
    this.defaultLang = "enUS";
  }
  text (id) {
    return lang[this.defaultLang][id];
  }
}

module.exports = new Message();
