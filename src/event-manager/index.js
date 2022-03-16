const events = require("events");

class EventManager {
  constructor() {
    this.events = new events.EventEmitter();
  }

  static getInstance() {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  registerEvent(name, callback) {
    this.events.addListener(name, callback);
  }

  unRegister(name, callback) {
    this.events.removeListener(name, callback);
  }
  onceEvent(name, callback) {
    this.events.once(name, callback);
  }
  emitEvent(name, data) {
    this.events.emit(name, data);
  }
  emitOn(name, callback) {
    this.events.on(name, callback);
  }
 
  clearEvents() {}

  clearAllEvents() {
    this.events = null;
    EventManager.instance = undefined;
  }
}

export default EventManager;
