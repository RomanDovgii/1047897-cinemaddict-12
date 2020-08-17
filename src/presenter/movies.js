import {CARD_COUNT_MAIN} from "../utils/const";
import FilmsView from "../view/films-main.js";
import SortView from "../view/sort.js";
import FilmsContainerView from "../view/films-container.js";
import NoFilmsView from "../view/no-films.js";
import LoadMoreButtonView from "../view/more-button.js";

export default class Films {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderMovies = CARD_COUNT_MAIN;

    this._sortComponent = new SortView();

    this._filmsComponent = new FilmsView();

    this._filmsAllComponent = new FilmsContainerView();
    this._filmsRatedComponent = new FilmsContainerView();
    this._filmsCommentedComponent = new FilmsContainerView();
    this._noFilmsComponent = new NoFilmsView();

    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick(this);
  }
}
