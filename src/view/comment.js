import SmartView from "./smart.js";

const createCommentTemplate = (comment) => {
  return `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emoji.replace(`emoji-`, ``)}.png" width="55" height="55" alt="${comment.emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${comment.date.getFullYear()}/${comment.date.getMonth()}/${comment.date.getDate()} ${comment.date.getHours()}:${comment.date.getMinutes()}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>
  `;
};

export default class Comment extends SmartView {
  constructor(comment, comments) {
    super();
    this._comments = comments;
    this._comment = comment;
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }

  _handleDeleteClick(evt) {
    evt.preventDefault();
    this.removeElement();
    this._removeCommentFromComments();
  }

  _removeCommentFromComments() {
    const index = this._comments.indexOf(this._comment);
    this._comments.splice(index, 1);
    this._comment = null;
  }

  setDeleteHandler() {
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._handleDeleteClick);
  }
}
