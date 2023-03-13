import type { App, Component } from 'vue';

const fps = 20;

/**
 * Possible buttons we'll read from the mat
 */
type ButtonName = 'lowerLeft' | 'lowerRight' | 'midLeft' | 'midRight' | 'down';

class ButtonState {
  public readonly name: ButtonName;

  private isDownLast = false;
  private isDown = false;

  constructor(name: ButtonName) {
    this.name = name;
  }

  public update(g: Gamepad) {
    this.isDownLast = this.isDown;

    switch (g.mapping) {
      // https://w3c.github.io/gamepad/#remapping
      // https://w3c.github.io/gamepad/standard_gamepad.svg
      case 'standard':
        switch (this.name) {
          case 'lowerLeft':
            this.isDown = g.buttons[3].pressed;
            break;
          case 'lowerRight':
            this.isDown = g.buttons[2].pressed;
            break;
          case 'midLeft':
            this.isDown = g.buttons[14].pressed;
            break;
          case 'midRight':
            this.isDown = g.buttons[15].pressed;
            break;
        }
        break;

      // https://immersive-web.github.io/webxr-gamepads-module/#xr-standard-heading
      default:
        switch (this.name) {
          case 'lowerLeft':
            this.isDown = g.buttons[3].pressed;
            break;
          case 'lowerRight':
            this.isDown = g.buttons[2].pressed;
            break;
          case 'down':
            this.isDown = g.buttons[14].pressed;
            break;
          case 'midLeft':
            this.isDown = g.buttons[11].pressed;
            break;
          case 'midRight':
            this.isDown = g.buttons[11].pressed;
            break;
        }
        break;
    }
  }

  public get down() {
    return this.isDown;
  }

  public get up() {
    return !this.isDown;
  }

  public get pressed() {
    return !this.isDownLast && this.isDown;
  }

  public get released() {
    return this.isDownLast && !this.isDown;
  }
}

const buttons = [
  new ButtonState('lowerLeft'),
  new ButtonState('lowerRight'),
  new ButtonState('midLeft'),
  new ButtonState('midRight'),
];

/**
 * Callbacks that have been registered by vue components
 */
const onPressCallbacks: { [button: string]: [Component, Function][] } = {};

function update() {
  for (const gamepad of navigator.getGamepads()) {
    if (gamepad && gamepad.connected) {
      for (const button of buttons) {
        button.update(gamepad);

        if (button.pressed && onPressCallbacks[button.name]) {
          for (const [comp, callback] of onPressCallbacks[button.name]) {
            callback();
          }
        }
      }
    }
  }
}

function onDancematPress(this: Component, btName: ButtonName, cb: Function) {
  console.log(`Registering ${btName}`);
  console.log(this);

  if (!onPressCallbacks[btName]) {
    onPressCallbacks[btName] = [];
  }
  onPressCallbacks[btName].push([this, cb]);
}

export default {
  install: (app: App) => {
    const id = setInterval(update, 1 / fps * 1000);

    // Register the component and it's caller
    app.config.globalProperties.$onDancematPress = onDancematPress;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $onDancematPress: (this: Component, btName: ButtonName, cb: Function) => void
  }
}