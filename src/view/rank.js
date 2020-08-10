import {mocks} from "../mocks/movie.js";

const getRank = (count) => {
  switch (true) {
    case (count <= 10) && (count > 0):
      return `novice`;
    case (count <= 20) && (count > 10):
      return `fan`;
    case (count > 20):
      return `movie buff`;
    default:
      return ``;
  }
};

export const generateRank = () => {
  const moviesWatched = mocks.slice().filter((mock) => mock.isWatched).length;

  return `
  <section class="header__profile profile">
    <p class="profile__rating">${getRank(moviesWatched)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
  `;
};
