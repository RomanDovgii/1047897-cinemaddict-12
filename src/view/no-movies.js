import Abstract from "./abstract.js";

const createNoMoviesTemplate = () => {
  return `
  <h2 class="films-list__title">There are no movies in our database</h2>
  `;
};

export default class NoMovies extends Abstract {
  getTemplate() {
    return createNoMoviesTemplate();
  }
}
