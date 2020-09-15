import SmartView from "./smart.js";
import moment from "moment";
import he from "he";
import {UserAction, UpdateType} from "../utils/const.js";

const createCommentTemplate = (comment) => {
  const date = moment(comment.date).format(`YYYY/MM/DD HH:MM`);

  return `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emoji.replace(`emoji-`, ``)}.png" width="55" height="55" alt="${comment.emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment.text)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>
  `;
};

export default class Comment extends SmartView {
  constructor(comment) {
    super();
    this._comment = comment;
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }

  _handleDeleteClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const deleteButton = this.getElement().querySelector(`.film-details__comment-delete`);
    deleteButton.disabled = true;
    deleteButton.textContent = `Deleting…`;
    // remove(this);
    this._callback.deleteClick(UserAction.DELETE_COMMENT, UpdateType.MAJOR, this._comment);
  }

  setDeleteHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._handleDeleteClick);
  }
}
