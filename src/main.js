import {generateCard} from "./view/card.js";
import {generateFilmsContainer} from "./view/films-container.js";
import {generateFilmsMain} from "./view/films-main.js";
import {generateMenu} from "./view/menu.js";
import {generateMoreButton} from "./view/more-button.js";
import {generatePopup} from "./view/popup";
import {generateRank} from "./view/rank.js";
import {generateSort} from "./view/sort.js";
import {generateStats} from "./view/stats.js";
import {CARD_COUNT_MAIN, CARD_COUNT_EXTRA, RENDER_POSITION, MOVIE_CONTAINERS} from "./utils/const";
import {render} from "./utils/main.js";
import {mocks} from "./mocks/movie.js";

const generateCards = (min, max, type) => {
  const bottom = Math.min(min, max);
  const ceiling = Math.max(min, max);

  let preparedMocks = [];

  switch (type) {
    case MOVIE_CONTAINERS.TOP:
      preparedMocks = mocks.slice().sort((a, b) => b.raiting - a.raiting).slice(bottom, ceiling);
      break;
    case MOVIE_CONTAINERS.COMMENTED:
      preparedMocks = mocks.slice().sort((a, b) => b.comments.length - a.comments.length).slice(bottom, ceiling);
      break;
    default:
      preparedMocks = mocks.slice(bottom, ceiling);
      break;
  }

  return preparedMocks.reduce((accumulator, movie) => accumulator + generateCard(movie), ``);
};

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

render(header, generateRank(), RENDER_POSITION.BEFOREEND);

render(main, generateMenu(), RENDER_POSITION.BEFOREEND);
render(main, generateSort(), RENDER_POSITION.BEFOREEND);
render(main, generateFilmsMain(), RENDER_POSITION.BEFOREEND);

const filmsMainContainer = main.querySelector(`.films`);

render(filmsMainContainer, generateFilmsContainer(MOVIE_CONTAINERS.ALL), RENDER_POSITION.BEFOREEND);
render(filmsMainContainer, generateFilmsContainer(MOVIE_CONTAINERS.TOP), RENDER_POSITION.BEFOREEND);
render(filmsMainContainer, generateFilmsContainer(MOVIE_CONTAINERS.COMMENTED), RENDER_POSITION.BEFOREEND);

const filmsAllMain = filmsMainContainer.querySelector(`.films-list`);

render(filmsAllMain, generateMoreButton(), RENDER_POSITION.BEFOREEND);

const filmsAll = filmsMainContainer.querySelector(`.films-list .films-list__container`);
const filmsTop = filmsMainContainer.querySelector(`.films-list--top .films-list__container`);
const filmsCommented = filmsMainContainer.querySelector(`.films-list--commented .films-list__container`);

render(filmsAll, generateCards(0, CARD_COUNT_MAIN, MOVIE_CONTAINERS.ALL), RENDER_POSITION.BEFOREEND);
render(filmsTop, generateCards(0, CARD_COUNT_EXTRA, MOVIE_CONTAINERS.TOP), RENDER_POSITION.BEFOREEND);
render(filmsCommented, generateCards(0, CARD_COUNT_EXTRA, MOVIE_CONTAINERS.COMMENTED), RENDER_POSITION.BEFOREEND);

const footerStats = footer.querySelector(`.footer__statistics`);

render(footerStats, generateStats(), RENDER_POSITION.BEFOREEND);

const showMoreButton = document.querySelector(`.films-list__show-more`);

let generatedCardCount = CARD_COUNT_MAIN;

showMoreButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  render(filmsAll, generateCards(generatedCardCount, generatedCardCount + CARD_COUNT_MAIN), RENDER_POSITION.BEFOREEND);

  generatedCardCount += CARD_COUNT_MAIN;
  if (generatedCardCount >= mocks.length) {
    showMoreButton.remove();
  }
});

render(footer, generatePopup(mocks[0]), RENDER_POSITION.AFTEREND);
