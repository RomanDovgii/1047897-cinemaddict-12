import {mocks} from "../mocks/movie.js";

export const generateStats = () => {
  return `
  <p>${mocks.length} movies inside</p>
  `;
};
