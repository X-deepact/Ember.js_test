import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';

export default class MyProfileComponent extends Component {
  lastSavedColor = this.args.account.color;

  get colorStyle() {
    return htmlSafe(`color:#${this.args.account.color};`);
  }

  @task({ restartable: true })
  *inputHandler(event) {
    yield timeout(300); // Wait for 300ms after the last keyup event

    const newColor = event.target.value.trim();

    // Check if the input is a valid HEX color
    const isValidHex = /^[0-9A-Fa-f]{6}$/.test(newColor);

    if (isValidHex && newColor !== this.lastSavedColor) {
      this.args.account.color = newColor;
      yield this.args.account.save();
      this.lastSavedColor = newColor; // Update the last saved color
    }
  }
}