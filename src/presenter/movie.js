import {RenderPosition} from "../utils/const.js";
import {render, replace} from "../utils/render.js";
import CardView from "../view/card.js";
import PopupView from "../view/popup.js";

export default class Movie {
  constructor(changeData) {
    this._changeData = changeData;
    this._popupOpen = false;

    this._showPopup = this._showPopup.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._removePopup = this._removePopup.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDocumentClick = this._handleDocumentClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._cardComponent = new CardView(this._movie);
    this._popupComponent = new PopupView(this._movie);

    this._setHandlersForCard();

    this._cardComponentOld = this._cardComponent;
    this._cardComponentNew = null;

    return this._cardComponent.getElement();
  }

  rerenderCard(updatedMovie) {
    this._oldCardComponent = this._cardComponent;
    this._oldPopupComponent = this._popupComponent;

    this._cardComponent = new CardView(updatedMovie);
    this._popupComponent = new PopupView(updatedMovie);

    this._movie = updatedMovie;

    replace(this._cardComponent, this._oldCardComponent);
    this._setHandlersForCard();

    if (this._popupOpen === true) {
      replace(this._popupComponent, this._oldPopupComponent);
      this._setHandlersForPopup();
    }


    this._oldCardComponent.removeElement();
    this._oldPopupComponent.removeElement();
  }

  _showPopup() {
    this._popupOpen = true;

    const body = document.querySelector(`.body`);
    render(body, this._popupComponent, RenderPosition.BEFOREEND);
    this._setHandlersForPopup();
  }

  _removePopup() {
    this._popupOpen = false;

    this._popupComponent.removeElement();
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    document.removeEventListener(`click`, this._handleDocumentClick);
  }

  _handleWatchlistClick() {
    this._changeData(Object.assign(
        {},
        this._movie,
        {
          isWatchlist: !this._movie.isWatchlist
        }
    ));
  }

  _handleWatchedClick() {
    this._changeData(Object.assign(
        {},
        this._movie,
        {
          isWatched: !this._movie.isWatched
        }
    ));
  }

  _handleFavoriteClick() {
    this._changeData(Object.assign(
        {},
        this._movie,
        {
          isFavorite: !this._movie.isFavorite
        }
    ));
  }

  _handleEscKeyDown(evt) {
    if (evt.keyCode === 27) {
      this._removePopup();
    }
  }

  _handleDocumentClick(evt) {
    const eventTarget = evt.target;
    if ((!eventTarget.closest(`.film-details`))) {
      this._removePopup();
    }
  }

  _setHandlersForCard() {
    this._cardComponent.setClickHandler(this._showPopup);
    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._cardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _setHandlersForPopup() {
    this._popupComponent.setCloseButtonClickHandler(this._removePopup);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    document.addEventListener(`click`, this._handleDocumentClick);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }
}