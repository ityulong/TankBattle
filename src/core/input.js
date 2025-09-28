const KEY_BINDINGS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Space: 'fire',
  Enter: 'pause',
  KeyM: 'mute',
  KeyP: 'pause',
};

export class Input {
  constructor() {
    this.keys = new Map();
    this.listeners = new Map();
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
  }

  install() {
    window.addEventListener('keydown', this._handleKeyDown);
    window.addEventListener('keyup', this._handleKeyUp);
  }

  dispose() {
    window.removeEventListener('keydown', this._handleKeyDown);
    window.removeEventListener('keyup', this._handleKeyUp);
  }

  isPressed(action) {
    return this.keys.get(action) === true;
  }

  once(action, listener) {
    this.listeners.set(action, listener);
  }

  _handleKeyDown(event) {
    const action = KEY_BINDINGS[event.code] || KEY_BINDINGS[event.key];
    if (!action) return;
    if (event.code === 'Space' || action === 'pause' || action === 'mute') {
      event.preventDefault();
    }
    if (!this.keys.get(action)) {
      const listener = this.listeners.get(action);
      if (listener) {
        listener();
        this.listeners.delete(action);
      }
    }
    this.keys.set(action, true);
  }

  _handleKeyUp(event) {
    const action = KEY_BINDINGS[event.code] || KEY_BINDINGS[event.key];
    if (!action) return;
    this.keys.set(action, false);
  }
}
