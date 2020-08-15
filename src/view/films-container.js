import {createElement} from "../utils/main.js";

const createFilmsContainerTemplate = (container) => {
  const {elementClass, heading, visuallyHidden} = container;

  const headingAndContainer = heading ? `<h2 class="films-list__title ${visuallyHidden ? `visually-hidden` : ``}">${heading}</h2>
  <div class="films-list__container"></div>` : ``;

  return `
  <section class="${elementClass}">
    ${headingAndContainer}
  </section>
  `;
};

export default class FilmsContainer {
  constructor(container) {
    this._container = container;

    this._element = null;
  }

  getTemplate() {
    return createFilmsContainerTemplate(this._container);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    if (this._element) {
      this._element.remove();
    }

    this._element = null;
  }
}
