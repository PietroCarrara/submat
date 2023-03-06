import type { App, Component } from 'vue';

const fps = 20;

/**
 * Possible buttons we'll read from the mat
 */
type ButtonName = 'lowerLeft' | 'lowerRight' | 'midLeft' | 'midRight';

class ButtonState {
  public readonly name: ButtonName;
  public readonly index: number;

  private isDownLast = false;
  private isDown = false;

  constructor(name: ButtonName, index: number) {
    this.name = name;
    this.index = index;
  }

  public update(g: Gamepad) {
    this.isDownLast = this.isDown;

    switch (g.mapping) {
      // https://w3c.github.io/gamepad/#remapping
      // https://w3c.github.io/gamepad/standard_gamepad.svg
      case 'standard':
        switch (this.name) {
          case 'lowerLeft':
            this.isDown = g.buttons[3].pressed; // Triangle in standard gamepad
            break;
          case 'lowerRight':
            this.isDown = g.buttons[2].pressed; // Square in standard gamepad
            break;
          case 'midLeft':
            this.isDown = g.buttons[14].pressed; // Left arrow in standard gamepad
            break;
          case 'midRight':
            this.isDown = g.buttons[15].pressed; // Right arrow in standard gamepad
            break;
        }
        break;

      // https://immersive-web.github.io/webxr-gamepads-module/#xr-standard-heading
      default:
        switch (this.name) {
          case 'lowerLeft':
            this.isDown = g.buttons[2].pressed; // Triangle in xr gamepad
            break;
          case 'lowerRight':
            this.isDown = g.buttons[3].pressed; // Square in xr gamepad
            break;
          case 'midLeft':
            this.isDown = g.axes[6] <= -0.5; // Left arrow in xr gamepad
            break;
          case 'midRight':
            this.isDown = g.axes[6] >= 0.5; // Right arrow in xr gamepad
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
  new ButtonState('lowerLeft', 2), // Triangle
  new ButtonState('lowerRight', 3), // Square
  new ButtonState('midLeft', 6), // Left arrow
  new ButtonState('midRight', 6), // Right arrow
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