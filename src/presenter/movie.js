import {RenderPosition, UserAction, UpdateType} from "../utils/const.js";
import {render, replace} from "../utils/render.js";
import {createElement} from "../utils/main.js";
import CardView from "../view/card.js";
import PopupView from "../view/popup.js";
import CommentView from "../view/comment.js";
import AddCommentView from "../view/add-comment.js";
import CommentsCounterView from "../view/comments-counter.js";
import CommentsModel from "../model/comments.js";

const templateForControls = (movie) => {
  const {isWatchlist, isWatched, isFavorite} = movie;

  const watchlistControl = isWatchlist ? `film-card__controls-item--active` : ``;
  const wathcedControl = isWatched ? `film-card__controls-item--active` : ``;
  const favoriteControl = isFavorite ? `film-card__controls-item--active` : ``;

  return `
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistControl}">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${wathcedControl}">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteControl}">Mark as favorite</button>
  </form>
  `;
};

export default class Movie {
  constructor(changeData, handlePopup) {
    this._changeData = changeData;
    this._handlePopup = handlePopup;
    this._popupOpen = false;

    this._showPopup = this._showPopup.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._removePopup = this._removePopup.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDocumentClick = this._handleDocumentClick.bind(this);
    this._handlePopupButtonClick = this._handlePopupButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init(movie, observerNotify) {
    this._observerNotify = observerNotify;
    this._movie = movie;
    this._comments = this._movie.comments;
    this._cardComponent = new CardView(this._movie);
    this._popupComponent = new PopupView(this._movie);

    this._setHandlersForCard();

    this._cardComponentOld = this._cardComponent;
    this._cardComponentNew = null;

    return this._cardComponent.getElement();
  }

  rerenderCard(updatedMovie) {
    this._oldCardComponent = this._cardComponent;

    this._cardComponent = new CardView(updatedMovie);

    this._movie = updatedMovie;

    replace(this._cardComponent, this._oldCardComponent);
    this._setHandlersForCard();

    this.renderComments();
    this.renderAddComment();

    this._oldCardComponent.removeElement();
  }

  rerenderControls(updatedMovie) {
    this._oldControls = this._cardComponent.getElement().querySelector(`.film-card__controls`);

    this._newControls = createElement(templateForControls(updatedMovie));

    this._movie = updatedMovie;

    replace(this._newControls, this._oldControls);
    this._setHandlersForCard();

    this._oldControls.removeElement();
  }

  renderComments() {
    const commentsContainer = this._popupComponent.getElement().querySelector(`.film-details__comments-list`);

    this._commentsModel.getComments().map((element) => {
      const comment = new CommentView(element, this._commentsModel.getComments(), this._handleViewAction);

      render(commentsContainer, comment, RenderPosition.BEFOREEND);
      comment.setDeleteHandler();
    });
  }

  renderAddComment() {
    const commentsMainContainer = this._popupComponent.getElement().querySelector(`.film-details__comments-wrap`);

    const newComment = new AddCommentView(this._handleViewAction);
    render(commentsMainContainer, newComment, RenderPosition.BEFOREEND);
    newComment.setEmojiClickHandler();
    newComment.setSendMessageKeydownHandler();
  }

  _showPopup() {
    this._popupOpen = true;
    if (this._popupOpen) {
      this._handlePopup();
    }

    this._commentsModel = new CommentsModel();
    this._commentsModel.setComments(this._comments);
    this._commentsModel.addObserver(this._handleModelEvent);

    this._popupComponent = new PopupView(this._movie);
    this._commentsCounterComponent = new CommentsCounterView(this._commentsModel.getComments().length);

    const body = document.querySelector(`.body`);
    const commentsMainContainer = this._popupComponent.getElement().querySelector(`.film-details__comments-wrap`);

    render(body, this._popupComponent, RenderPosition.BEFOREEND);
    render(commentsMainContainer, this._commentsCounterComponent, RenderPosition.AFTERBEGIN);
    this.renderComments();
    this.renderAddComment();

    this._setHandlersForPopup();
  }

  _updateCounter() {
    this._oldCounter = this._commentsCounterComponent;
    this._commentsCounterComponent = new CommentsCounterView(this._commentsModel.getComments().length);

    replace(this._commentsCounterComponent, this._oldCounter);
  }

  _removePopup() {
    this._popupComponent.removeElement();
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    document.removeEventListener(`click`, this._handleDocumentClick);
    this._popupOpen = false;
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MAJOR,
        Object.assign(
            {},
            this._movie,
            {
              isWatchlist: !this._movie.isWatchlist
            }
        ), `control`);
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MAJOR,
        Object.assign(
            {},
            this._movie,
            {
              isWatched: !this._movie.isWatched
            }
        ), `control`);
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MAJOR,
        Object.assign(
            {},
            this._movie,
            {
              isFavorite: !this._movie.isFavorite
            }
        ), `control`);
  }

  _handleEscKeyDown(evt) {
    if (evt.keyCode === 27) {
      this._removePopup();
    }
  }

  _handlePopupButtonClick(updatedMovie) {
    this.rerenderCard(updatedMovie);
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
    this._popupComponent.setButtonsHandlers(this._handlePopupButtonClick);
    document.addEventListener(`click`, this._handleDocumentClick);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._moviePresenters[data.id].rerenderCard(data);
        break;
      case UpdateType.MINOR:
        this._moviePresenters[data.id].rerenderCard(data); // update this part
        break;
      case UpdateType.MAJOR:
        const commentsContainer = this._popupComponent.getElement().querySelector(`.film-details__comments-list`);
        commentsContainer.innerHTML = ``;

        this._changeData(
            UserAction.UPDATE_MOVIE,
            UpdateType.MAJOR,
            Object.assign(
                {},
                this._movie,
                {
                  comments: this._commentsModel.getComments()
                }
            ), `control`);
        this.renderComments();
        this._updateCounter();
        break;
      default:
        throw new Error(`There is a problem withing _handleModelEvent`);
    }
  }
}
