import {CARD_COUNT_MAIN, RenderPosition, MovieContainers, SortType, CARD_COUNT_EXTRA} from "../utils/const.js";
import {render} from "../utils/render.js";
import FilmsView from "../view/films-main.js";
import CardView from "../view/card.js";
import PopupView from "../view/popup.js";
import NavigationView from "../view/menu.js";
import SortView from "../view/sort-menu.js";
import FilmsContainerView from "../view/films-container.js";
import NoFilmsView from "../view/no-films.js";
import LoadMoreButtonView from "../view/more-button.js";

export default class MovieList {
  constructor(mainContainer) {
    this._mainContainer = mainContainer;
    this._popupOpen = false;
    this._renderFilms = CARD_COUNT_MAIN;
    this.popup = new PopupView();

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
    this._newPopup = null;
    this._previousSortMethod = SortType.DEFAULT;
  }

  init(movies) {
    this._movies = movies.slice();
    this._moviesOrign = movies.slice();

    this._menuComponent = new NavigationView(this._movies);

    this._renderMenu();
    this._renderSort();
    this._renderFilmsContainer();

    this._renderMain();
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
      const cardComponent = new CardView(movie);
      const cardElement = cardComponent.getElement();
      const popup = new PopupView(movie);

      fragment.append(cardElement);

      const documentClickHandler = (evnt) => {
        const eventTarget = evnt.target;
        if ((!eventTarget.closest(`.film-details`))) {
          removePopup(evnt);
        }
      };

      const documentEscKeydownHandler = (evnt) => {
        if (evnt.keyCode === 27) {
          removePopup(evnt);
        }
      };

      const showPopup = () => {

        const body = document.querySelector(`.body`);

        this._newPopup = popup;

        if (!this._popupOpen) {
          this._popupOpen = true;
          this._oldPopup = popup;

          render(body, popup, RenderPosition.BEFOREEND);
          popup.setCloseButtonClickHandler(removePopup);
          document.addEventListener(`click`, documentClickHandler);
          document.addEventListener(`keydown`, documentEscKeydownHandler);
        } else if (this._oldPopup !== this._newPopup) {
          this._oldPopup.removeElement();

          render(body, popup, RenderPosition.BEFOREEND);
          popup.setCloseButtonClickHandler(removePopup);
          this._oldPopup = popup;
        }


      };

      const removePopup = () => {
        this._oldPopup.removeElement();
        document.removeEventListener(`keydown`, documentEscKeydownHandler);
        document.removeEventListener(`click`, documentClickHandler);
        this._popupOpen = false;
      };

      cardComponent.setClickHandler(showPopup);
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
        this._movies = this._moviesOrign.slice().sort((a, b) => b.release - a.release);
        break;
      case SortType.RAITING:
        this._movies = this._moviesOrign.slice().sort((a, b) => b.raiting - a.raiting);
        break;
      default:
        this._movies = this._moviesOrign.slice();
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
