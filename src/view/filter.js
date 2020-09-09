import SmartView from "./abstract.js";

const generateFilterMarkup = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  const checked = type === currentFilterType ? `main-navigation__item--active` : ``;
  const notAll = filter.count >= 0 && name !== `All movies`;
  const counter = notAll ? `<span class="main-navigation__item-count">${count}</span></a>` : ``;

  return `<a href="#${name}" class="main-navigation__item ${checked}" data-type="${type}">${name} ${counter}</a>`;
};

const generateFilterBlock = (filters, currentFilter) => {
  return filters.reduce((accumulator, filter) => accumulator + generateFilterMarkup(filter, currentFilter), ``);
};

const createFilterTemplate = (filters, currentFilter) => {

  return `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      ${generateFilterBlock(filters, currentFilter)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  `;
};

export default class Filter extends SmartView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._filterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._handleStatsButtonClick = this._handleStatsButtonClick.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._filterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    const filterType = evt.target.closest(`.main-navigation__item`).dataset.type;
    this._callback.filterTypeChange(filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelectorAll(`.main-navigation__item`).forEach((element) => element.addEventListener(`click`, this._filterTypeChangeHandler));
  }

  _handleStatsButtonClick(evt) {
    evt.preventDefault();
    this._callback.statusClick();
  }

  setStatusButtonClick(callback) {
    this._callback.statusClick = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._handleStatsButtonClick);
  }

  resetHandlers() {
    this.setStatsButtonClick(this._callback.statusClick);
  }
}
