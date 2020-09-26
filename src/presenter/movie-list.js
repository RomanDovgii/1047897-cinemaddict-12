import {CARD_COUNT_MAIN, RenderPosition, MovieContainer, SortType, CARD_COUNT_EXTRA, UpdateType, UserAction} from "../utils/const.js";
import {render, remove, replace} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import FilmsView from "../view/films-main.js";
import SortView from "../view/sort-menu.js";
import FilmsContainerView from "../view/films-container.js";
import NoFilmsView from "../view/no-films.js";
import LoadingFilmsView from "../view/loading-films.js";
import LoadMoreButtonView from "../view/more-button.js";
import UserRankView from "../view/user-rank.js";
import MoviePresenter from "./movie.js";
import moment from "moment";
import MoviesModel from "../model/movies.js";

export default class MovieList {
  constructor(mainContainer, moviesModel, filterModel, filterPresenter, api, moviesStore, commentsStore, firstLoad) {
    this._mainContainer = mainContainer;
    this._popupOpen = false;
    this._renderFilms = CARD_COUNT_MAIN;
    this._moviePresenter = {};
    this._moviePresenters = {};
    this._moviePresentersTop = {};
    this._moviePresentersCommented = {};
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._api = api;
    this._commentsStore = commentsStore;
    this._moviesStore = moviesStore;
    this._firstLoad = firstLoad;

    this._sortComponent = null;
    this._loadMoreButtonComponent = null;

    this._filmsComponent = new FilmsView();

    this._filmsAllComponent = new FilmsContainerView(MovieContainer.ALL);
    this._filmsRatedComponent = new FilmsContainerView(MovieContainer.TOP);
    this._filmsCommentedComponent = new FilmsContainerView(MovieContainer.COMMENTED);
    this._noFilmsComponent = new NoFilmsView();
    this._loadingFilmsComponent = new LoadingFilmsView();

    this._moviesMainContainer = this._filmsAllComponent.getElement().querySelector(`.films-list__container`);

    this._loadMoreButtonClickHandler = this._loadMoreButtonClickHandler.bind(this);
    this._sortButtonClickHandler = this._sortButtonClickHandler.bind(this);
    this._handlePopups = this._handlePopups.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._newPopup = null;
    this._previousSortMethod = SortType.DEFAULT;

    this._filterPresenter = filterPresenter;
  }

  init() {
    this._currentSortMethod = `default`;

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderSort();

    this._renderFilmsContainer();

    this._filterPresenter.init();
    this._renderMain();
    this.rerenderUserRank(this._moviesModel.getMovies());
  }

  rerenderUserRank(movies) {
    const header = document.querySelector(`.header`);
    const oldUserRank = document.querySelector(`.header__profile`);
    oldUserRank.remove();

    const newUserRank = new UserRankView(movies);
    render(header, newUserRank.getElement(), RenderPosition.BEFOREEND);
  }

  removeLoadingFilms() {
    remove(this._loadingFilmsComponent);
  }

  destroy() {
    if (this._sortComponent) {
      remove(this._sortComponent);
    }

    if (this._mainContainer.querySelector(`.films`)) {
      this._mainContainer.querySelector(`.films`).remove();
    }

    this._moviesModel.removeObserver(this._handleModelEvent);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.POPUP_CHANGE:
        this._api.updateMovies(update).then((response) => {
          this._handlePopups();
          this._moviesModel.updateMovie(updateType, response);

          this._moviesStore.setItems(this._moviesModel.getMovies().slice().map(MoviesModel.adaptToServer));


          if (this._moviePresenters[response.id]) {
            this._moviePresenters[response.id]._showPopup(response);
            return;
          }
          if (this._moviePresentersTop[response.id]) {
            this._moviePresentersTop[response.id]._showPopup(response);
            return;
          }
          if (this._moviePresentersCommented[response.id]) {
            this._moviePresentersCommented[response.id]._showPopup(response);
            return;
          }
        })
        .catch(() => {
          if (this._moviePresenters[update.id]) {
            this._moviePresenters[update.id]._showPopup(update);
            return;
          }
          if (this._moviePresentersTop[update.id]) {
            this._moviePresentersTop[update.id]._showPopup(update);
            return;
          }
          if (this._moviePresentersCommented[update.id]) {
            this._moviePresentersCommented[update.id]._showPopup(update);
            return;
          }
        });
        break;
      case UserAction.CARD_CHANGE:
        this._api.updateMovies(update).then((response) => {
          this._moviesModel.updateMovie(updateType, response);

          this._moviesStore.setItems(this._moviesModel.getMovies().slice().map(MoviesModel.adaptToServer));
        });
        break;
    }
  }

  _handleModelEvent(updateType, information) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._moviePresenters[information.id].rerenderCard(information);
        break;
      case UpdateType.MINOR:
        const cardsContainer = this._filmsAllComponent.getElement().querySelector(`.films-list__container`);
        cardsContainer.innerHTML = ``;
        this._renderFilmsCards(0, this._renderFilms, MovieContainer.ALL, cardsContainer);

        if (this._filterModel.getFilter() === `ALL`) {
          this._renderFilmsContainerRated();
          this._renderFilmsContainerCommented();
        }

        if (this._getMovies().length <= this._renderFilms) {
          remove(this._loadMoreButtonComponent);
        }

        this._moviesMainContainer.innerHTML = ``;
        this._renderMainFilmsCards();

        this.rerenderUserRank(this._moviesModel.getMovies());

        this._filterPresenter.init();
        break;
      case UpdateType.MAJOR:
        this._renderFilms = CARD_COUNT_MAIN;
        this._filterPresenter.init();
        this._renderFilms = CARD_COUNT_MAIN;
        this._currentSortMethod = `default`;
        this._previousSortMethod = `default`;
        this._renderSort();
        this._clearMainMoviesContainer();
        this._moviesMainContainer.innerHTML = ``;
        this._renderMainFilmsCards();
        remove(this._loadMoreButtonComponent);

        this.rerenderUserRank(this._moviesModel.getMovies());
        this._renderMoreButton();

        if (this._filterModel.getFilter() !== `ALL`) {
          remove(this._filmsRatedComponent);
          remove(this._filmsCommentedComponent);
        } else {
          this._renderFilmsContainerRated();
          this._renderFilmsContainerCommented();
        }
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
        return filteredMovies.slice().sort((a, b) => b.movieRating - a.movieRating);
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
      case MovieContainer.TOP:
        preparedMovies = this._moviesModel.getMovies().slice().sort((a, b) => b.movieRating - a.movieRating);
        break;
      case MovieContainer.COMMENTED:
        preparedMovies = this._moviesModel.getMovies().slice().sort((a, b) => b.comments.length - a.comments.length);
        break;
      default:
        preparedMovies = this._getMovies().slice();
        break;
    }

    preparedMovies = preparedMovies.slice(bottom, ceiling);

    const fragment = new DocumentFragment();

    preparedMovies.forEach((movie) => {
      const moviePresenter = new MoviePresenter(this._handleViewAction, this._handlePopups, this._moviesModel, this._api, this._commentsStore);
      const card = moviePresenter.init(movie);
      fragment.append(card);

      if (type === MovieContainer.ALL) {
        this._moviePresenters[movie.id] = moviePresenter;
      }

      if (type === MovieContainer.TOP) {
        this._moviePresentersTop[movie.id] = moviePresenter;
      }

      if (type === MovieContainer.COMMENTED) {
        this._moviePresentersCommented[movie.id] = moviePresenter;
      }
    });

    return fragment;
  }

  _renderSort() {
    if (this._sortComponent) {
      this._newSort = new SortView();
      replace(this._newSort, this._sortComponent);
      this._sortComponent = this._newSort;
      this._sortComponent.setClickHandler(this._sortButtonClickHandler);
      return;
    }

    this._sortComponent = new SortView();

    render(this._mainContainer, this._sortComponent, RenderPosition.BEFOREEND);

    this._sortComponent.setClickHandler(this._sortButtonClickHandler);
  }

  _renderLoading() {
    render(this._mainContainer, this._loadingFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsContainer() {
    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
  }

  _renderMainFilmsCards() {
    this._renderFilmsCards(0, this._renderFilms, MovieContainer.ALL, this._moviesMainContainer);
    if (!this._loadMoreButtonComponent && this._getMovies().length > 0) {
      this._renderMoreButton();
    }

    if (this._isNoMoviesShown && !this._firstLoad) {
      replace(this._filmsAllComponent, this._noFilmsComponent);
      this._isNoMoviesShown = false;
    }

    if (this._moviesMainContainer.childNodes.length === 0 && !this._firstLoad) {
      replace(this._noFilmsComponent, this._filmsAllComponent);
      this._isNoMoviesShown = true;
    }


  }

  _renderFilmsContainerAll() {
    render(this._filmsComponent, this._filmsAllComponent, RenderPosition.BEFOREEND);

    this._renderMainFilmsCards();
  }

  _renderFilmsContainerRated() {
    render(this._filmsComponent, this._filmsRatedComponent, RenderPosition.BEFOREEND);
    const cardsContainer = this._filmsRatedComponent.getElement().querySelector(`.films-list__container`);
    cardsContainer.innerHTML = ``;
    this._renderFilmsCards(0, CARD_COUNT_EXTRA, MovieContainer.TOP, cardsContainer);
  }

  _renderFilmsContainerCommented() {
    render(this._filmsComponent, this._filmsCommentedComponent, RenderPosition.BEFOREEND);
    const cardsContainer = this._filmsCommentedComponent.getElement().querySelector(`.films-list__container`);
    cardsContainer.innerHTML = ``;
    this._renderFilmsCards(0, CARD_COUNT_EXTRA, MovieContainer.COMMENTED, cardsContainer);
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoadingFilms() {
    render(this._filmsComponent, this._loadingFilmsComponent, RenderPosition.AFTERBEGIN);
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


    if (this._getMovies().length > this._renderFilms) {
      this._loadMoreButtonComponent = new LoadMoreButtonView();

      render(this._filmsAllComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(this._loadMoreButtonClickHandler);
    }
  }

  _renderMain() {
    this._renderFilmsContainerAll();
    if (this._firstLoad) {
      this._renderLoadingFilms();
      this._firstLoad = false;
    }

    if (!this._getMovies().length === 0) {
      this._renderNoFilms();
      return;
    }

    const nonZeroRatingCount = this._getMovies().slice().filter((movie) => movie.movieRating > 0).length;
    const nonZeroCommentsCount = this._getMovies().slice().filter((movie) => movie.comments.length > 0).length;

    if (nonZeroRatingCount !== 0 && this._filterModel.getFilter() === `ALL`) {
      this._renderFilmsContainerRated();
    }

    if (nonZeroCommentsCount !== 0 && this._filterModel.getFilter() === `ALL`) {
      this._renderFilmsContainerCommented();
    }
  }

  _clearMainMoviesContainer() {
    this._renderFilms = CARD_COUNT_MAIN;
    this._moviesMainContainer.innerHTML = ``;
  }

  _sortButtonClickHandler(sortMethod) {
    this._currentSortMethod = sortMethod;

    if (this._currentSortMethod !== this._previousSortMethod) {
      this._clearMainMoviesContainer();
      this._renderMainFilmsCards();
      this._previousSortMethod = this._currentSortMethod;
    }

    remove(this._loadMoreButtonComponent);
    this._renderMoreButton();
  }

  _loadMoreButtonClickHandler() {
    const filmCount = this._getMovies().length;
    const renderedFilmCount = Math.min(filmCount, this._renderFilms + CARD_COUNT_MAIN);

    this._renderFilmsCards(this._renderFilms, renderedFilmCount, MovieContainer.ALL, this._moviesMainContainer);

    this._renderFilms = renderedFilmCount;

    if (this._renderFilms >= this._getMovies().length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _handlePopups() {
    Object.values(this._moviePresenters).forEach((presenter) => presenter.removePopup());
    Object.values(this._moviePresentersTop).forEach((presenter) => presenter.removePopup());
    Object.values(this._moviePresentersCommented).forEach((presenter) => presenter.removePopup());
  }
}
