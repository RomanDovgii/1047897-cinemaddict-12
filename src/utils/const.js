export const CARD_COUNT_MAIN = 5;
export const CARD_COUNT_EXTRA = 2;
export const MOCKS_COUNT = 40;
export const MAX_RAITING = 10;
export const MAX_GENRES = 5;
export const MIN_DURATION = 30;
export const MAX_DURATION = 360;
export const MIN_SENTENCE = 1;
export const MAX_SENTENCE = 10;

export const MAIN_IMAGES_PATH = `./images`;

export const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export const MovieContainers = {
  ALL: {
    elementClass: `films-list`,
    heading: `All movies. Upcoming`,
    visuallyHidden: true
  },
  TOP: {
    elementClass: `films-list--extra films-list--top`,
    heading: `Top rated`,
    visuallyHidden: false
  },
  COMMENTED: {
    elementClass: `films-list--extra films-list--commented`,
    heading: `Most commented`,
    visuallyHidden: false
  }
};

export const fishText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;


export const movieNames = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `The great Flamarion`,
  `Made for Each Other`
];

export const genres = [
  `Absurdic`,
  `Surreal`,
  `Whimiscal`,
  `Action`,
  `Adventure`,
  `Comedy`,
  `Crime`,
  `Drama`,
  `Fantasy`,
  `Historical`,
  `Historical fiction`,
  `Horror`,
  `Magical realism`,
  `Mystery`,
  `Paranoid fiction`,
  `Philosophical`,
  `Political`,
  `Romance`,
  `Saga`,
  `Satire`,
  `Science fiction`,
  `Social`,
  `Speculative`,
  `Thriller`,
  `Urban`,
  `Western`
];

export const userNames = [
  `Egor Dmitriev`,
  `Nicko Belick`,
  `Roman Belick`,
  `Dmitii Rogozin`,
  `Evgeniy Royzman`,
  `Evgenii Batkovich`
];

export const contentRaiting = [
  `0+`,
  `6+`,
  `12+`,
  `16+`,
  `18+`
];

export const countries = [
  `USA`,
  `Canada`,
  `Mexico`,
  `Poland`,
  `Serbia`,
  `France`,
  `UK`,
  `USSR`,
  `Japan`,
  `Finland`,
  `Columbia`
];

export const MovieDuration = {
  THE_DANCE_OF_LIFE: 115,
  SAGEBRUSH_TRAIL: 54,
  THE_MAN_WITH_THE_GOLDEN_ARM: 119,
  SANTA_CLAUS_CONQUERS_THE_MARTIANS: 81,
  POPEYE_THE_SAILOR_MEETS_SINDBAD_THE_SAILOR: 16,
  THE_GREAT_FLAMARION: 78,
  MADE_FOR_EACH_OTHER: 92
};

export const PosterNames = {
  THE_DANCE_OF_LIFE: `the-dance-of-life.jpg`,
  SAGEBRUSH_TRAIL: `sagebrush-trail.jpg`,
  THE_MAN_WITH_THE_GOLDEN_ARM: `the-man-with-the-golden-arm.jpg`,
  SANTA_CLAUS_CONQUERS_THE_MARTIANS: `santa-claus-conquers-the-martians.jpg`,
  POPEYE_THE_SAILOR_MEETS_SINDBAD_THE_SAILOR: `popeye-meets-sinbad.png`,
  THE_GREAT_FLAMARION: `the-great-flamarion.jpg`,
  MADE_FOR_EACH_OTHER: `made-for-each-other.png`
};

export const emojiDescription = [
  `emoji-smile`,
  `emoji-sleeping`,
  `emoji-puke`,
  `emoji-angry`
];

export const ImageTypes = {
  POSTER: `posters`,
  ICON: `icons`,
  EMOJI: `emoji`
};
