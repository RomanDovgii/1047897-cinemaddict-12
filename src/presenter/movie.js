import {RenderPosition, UserAction, UpdateType} from "../utils/const.js";
import {render, replace, remove} from "../utils/render.js";
import CardView from "../view/card.js";
import PopupView from "../view/popup.js";
import CommentView from "../view/comment.js";
import AddCommentView from "../view/add-comment.js";
import CommentsCounterView from "../view/comments-counter.js";
import CommentsModel from "../model/comments.js";
import Provider from "../api/provider.js";
import moment from "moment";

export default class Movie {
  constructor(changeData, handlePopup, moviesModel, api, commentsStore) {
    this._changeData = changeData;
    this._handlePopup = handlePopup;
    this._moviesModel = moviesModel;
    this._commentsStore = commentsStore;
    this._popupOpen = false;

    this._commentsViews = {};

    this._api = api;

    this._showPopup = this._showPopup.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this.removePopup = this.removePopup.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleWatchlistPopupClick = this._handleWatchlistPopupClick.bind(this);
    this._handleWatchedPopupClick = this._handleWatchedPopupClick.bind(this);
    this._handleFavoritePopupClick = this._handleFavoritePopupClick.bind(this);

    this._handleDocumentClick = this._handleDocumentClick.bind(this);
    this._handlePopupButtonClick = this._handlePopupButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
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
    this._movie = updatedMovie;

    this._oldCardComponent = this._cardComponent;

    this._cardComponent = new CardView(this._movie);

    replace(this._cardComponent, this._oldCardComponent);
    this._setHandlersForCard();

    remove(this._oldCardComponent);
  }

  rerenderPopup(updatedMovie) {
    this._movie = updatedMovie;
    this._comments = this._movie.comments;
    this.removePopup();
    this._showPopup();
  }

  renderCounter() {
    this._commentsCounterComponent = new CommentsCounterView(this._movie.comments.length);
    const commentsMainContainer = this._popupComponent.getElement().querySelector(`.film-details__comments-wrap`);
    render(commentsMainContainer, this._commentsCounterComponent, RenderPosition.AFTERBEGIN);
  }

  renderComments() {
    const commentsContainer = this._popupComponent.getElement().querySelector(`.film-details__comments-list`);

    this._commentsModel.getComments().map((element) => {
      const comment = new CommentView(element);

      render(commentsContainer, comment, RenderPosition.BEFOREEND);
      comment.setDeleteHandler(this._handleViewAction);

      this._commentsViews[element.id] = comment;
    });

    this._commentsStore.setItem(this._movie.id, this._commentsModel.getComments());
  }

  renderAddComment() {
    const commentsMainContainer = this._popupComponent.getElement().querySelector(`.film-details__comments-wrap`);

    this._newComment = new AddCommentView(this._handleViewAction);
    render(commentsMainContainer, this._newComment, RenderPosition.BEFOREEND);

    if (Provider.isOnline()) {
      this._newComment.unlock();
      this._newComment.setEmojiClickHandler();
      this._newComment.setSendMessageKeydownHandler();
    } else {
      this._newComment.lock();
    }
  }

  _showPopup() {
    if (this._popupOpen) {
      return;
    }

    this._handlePopup();

    this._popupComponent = new PopupView(this._movie);

    const body = document.querySelector(`.body`);

    render(body, this._popupComponent, RenderPosition.BEFOREEND);

    this.renderCounter();

    this._api.getComments(this._movie.id).then((comments) => {
      this._comments = comments;
      this._commentsModel = new CommentsModel();
      this._commentsModel.setComments(this._comments);
      this.renderComments();
      this.renderAddComment();
    });

    this._setHandlersForPopup();
    this._popupOpen = true;
  }

  _updateCounter() {
    this._oldCounter = this._commentsCounterComponent;
    this._commentsCounterComponent = new CommentsCounterView(this._commentsModel.getComments().length);

    replace(this._commentsCounterComponent, this._oldCounter);
  }

  removePopup() {
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    document.removeEventListener(`click`, this._handleDocumentClick);
    this._popupOpen = false;
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.CARD_CHANGE,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._movie,
            {
              isWatchlist: !this._movie.isWatchlist
            }
        ));
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.CARD_CHANGE,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._movie,
            {
              isWatched: !this._movie.isWatched,
              watchedDate: !this._movie.isWatched ? moment().format() : null
            }
        ));
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.CARD_CHANGE,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._movie,
            {
              isFavorite: !this._movie.isFavorite
            }
        ));
  }

  _handleWatchlistPopupClick() {
    this._changeData(
        UserAction.POPUP_CHANGE,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._movie,
            {
              isWatchlist: !this._movie.isWatchlist
            }
        )
    );
  }

  _handleWatchedPopupClick() {
    this._changeData(
        UserAction.POPUP_CHANGE,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._movie,
            {
              isWatched: !this._movie.isWatched,
              watchedDate: !this._movie.isWatched ? moment().format() : null
            }
        )
    );
  }

  _handleFavoritePopupClick() {
    this._changeData(
        UserAction.POPUP_CHANGE,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._movie,
            {
              isFavorite: !this._movie.isFavorite
            }
        )
    );
  }

  _handleEscKeyDown(evt) {
    if (evt.keyCode === 27) {
      this.removePopup();
    }
  }

  _handlePopupButtonClick(updatedMovie) {
    this.rerenderCard(updatedMovie);
  }

  _handleDocumentClick(evt) {

    const eventTarget = evt.target;
    if ((!eventTarget.closest(`.film-details`))) {
      this.removePopup();
    }
  }

  _setHandlersForCard() {
    this._cardComponent.setClickHandler(this._showPopup);
    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._cardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _setHandlersForPopup() {
    this._popupComponent.setCloseButtonClickHandler(this.removePopup);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistPopupClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedPopupClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoritePopupClick);
    document.addEventListener(`click`, this._handleDocumentClick);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.DELETE_COMMENT:

        this._api.deleteComment(update).then(() => {
          if (Provider.isOnline()) {
            this._changeData(
                UserAction.POPUP_CHANGE,
                UpdateType.MINOR,
                Object.assign(
                    {},
                    this._movie,
                    {
                      comments: this._commentsModel.getComments().filter((element) => element.id !== update.id).reduce((accumulator, element) => {
                        accumulator.push(element.id);
                        return accumulator;
                      }, []),
                    }
                ));

            this._commentsModel.deleteComment(updateType, update);
            this._commentsStore.setItem(this._movie.id, this._commentsModel.getComments());
          } else {
            this._commentsViews[update.id].showProblem();
          }
        }
        ).catch(() => {
          this._commentsViews[update.id].showProblem();
        }
        );
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(update, this._movie.id).then(() => {
          if (Provider.isOnline()) {
            this._changeData(
                UserAction.POPUP_CHANGE,
                UpdateType.MINOR,
                Object.assign(
                    {},
                    this._movie,
                    {
                      comments: this._commentsModel.getComments().filter((element) => element.id !== update.id).reduce((accumulator, element) => {
                        accumulator.push(element.id);
                        return accumulator;
                      }, []),
                    }
                ));
          } else {
            this._newComment.showProblem();
          }

        }
        )
        .catch(() => {
          this._newComment.showProblem();
        }
        );
        break;
    }
  }
}
