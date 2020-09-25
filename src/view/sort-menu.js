import Abstract from "./abstract.js";
import {SortType} from "../utils/const.js";
import {convertEnumToArray} from "../utils/main.js";

const createSortMenuButton = (sortTypes) => {
  return sortTypes.reduce((accumulator, element) => accumulator + `<li><a href="#" data-type="${element}" class="sort__button">Sort by ${element}</a></li>`, ``);
};

const createSortMenuTemplate = (array) => {
  return `
  <ul class="sort">
    ${createSortMenuButton(array)}
  </ul>
  `;
};

export default class SortMenu extends Abstract {
  constructor() {
    super();
    this._sortMenuClickHandler = this._sortMenuClickHandler.bind(this);
    this._sortTypes = convertEnumToArray(SortType);
  }

  getTemplate() {
    return createSortMenuTemplate(this._sortTypes);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    if (!this.getElement().querySelector(`.sort__button--active`)) {
      this.getElement().querySelector(`[data-type = "default"]`).classList.add(`sort__button--active`);
    }

    this._sortTypes.forEach((element) => {
      this.getElement().querySelector(`[data-type = "${element}"]`).addEventListener(`click`, this._sortMenuClickHandler);
    });
  }

  _sortMenuClickHandler(evt) {
    evt.preventDefault();

    evt.target.classList.add(`sort__button--active`);

    this._sortTypes.forEach((element) => {
      const layoutElement = this.getElement().querySelector(`[data-type = "${element}"]`);
      if (layoutElement !== evt.target) {
        layoutElement.classList.remove(`sort__button--active`);
      }
    });

    this._callback.click(evt.target.dataset.type);
  }
}
