import {createElement} from "../utils/main";

const createMoreButtonTemplate = () => {
  return `
  <button class="films-list__show-more">Show more</button>
  `;
};

export default class MoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMoreButtonTemplate();
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
