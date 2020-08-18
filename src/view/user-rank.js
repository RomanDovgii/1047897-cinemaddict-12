import Abstract from "./abstract.js";
import {mocks} from "../mocks/movie.js";

const getRank = () => {
  const moviesWatched = mocks.slice().filter((mock) => mock.isWatched).length;

  switch (true) {
    case (moviesWatched <= 10) && (moviesWatched > 0):
      return `novice`;
    case (moviesWatched <= 20) && (moviesWatched > 10):
      return `fan`;
    case (moviesWatched > 20):
      return `movie buff`;
    default:
      return ``;
  }
};

const createRankTemplate = (rank) => {
  return `
  <section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
  `;
};

export default class UserRank extends Abstract {
  constructor() {
    super();
    this._rank = getRank();
  }

  getTemplate() {
    return createRankTemplate(this._rank);
  }
}
