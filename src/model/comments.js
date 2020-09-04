import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();

    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  updateMovie(updateType, update) {
    const index = this._comments.findIndex((comment) => comment === comment);

    if (index === -1) {
      throw new Error(`Cannot update non-existent movie`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      update,
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment === update);

    if (index === -1) {
      throw new Error(`Cannot update non-existent movie`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType, update);
  }
}
