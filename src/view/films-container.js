import {createElement} from "../utils/main.js";

const createFilmsContainerTemplate = (container) => {
  const {elementClass, heading, visuallyHidden} = container;

  return `
  <section class="${elementClass}">
    <h2 class="films-list__title ${visuallyHidden ? `visually-hidden` : ``}">${heading}</h2>
    <div class="films-list__container"></div>
  </section>
  `;
};

export default class FilmsContainer {
  constructor(container) {
    this.container = container;

    this._element = null;
  }

  getTemplate() {
    return createFilmsContainerTemplate(this.container);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
