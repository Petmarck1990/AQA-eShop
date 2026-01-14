if (!global._globalStorage) {
  global._globalStorage = {};

  module.exports = {
    set(key, value) {
      global._globalStorage[key] = value;
    },
    get(key) {
      return global._globalStorage[key];
    },
    delete(key) {
      delete global._globalStorage[key];
    },
    clear() {
      global._globalStorage = {};
    },
    all() {
      return { ...global._globalStorage };
    },
  };
}
