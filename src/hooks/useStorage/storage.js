export default class Storage {
  check() {
    if (window.localStorage instanceof "function") {
      return true;
    }
    return false;
  }

  static set() {
    return "set";
  }

  static get() {
    return "get";
  }

  static remove() {
    return "remove";
  }

  static clear() {
    return "clear";
  }
}
