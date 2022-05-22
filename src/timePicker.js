// import { TimepickerUI } from 'timepicker-ui';
// eslint-disable-next-line import/extensions
import { TimepickerUI } from './timepicker-ui.umd.js';

const DOMElement = document.querySelectorAll('.time-picker');
for (let i = 0; i < DOMElement.length; i++) {
  console.log(DOMElement[i])
  const options = {};
  const newTimepicker = new TimepickerUI(DOMElement[i], options);
  newTimepicker.create();
  console.log(newTimepicker);
}
