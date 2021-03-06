import Abstract from "./abstract.js";

const createStatisticsTemplate = (count) => {
  return `
  <p>${count} movies inside</p>
  `;
};

export default class Statistics extends Abstract {
  constructor(movies) {
    super();
    this._moviesTotal = movies.length;
  }

  getTemplate() {
    return createStatisticsTemplate(this._moviesTotal);
  }
}
