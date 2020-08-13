import {formateDuration} from "../utils/main.js";
import {createElement} from "../utils/main.js";
import {MAX_STRING_LENGTH} from "../utils/const.js";

const createCardTemplate = (mock) => {

  const {name, release, runtime, genres, description, raiting, path, isWatchlist, isWatched, isFavorite, comments} = mock;

  const commentNumber = comments.length === 1 ? `${comments.length} comment` : `${comments.length} comments`;

  const watchlistControl = isWatchlist ? `film-card__controls-item--active` : ``;
  const wathcedControl = isWatched ? `film-card__controls-item--active` : ``;
  const favoriteControl = isFavorite ? `film-card__controls-item--active` : ``;

  return `
  <article class="film-card">
    <h3 class="film-card__title">${name}</h3>
    <p class="film-card__rating">${raiting}</p>
    <p class="film-card__info">
      <span class="film-card__year">${release.getFullYear()}</span>
      <span class="film-card__duration">${formateDuration(runtime)}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="${path}" alt="" class="film-card__poster">
    <p class="film-card__description">${description.length > 140 ? `${description.slice(0, MAX_STRING_LENGTH)}…` : `${description}`}</p>
    <a class="film-card__comments">${commentNumber}</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistControl}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${wathcedControl}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteControl}">Mark as favorite</button>
    </form>
  </article>
  `;
};


export default class Card {
  constructor(movie) {
    this.movie = movie;

    this._element = null;
  }

  getTemplate() {
    return createCardTemplate(this.movie);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
