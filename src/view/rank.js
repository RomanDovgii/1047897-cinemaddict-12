import {mocks} from "../mocks/movie.js";

export const generateRank = () => {
  let rank = ``;
  let moviesWatched = mocks.slice().filter((mock) => mock.isWatched).length;

  switch (true) {
    case (moviesWatched <= 10) && (moviesWatched > 0):
      rank = `novice`;
      break;
    case (moviesWatched <= 20) && (moviesWatched > 10):
      rank = `fan`;
      break;
    case (moviesWatched > 20):
      rank = `movie buff`;
      break;
    default:
      rank = ``;
      break;
  }

  return `
  <section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
  `;
};
