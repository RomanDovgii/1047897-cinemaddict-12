import SmartView from "./smart.js";
import {createElement, formateDuration} from "../utils/main.js";
import moment from "moment";

const generateGenres = (array) => {
  return array.reduce(
      (accumulator, genre) => accumulator + `<span class="film-details__genre">${genre}</span>`, ``
  );
};

const createPopupTemplate = (movie) => {

  const {name, originalName, director, writers, actors, release, runtime, country, genres, description, rating, movieRating, path, isWatchlist, isWatched, isFavorite} = movie;

  const writersText = `${writers.join(`, `)}`;
  const actorsText = `${actors.join(`, `)}`;
  const genreText = generateGenres(genres);

  const date = `${release.toLocaleString(`en-GB`, {day: `numeric`, month: `long`, year: `numeric`})}`;

  const watchlistCheck = isWatchlist ? `checked` : ``;
  const wathcedCheck = isWatched ? `checked` : ``;
  const favoriteCheck = isFavorite ? `checked` : ``;

  return `
  <section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${path}" alt="">

            <p class="film-details__age">${rating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${name}</h3>
                <p class="film-details__title-original">Original: ${originalName}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${movieRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writersText}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actorsText}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(date).format(`D MMMM YYYY`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formateDuration(runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
                <td class="film-details__cell">
                  ${genreText}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistCheck}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${wathcedCheck}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteCheck}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">

          <ul class="film-details__comments-list">
          </ul>
        </section>
      </div>
    </form>
  </section>
  `;
};

export default class Popup extends SmartView {
  constructor(movie) {
    super();
    this._data = Popup.parseMovieToData(movie);

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  restoreHandlers() {
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setCloseButtonClickHandler(this._callback.closeClick);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, this._closeButtonClickHandler);
    this._callback.closeClick();
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeButtonClickHandler);
  }
  _watchlistClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      isWatchlist: !this._data.isWatchlist,
    });

    this._callback.watchlistClick(Popup.parseDataToMovie(this._data));
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      isWatched: !this._data.isWatched,
    });

    this._callback.watchedClick(Popup.parseDataToMovie(this._data));
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      isFavorite: !this._data.isFavorite,
    });

    this._callback.favoriteClick(Popup.parseDataToMovie(this._data));
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  static parseMovieToData(movie) {
    return Object.assign(
        {},
        movie,
        {
          isWatchlist: movie.isWatchlist,
          isWatched: movie.isWatched,
          isFavorite: movie.isFavorite
        }
    );
  }

  static parseDataToMovie(data) {
    data = Object.assign({}, data);
    return data;
  }
}
