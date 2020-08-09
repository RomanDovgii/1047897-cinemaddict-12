import {getRandomNumber, getRandomDate, sentences} from "../utils/main.js";
import {userNames, emojiDescription} from "../utils/const.js";

const max = 9;

export const generateComments = () => {
  const commentsCount = getRandomNumber(0, max);
  let comments = [];

  for (let i = 0; i < commentsCount; i++) {
    comments.push(createComment());
  }

  return comments;
};

const createComment = () => {
  return {
    author: userNames[getRandomNumber(0, userNames.length - 1)],
    text: sentences[getRandomNumber(0, sentences.length - 1)],
    emoji: emojiDescription[getRandomNumber(0, emojiDescription.length - 1)],
    date: getRandomDate()
  };
};