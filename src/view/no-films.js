import Abstract from "./abstract.js";

const createNoMoviesTemplate = () => {
  return `
  <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  `;
};

export default class NoMovies extends Abstract {
  getTemplate() {
    return createNoMoviesTemplate();
  }
}
