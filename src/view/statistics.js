import {createElement} from "../utils/main.js";

const createStatisticsTemplate = (count) => {
  return `
  <p>${count} movies inside</p>
  `;
};

export default class Statistics {
  constructor(movies) {
    this._moviesNumber = movies.length;

    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate(this._moviesNumber);
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