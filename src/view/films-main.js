import {createElement} from "../utils/main";

const createFilmsMainTemplate = () => {
  return `
  <section class="films">
  </section>
  `;
};

export default class FilmnsMain {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsMainTemplate();
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
