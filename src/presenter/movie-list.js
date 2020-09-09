import {CARD_COUNT_MAIN, RenderPosition, MovieContainers, SortType, CARD_COUNT_EXTRA, UpdateType} from "../utils/const.js";
import {render, remove, replace} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import FilmsView from "../view/films-main.js";
import SortView from "../view/sort-menu.js";
import FilmsContainerView from "../view/films-container.js";
import NoFilmsView from "../view/no-films.js";
import LoadMoreButtonView from "../view/more-button.js";
import MoviePresenter from "./movie.js";
import FilterPresenter from "./filters.js";
import UserStatisticsPresenter from "./user-statistics.js";
import moment from "moment";

export default class MovieList {
  constructor(mainContainer, moviesModel, filterModel) {
    this._mainContainer = mainContainer;
    this._popupOpen = false;
    this._renderFilms = CARD_COUNT_MAIN;
    this._moviePresenter = {};
    this._moviePresenters = {};
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;

    this._sortComponent = null;
    this._loadMoreButtonComponent = null;

    this._filmsComponent = new FilmsView();

    this._filmsAllComponent = new FilmsContainerView(MovieContainers.ALL);
    this._filmsRatedComponent = new FilmsContainerView(MovieContainers.TOP);
    this._filmsCommentedComponent = new FilmsContainerView(MovieContainers.COMMENTED);
    this._noFilmsComponent = new NoFilmsView();

    this._moviesMainContainer = this._filmsAllComponent.getElement().querySelector(`.films-list__container`);

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortButtonClick = this._handleSortButtonClick.bind(this);
    this._handlePopups = this._handlePopups.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._newPopup = null;
    this._previousSortMethod = SortType.DEFAULT;

    this._filterPresenter = new FilterPresenter(this._mainContainer, filterModel, moviesModel);
    this._userStatisticsPresenter = new UserStatisticsPresenter(this._mainContainer);
  }

  init() {
    this._currentSortMethod = `default`;

    this._filterPresenter.init();
    this._userStatisticsPresenter.init();
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderSort();
    this._renderFilmsContainer();

    this._renderMain();
  }

  _handlePopups() {
    Object.values(this._moviePresenters).forEach((presenter) => presenter._removePopup());
  }

  destroy() {
    remove(this._mainContainer);
    this._moviesModel.removeObserver(this._handleModelEvent);
  }

  _handleViewAction(updateType, update) {
    this._moviesModel.updateMovie(updateType, update);
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._moviePresenters[data.id].rerenderCard(data);
        this._moviePresenters[data.id].rerenderPopup(data);
        break;
      case UpdateType.MINOR:
        this._moviePresenters[data.id].rerenderPopup(data);

        const cardsContainer = this._filmsAllComponent.getElement().querySelector(`.films-list__container`);
        cardsContainer.innerHTML = ``;

        this._renderFilmsCards(0, this._renderFilms, MovieContainers.ALL, cardsContainer);
        this._filterPresenter.init();
        break;
      case UpdateType.MAJOR:
        this._renderFilms = CARD_COUNT_MAIN;
        this._filterPresenter.init();
        this._renderFilms = CARD_COUNT_MAIN;
        this._currentSortMethod = `default`;
        this._previousSortMethod = `default`;
        this._rerenderSort();
        this._clearMainMoviesContainer();
        this._moviesMainContainer.innerHTML = ``;
        this._renderMainFilmsCards();
        remove(this._loadMoreButtonComponent);
        this._renderMoreButton(); // update this part
        break;
      default:
        throw new Error(`There is a problem withing _handleModelEvent`);
    }
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filteredMovies = filter[filterType](movies);

    this._previousSortMethod = this._currentSortMethod;

    switch (this._currentSortMethod) {
      case SortType.RAITING:
        return filteredMovies.slice().sort((a, b) => b.raiting - a.raiting);
      case SortType.DATE:
        return filteredMovies.slice().sort((a, b) => moment(b.release).format(`YYYYMMDD`) - moment(a.release).format(`YYYYMMDD`));
      default:
        return filteredMovies;
    }
  }

  _generateCards(min, max, type) {
    const bottom = Math.min(min, max);
    const ceiling = Math.max(min, max);
    let preparedMovies;

    switch (type) {
      case MovieContainers.TOP:
        preparedMovies = this._getMovies().slice().sort((a, b) => b.raiting - a.raiting);
        break;
      case MovieContainers.COMMENTED:
        preparedMovies = this._getMovies().slice().sort((a, b) => b.comments.length - a.comments.length);
        break;
      default:
        preparedMovies = this._getMovies().slice();
        break;
    }

    preparedMovies = preparedMovies.slice(bottom, ceiling);

    const fragment = new DocumentFragment();

    preparedMovies.forEach((movie) => {
      const moviePresenter = new MoviePresenter(this._handleViewAction, this._handlePopups);
      const card = moviePresenter.init(movie);
      fragment.append(card);
      this._moviePresenters[movie.id] = moviePresenter;
      if (type === MovieContainers.ALL) {
        this._moviePresenters[movie.id] = moviePresenter;
      }
    });

    return fragment;
  }

  _renderSort() {
    if (this._sortComponent) {
      this._newSort = new SortView();
      replace(this._newSort, this._sortComponent);
      this._sortComponent = this._newSort;
    }

    this._sortComponent = new SortView();

    render(this._mainContainer, this._sortComponent, RenderPosition.BEFOREEND);

    this._sortComponent.setClickHandler(this._handleSortButtonClick);
  }

  _rerenderSort() {
    this._newSort = new SortView();
    replace(this._newSort, this._sortComponent);
    this._sortComponent = this._newSort;

    this._sortComponent.setClickHandler(this._handleSortButtonClick);
  }

  _renderFilmsContainer() {
    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
  }

  _renderMainFilmsCards() {
    this._renderFilmsCards(0, this._renderFilms, MovieContainers.ALL, this._moviesMainContainer);
    if (!this._loadMoreButtonComponent) {
      this._renderMoreButton();
    }
  }

  _renderFilmsContainerAll() {
    render(this._filmsComponent, this._filmsAllComponent, RenderPosition.BEFOREEND);

    this._renderMainFilmsCards();
  }

  _renderFilmsContainerRated() {
    render(this._filmsComponent, this._filmsRatedComponent, RenderPosition.BEFOREEND);
    const cardsContainer = this._filmsRatedComponent.getElement().querySelector(`.films-list__container`);
    this._renderFilmsCards(0, CARD_COUNT_EXTRA, MovieContainers.TOP, cardsContainer);
  }

  _renderFilmsContainerCommented() {
    render(this._filmsComponent, this._filmsCommentedComponent, RenderPosition.BEFOREEND);
    const cardsContainer = this._filmsCommentedComponent.getElement().querySelector(`.films-list__container`);
    this._renderFilmsCards(0, CARD_COUNT_EXTRA, MovieContainers.COMMENTED, cardsContainer);
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsCards(min, max, type, place) {
    const films = this._generateCards(min, max, type);
    render(place, films, RenderPosition.BEFOREEND);
  }

  _renderMoreButton() {
    if (this._loadMoreButtonComponent) {
      this._loadMoreButtonComponent = null;
      remove(this._loadMoreButtonComponent);
    }


    if (this._getMovies().length > CARD_COUNT_MAIN) {
      this._loadMoreButtonComponent = new LoadMoreButtonView();

      render(this._filmsAllComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
    }
  }

  _clearMainMoviesContainer() {
    this._renderFilms = CARD_COUNT_MAIN;
    this._moviesMainContainer.innerHTML = ``;
  }

  _handleSortButtonClick(sortMethod) {
    this._currentSortMethod = sortMethod;

    if (this._currentSortMethod !== this._previousSortMethod) {
      this._clearMainMoviesContainer();
      this._renderMainFilmsCards();
      this._previousSortMethod = this._currentSortMethod;
    }

    remove(this._loadMoreButtonComponent);
    this._renderMoreButton();
  }

  _handleLoadMoreButtonClick() {
    const filmCount = this._getMovies().length;
    const renderedFilmCount = Math.min(filmCount, this._renderFilms + CARD_COUNT_MAIN);

    this._renderFilmsCards(this._renderFilms, renderedFilmCount, MovieContainers.ALL, this._moviesMainContainer);

    this._renderFilms = renderedFilmCount;

    if (this._renderFilms >= this._getMovies().length) {
      this._loadMoreButtonComponent.removeElement();
    }
  }

  _renderMain() {
    if (!this._getMovies().length) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmsContainerAll();
    this._renderFilmsContainerRated();
    this._renderFilmsContainerCommented();
  }
}
