import {movieNames, fishText, generateArrayFromString} from "../utils/main.js";
import {generateGenres} from "./genre-mock.js";
import {generateComments} from "./comment-mock.js";
const numberOfMocks = 40;
const maxRaiting = 10;

// gets a random movie name
const generateMovieName = () => {
  return movieNames[Math.floor((Math.random() * movieNames.length) + 0)];
};

// generates movie description
const generateMovieDescription = () => {
  const maxSentencesCount = 5;
  const descriptionSentencesArray = generateArrayFromString(fishText);
  let description = ``;

  for (let i = 0; i < maxSentencesCount; i++) {
    description += descriptionSentencesArray[Math.floor((Math.random() * descriptionSentencesArray.length) + 0)];
    description += `. `;
  }

  return description;
};

// generates movie raiting
const createMovieMock = (number) => {
  return {
    name: generateMovieName(),
    id: `film_` + number,
    country: `USA`,
    esrbRaiting: `18+`,
    genre: generateGenres(),
    raiting: generateMovieRaiting(),
    description: generateMovieDescription(),
    comments: generateComments(),
    isWatchlist: Math.random() >= 0.5,
    isWatched: Math.random() >= 0.5,
    isFavorite: Math.random() >= 0.5,
  };
};

const generateMovieRaiting = () => {
  return ((Math.random() * maxRaiting) + 0).toFixed(1);
};

let mocks = [];

for (let i = 0; i < numberOfMocks; i++) {
  mocks.push(createMovieMock(i));
}

export const readyMocks = mocks;
