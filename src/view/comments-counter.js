import Abstract from "./abstract.js";

const createCountTemplate = (commentsCount) => {
  return `
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
  `;
};

export default class CommentCounter extends Abstract {
  constructor(commentsCount) {
    super();
    this._commentsCount = commentsCount;
  }

  getTemplate() {
    return createCountTemplate(this._commentsCount);
  }
}
