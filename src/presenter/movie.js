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
  constructor(changeInformation, handlePopup, api, commentsStore) {
    this._changeInformation = changeInformation;
    this._handlePopup = handlePopup;
    this._commentsStore = commentsStore;
    this._popupOpen = false;

    this._commentsViews = {};

    this._api = api;

    this._showPopup = this._showPopup.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this.removePopup = this.removePopup.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._watchlistPopupClickHandler = this._watchlistPopupClickHandler.bind(this);
    this._watchedPopupClickHandler = this._watchedPopupClickHandler.bind(this);
    this._favoritePopupClickHandler = this._favoritePopupClickHandler.bind(this);

    this._documentClickHandler = this._documentClickHandler.bind(this);
    this._buttonPopupClickHandler = this._buttonPopupClickHandler.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._comments = this._movie.comments;
    this._cardComponent = new CardView(this._movie);
    this._popupComponent = new PopupView(this._movie);

    this._setHandlersForCard();

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

  renderCounter() {
    this._commentsCounterComponent = new CommentsCounterView(this._movie.comments.length);
    render(this._commentsMainContainer, this._commentsCounterComponent, RenderPosition.AFTERBEGIN);
  }

  renderComments() {
    this._commentsModel.getComments().map((element) => {
      const comment = new CommentView(element);

      render(this._commentsContainer, comment, RenderPosition.BEFOREEND);
      comment.setDeleteHandler(this._handleViewAction);

      this._commentsViews[element.id] = comment;
    });

    this._commentsStore.setItem(this._movie.id, this._commentsModel.getComments());
  }

  renderAddComment() {
    this._newComment = new AddCommentView(this._handleViewAction);
    render(this._commentsMainContainer, this._newComment, RenderPosition.BEFOREEND);

    if (Provider.isOnline()) {
      this._newComment.unlock();
      this._newComment.setEmojiClickHandler();
      this._newComment.setSendMessageKeydownHandler();
    } else {
      this._newComment.lock();
    }
  }

  removePopup() {
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    document.removeEventListener(`click`, this._documentClickHandler);
    this._popupOpen = false;
  }


  _setHandlersForPopup() {
    this._popupComponent.setCloseButtonClickHandler(this.removePopup);
    this._popupComponent.setWatchlistClickHandler(this._watchlistPopupClickHandler);
    this._popupComponent.setWatchedClickHandler(this._watchedPopupClickHandler);
    this._popupComponent.setFavoriteClickHandler(this._favoritePopupClickHandler);
    document.addEventListener(`click`, this._documentClickHandler);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _setHandlersForCard() {
    this._cardComponent.setClickHandler(this._showPopup);
    this._cardComponent.setWatchlistClickHandler(this._watchlistClickHandler);
    this._cardComponent.setWatchedClickHandler(this._watchedClickHandler);
    this._cardComponent.setFavoriteClickHandler(this._favoriteClickHandler);
  }

  _showPopup() {
    if (this._popupOpen) {
      return;
    }

    this._handlePopup();

    this._popupComponent = new PopupView(this._movie);

    const body = document.querySelector(`.body`);

    render(body, this._popupComponent, RenderPosition.BEFOREEND);
    this._commentsMainContainer = this._popupComponent.getCommentsMainContainer();
    this._commentsContainer = this._popupComponent.getCommentsContainer();

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

  _watchlistClickHandler() {
    this._changeInformation(
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

  _watchedClickHandler() {
    this._changeInformation(
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

  _favoriteClickHandler() {
    this._changeInformation(
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

  _watchlistPopupClickHandler() {
    this._changeInformation(
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

  _watchedPopupClickHandler() {
    this._changeInformation(
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

  _favoritePopupClickHandler() {
    this._changeInformation(
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

  _escKeyDownHandler(evt) {
    if (evt.keyCode === 27) {
      this.removePopup();
    }
  }

  _buttonPopupClickHandler(updatedMovie) {
    this.rerenderCard(updatedMovie);
  }

  _documentClickHandler(evt) {

    const eventTarget = evt.target;
    if ((!eventTarget.closest(`.film-details`))) {
      this.removePopup();
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.DELETE_COMMENT:

        this._api.deleteComment(update).then(() => {
          if (Provider.isOnline()) {
            this._changeInformation(
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
            this._changeInformation(
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
