import {createFilters} from "../mocks/filter.js";
import {createElement} from "../utils/main.js";

const generateFilterMarkup = (filter, isChecked) => {
  const checked = isChecked ? `main-navigation__item--active` : ``;
  const notAll = filter.count !== 0 && filter.title !== `all`;
  const count = notAll ? `<span class="main-navigation__item-count"> ${filter.count}</span></a>` : ``;
  const filterName = filter.title;
  const name = filterName === `all` ? `All movies` : `${filterName.charAt(0).toUpperCase() + filterName.slice(1)}`;

  return `<a href="#${filterName}" class="main-navigation__item ${checked}">${name}${count}</a>`;
};

const generateFilterBlock = (movies) => {
  const filters = createFilters(movies);
  return filters.reduce((accumulator, filter) => accumulator + generateFilterMarkup(filter, filter.title === `all` ? true : false), ``);
};

const createMenuTemplate = (movies) => {

  return `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      ${generateFilterBlock(movies)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  `;
};

export default class Menu {
  constructor(movies) {
    this.movies = movies;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this.movies);
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
