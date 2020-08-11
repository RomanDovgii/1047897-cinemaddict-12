import {getRandomNumber, sentences} from "../utils/main.js";
import {USER_NAMES, EMOJI_DESCRIPTION, MAX_COMMENTS} from "../utils/const.js";

export const generateComments = () => {
  const commentsCount = getRandomNumber(0, MAX_COMMENTS);
  const comments = [];

  for (let i = 0; i < commentsCount; i++) {
    comments.push(createComment());
  }

  return comments;
};

const createComment = () => {
  return {
    author: USER_NAMES[getRandomNumber(0, USER_NAMES.length - 1)],
    text: sentences[getRandomNumber(0, sentences.length - 1)],
    emoji: EMOJI_DESCRIPTION[getRandomNumber(0, EMOJI_DESCRIPTION.length - 1)],
    date: new Date()
  };
};
