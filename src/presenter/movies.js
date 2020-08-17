import {CARD_COUNT_MAIN, RenderPosition, MovieContainers, CARD_COUNT_EXTRA} from "../utils/const.js";
import {mocks} from "../mocks/movie.js";
import {render} from "../utils/render.js";
import FilmsView from "../view/films-main.js";
import CardView from "../view/card.js";
import PopupView from "../view/popup.js";
import NavigationView from "../view/menu.js";
import SortView from "../view/sort-menu.js";
import FilmsContainerView from "../view/films-container.js";
import NoFilmsView from "../view/no-films.js";
import LoadMoreButtonView from "../view/more-button.js";

export default class Films {
  constructor(mainContainer, movies) {
    this._mainContainer = mainContainer;
    this._movies = movies;
    this._popupOpen = false;
    this._renderFilms = CARD_COUNT_MAIN;
    this.popup = new PopupView();

    this._menuComponent = new NavigationView(this._movies);
    this._sortComponent = new SortView();

    this._filmsComponent = new FilmsView();

    this._filmsAllComponent = new FilmsContainerView(MovieContainers.ALL);
    this._filmsRatedComponent = new FilmsContainerView(MovieContainers.TOP);
    this._filmsCommentedComponent = new FilmsContainerView(MovieContainers.COMMENTED);
    this._noFilmsComponent = new NoFilmsView();

    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleCardClick = this._handleCardClick(this);

    this._previousPopup = ``;
    this._newPopup = ``;
  }

  _prepareMovies(type) {
    const mocksCopy = [...mocks];

    switch (type) {
      case MovieContainers.TOP:
        return mocksCopy.sort((a, b) => b.raiting - a.raiting);
      case MovieContainers.COMMENTED:
        return mocksCopy.sort((a, b) => b.comments.length - a.comments.length);
      default:
        return mocksCopy;
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
        // console.log(`strike`);
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
  }

  _renderFilmsContainer() {
    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsContainerAll() {
    render(this._filmsComponent, this._filmsAllComponent, RenderPosition.BEFOREEND);
    const cardsContainer = this._filmsAllComponent.getElement().querySelector(`.films-list__container`);
    this._renderFilmsCards(0, CARD_COUNT_MAIN, MovieContainers.ALL, cardsContainer);

    if (this._movies.length > CARD_COUNT_MAIN) {
      this._renderMoreButton();
    }
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
    render(this._filmsAllComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _handleLoadMoreButtonClick() {
    const cardsContainer = this._filmsAllComponent.getElement().querySelector(`.films-list__container`);

    this._renderFilmsCards(this._renderFilms, this._renderFilms + 5, MovieContainers.ALL, cardsContainer);
    this._renderFilms += CARD_COUNT_MAIN;

    if (this._renderFilms >= mocks.length) {
      this._loadMoreButtonComponent.removeElement();
    }
  }

  _handleCardClick() {

  }

  _renderMain() {
    this._renderMenu();
    this._renderSort();
    this._renderFilmsContainer();

    if (!this._movies.length) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmsContainerAll();
    this._renderFilmsContainerRated();
    this._renderFilmsContainerCommented();
  }
}
