import {createElement} from "../utils/main.js";

const createSortMenuTemplate = () => {
  return `
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>
  `;
};

export default class SortMenu {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortMenuTemplate();
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
