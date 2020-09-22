import Abstract from "./abstract.js";
import {getRank} from "../utils/main.js";

const createRankTemplate = (rank) => {
  return `
  <section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
  `;
};

export default class UserRank extends Abstract {
  constructor(movies = []) {
    super();
    this._moviesTotal = movies.filter((movie) => movie.isWatched);
    this._rank = getRank(this._moviesTotal.length);
  }

  getTemplate() {
    return createRankTemplate(this._rank);
  }
}
