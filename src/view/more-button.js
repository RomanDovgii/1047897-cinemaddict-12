import Abstract from "./abstract";

const createMoreButtonTemplate = () => {
  return `
  <button class="films-list__show-more">Show more</button>
  `;
};

export default class MoreButton extends Abstract {
  constructor() {
    super();
    this._moreButtonClickHandler = this._moreButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createMoreButtonTemplate();
  }

  _moreButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._moreButtonClickHandler);
  }
}
