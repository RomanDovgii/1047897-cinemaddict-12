import {MAX_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH_WITH_ELLIPSIS} from "../utils/const.js";
import Abstract from "./abstract.js";
import moment from "moment";
import {formateDuration} from "../utils/main.js";

const createCardTemplate = (movie) => {

  const {name, release, runtime, genres, description, movieRating, path, isWatchlist, isWatched, isFavorite, comments} = movie;

  const commentsCount = comments.length === 1 ? `${comments.length} comment` : `${comments.length} comments`;

  const watchlistControl = isWatchlist ? `film-card__controls-item--active` : ``;
  const wathcedControl = isWatched ? `film-card__controls-item--active` : ``;
  const favoriteControl = isFavorite ? `film-card__controls-item--active` : ``;
  const genre = genres[0] ? `${genres[0]}` : ``;

  return `
  <article class="film-card">
    <h3 class="film-card__title">${name}</h3>
    <p class="film-card__rating">${movieRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${moment(release).format(`YYYY`)}</span>
      <span class="film-card__duration">${formateDuration(runtime)}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="${path}" alt="" class="film-card__poster">
    <p class="film-card__description">${description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(0, MAX_DESCRIPTION_LENGTH_WITH_ELLIPSIS)}…` : `${description}`}</p>
    <a class="film-card__comments">${commentsCount}</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistControl}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${wathcedControl}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteControl}">Mark as favorite</button>
    </form>
  </article>
  `;
};


export default class Card extends Abstract {
  constructor(movie) {
    super();
    this._movie = movie;
    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createCardTemplate(this._movie);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._cardClickHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._cardClickHandler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._cardClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  _cardClickHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this._callback.click();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
