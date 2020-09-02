import {CARD_COUNT_MAIN, RenderPosition, MovieContainers, SortType, ChangeType, CARD_COUNT_EXTRA} from "../utils/const.js";
import {updateItem} from "../utils/main.js";
import {render} from "../utils/render.js";
import FilmsView from "../view/films-main.js";
import NavigationView from "../view/menu.js";
import SortView from "../view/sort-menu.js";
import FilmsContainerView from "../view/films-container.js";
import NoFilmsView from "../view/no-films.js";
import LoadMoreButtonView from "../view/more-button.js";
import MoviePresenter from "./movie.js";
import moment from "moment";

export default class MovieList {
  constructor(mainContainer) {
    this._mainContainer = mainContainer;
    this._popupOpen = false;
    this._renderFilms = CARD_COUNT_MAIN;
    this._moviePresenter = {};
    this._moviePresenters = {};

    this._sortComponent = new SortView();

    this._filmsComponent = new FilmsView();

    this._filmsAllComponent = new FilmsContainerView(MovieContainers.ALL);
    this._filmsRatedComponent = new FilmsContainerView(MovieContainers.TOP);
    this._filmsCommentedComponent = new FilmsContainerView(MovieContainers.COMMENTED);
    this._noFilmsComponent = new NoFilmsView();

    this._moviesMainContainer = this._filmsAllComponent.getElement().querySelector(`.films-list__container`);

    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortButtonClick = this._handleSortButtonClick.bind(this);
    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handlePopups = this._handlePopups.bind(this);
    this._newPopup = null;
    this._previousSortMethod = SortType.DEFAULT;
  }

  init(movies) {
    this._movies = movies.slice();
    this._moviesOrigin = movies.slice();

    this._menuComponent = new NavigationView(this._movies);

    this._renderMenu();
    this._renderSort();
    this._renderFilmsContainer();

    this._renderMain();
  }

  _handlePopups() {
    Object.values(this._moviePresenters).forEach((presenter) => presenter._removePopup());
  }

  _handleMovieChange(updatedMovie, type) {
    this._moviesOrigin = updateItem(this._moviesOrigin, updatedMovie);
    this._movies = updateItem(this._movies, updatedMovie);

    if (type !== ChangeType.CONTROL) {
      this._moviePresenter[updatedMovie.id].rerenderCard(updatedMovie);
    } else {
      this._moviePresenter[updatedMovie.id].rerenderControls(updatedMovie);
    }

  }

  _prepareMovies(type) {
    const moviesCopy = [...this._movies];

    switch (type) {
      case MovieContainers.TOP:
        return moviesCopy.sort((a, b) => b.raiting - a.raiting);
      case MovieContainers.COMMENTED:
        return moviesCopy.sort((a, b) => b.comments.length - a.comments.length);
      default:
        return moviesCopy;
    }
  }

  _generateCards(min, max, type) {
    const bottom = Math.min(min, max);
    const ceiling = Math.max(min, max);
    const preparedMovies = this._prepareMovies(type).slice(bottom, ceiling);

    const fragment = new DocumentFragment();

    preparedMovies.forEach((movie) => {
      const moviePresenter = new MoviePresenter(this._handleMovieChange, this._handlePopups);
      const card = moviePresenter.init(movie);
      fragment.append(card);
      this._moviePresenters[movie.id] = moviePresenter;
      if (type === MovieContainers.ALL) {
        this._moviePresenter[movie.id] = moviePresenter;
      }
    });

    return fragment;
  }

  _renderMenu() {
    render(this._mainContainer, this._menuComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._mainContainer, this._sortComponent, RenderPosition.BEFOREEND);

    this._sortComponent.setClickHandler(this._handleSortButtonClick);
  }

  _renderFilmsContainer() {
    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
  }

  _renderMainFilmsCards() {
    this._renderFilmsCards(0, CARD_COUNT_MAIN, MovieContainers.ALL, this._moviesMainContainer);
    this._renderMoreButton();
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
    if (this._movies.length > CARD_COUNT_MAIN) {
      render(this._filmsAllComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
    }
  }

  _sortMovies(sortMethod) {
    switch (sortMethod) {
      case SortType.DATE:
        this._movies = this._moviesOrigin.slice().sort((a, b) => moment(b.release).format(`YYYYMMDD`) - moment(a.release).format(`YYYYMMDD`));
        break;
      case SortType.RAITING:
        this._movies = this._moviesOrigin.slice().sort((a, b) => b.raiting - a.raiting);
        break;
      default:
        this._movies = this._moviesOrigin.slice();
        break;
    }
  }

  _clearMainMoviesContainer() {
    this._renderFilms = CARD_COUNT_MAIN;
    this._moviesMainContainer.innerHTML = ``;
  }

  _handleSortButtonClick(sortMethod) {
    if (sortMethod !== this._previousSortMethod) {
      this._sortMovies(sortMethod);
      this._clearMainMoviesContainer();
      this._renderMainFilmsCards();
      this._previousSortMethod = sortMethod;
    }
  }

  _handleLoadMoreButtonClick() {

    this._renderFilmsCards(this._renderFilms, this._renderFilms + 5, MovieContainers.ALL, this._moviesMainContainer);
    this._renderFilms += CARD_COUNT_MAIN;

    if (this._renderFilms >= this._movies.length) {
      this._loadMoreButtonComponent.removeElement();
    }
  }

  _renderMain() {
    if (!this._movies.length) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmsContainerAll();
    this._renderFilmsContainerRated();
    this._renderFilmsContainerCommented();
  }
}
