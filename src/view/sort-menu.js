import Abstract from "./abstract.js";
import {SORT_TYPES} from "../utils/const.js";

const createSortMenuButton = (sortTypes) => {
  return sortTypes.reduce((accumulator, element) => accumulator + `<li><a href="#" class="sort__button sort__button--${element}">Sort by ${element}</a></li>`, ``);
};

const createSortMenuTemplate = () => {
  return `
  <ul class="sort">
    ${createSortMenuButton(SORT_TYPES)}
  </ul>
  `;
};

export default class SortMenu extends Abstract {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createSortMenuTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();

    evt.target.classList.add(`sort__button--active`);

    SORT_TYPES.forEach((element) => {
      const layoutElement = this.getElement().querySelector(`.sort__button--${element}`);
      if (layoutElement !== evt.target) {
        layoutElement.classList.remove(`sort__button--active`);
      }
    });

    this._callback.click();
    return evt.target;
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    if (!this.getElement().querySelector(`.sort__button--active`)) {
      this.getElement().querySelector(`.sort__button--default`).classList.add(`sort__button--active`);
    }

    SORT_TYPES.forEach((element) => {
      this.getElement().querySelector(`.sort__button--${element}`).addEventListener(`click`, this._clickHandler);
    });
  }
}
