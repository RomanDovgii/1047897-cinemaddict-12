import FilterView from "../view/filter.js";
import {RenderPosition, UpdateType, FilterType} from "../utils/const.js";
import {filter} from "../utils/filter.js";
import {render, replace, remove} from "../utils/render.js";

export default class Filters {
  constructor(filterContainer, moviesModel, filterModel, callbackForStats) {
    this._filterContainer = filterContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._callbackForStats = callbackForStats;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._filterComponent.setStatsButtonClickHandler(this._callbackForStats);

    if (!prevFilterComponent) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleFilterTypeChange(filterType) {

    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();

    return [
      {
        type: FilterType.ALL,
        name: `All movies`,
        count: filter[FilterType.ALL](movies).length
      },
      {
        type: FilterType.WATCHLIST,
        name: `Watchlist`,
        count: filter[FilterType.WATCHLIST](movies).length
      },
      {
        type: FilterType.HISTORY,
        name: `History`,
        count: filter[FilterType.HISTORY](movies).length
      },
      {
        type: FilterType.FAVORITES,
        name: `Favorites`,
        count: filter[FilterType.FAVORITES](movies).length
      }
    ];
  }

  setStatsButtonClick(callback) {
    this._filterComponent.setStatusButtonClick(callback);
  }
}
