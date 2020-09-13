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

  addComment(updateType, update) {
    this._comments = [
      ...this._comments,
      update
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(comment) {
    const adaptedMovie = Object.assign(
        {},
        comment,
        {
          author: comment.author,
          text: comment.comment,
          emoji: comment.emotion,
          date: comment.date,
          id: comment.id
        }
    );

    return adaptedMovie;
  }
}
