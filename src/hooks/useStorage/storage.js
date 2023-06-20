export default class Storage {
  static set(project, key, value) {
    if (typeof value === "object") {
      localStorage.setItem(`${project}.${key}`, JSON.stringify(value));
    } else {
      localStorage.setItem(`${project}.${key}`, value);
    }
  }

  static get(project, key) {
    try {
      return JSON.parse(localStorage.getItem(`${project}.${key}`));
    } catch {
      return localStorage.getItem(`${project}.${key}`);
    }
  }

  static remove(project, key) {
    return localStorage.removeItem(`${project}.${key}`);
  }

  static clear() {
    return localStorage.clear();
  }
}
