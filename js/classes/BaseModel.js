'use strict';

/**
 * A BaseModel
 */
class BaseModel {

  constructor(data) {
    this._save(data);
  }

  // Update with new data
  _save(data) {
    this._data = {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        this._data[key] = data[key];
      }
    }
  }

  get(key) {
    return this._data[key];
  }

  toPlainObject() {
    return this._data;
  }
}

module.exports = BaseModel;