import Abstract from "./abstract.js";

const createCountTemplate = (number) => {
  return `
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${number}</span></h3>
  `;
};

export default class CommentCounter extends Abstract {
  constructor(number) {
    super();
    this._number = number;
  }

  getTemplate() {
    return createCountTemplate(this._number);
  }
}
