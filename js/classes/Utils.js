class Utils {

  tsToHumanReadable(ts) {
    var time = new Date(ts);
    var now = new Date();
    if (now.getTime() - ts > 86400000) {
      // if greater than 24 hours, just show the date
      return time.getFullYear() + '-' + formatNumberDigits(time.getMonth(), 2) + '-' + this.formatNumberDigits(time.getDate(), 2);
    } else {
      return this.formatNumberDigits(time.getHours(), 2) + ':' + this.formatNumberDigits(time.getMinutes(), 2) + ':' + this.formatNumberDigits(time.getSeconds(), 2);
    }
  }

  /**
   * Format number to digits
   * example formatNumberDigits(3, 2) => "03"
   * @param number
   * @param digits
   * @returns {string}
   */
  formatNumberDigits(number, digits) {
    number = number.toString();
    if (number.length >= digits) {
      return number;
    }
    for (var i = number.length; i < digits; i++) {
      number = "0" + number;
    }
    return number;
  }
}


module.exports = new Utils();