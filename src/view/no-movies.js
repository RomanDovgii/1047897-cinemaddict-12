import {createElement} from "../utils/main.js";

const createNoMoviesTemplate = () => {
  return `
  <h2 class="films-list__title">There are no movies in our database</h2>
  `;
};

export default class NoMovies {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoMoviesTemplate();
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
