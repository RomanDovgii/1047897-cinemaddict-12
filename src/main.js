import {generateCard} from "./view/card.js";
import {generateFilmsContainer} from "./view/films-container.js";
import {generateFilmsMain} from "./view/films-main.js";
import {generateMenu} from "./view/menu.js";
import {generateMoreButton} from "./view/more-button.js";
import {generatePopup} from "./view/popup";
import {generateRank} from "./view/rank.js";
import {generateSort} from "./view/sort.js";
import {generateStats} from "./view/stats.js";
import {CARD_COUNT_MAIN, CARD_COUNT_EXTRA, RenderPosition, MovieContainers} from "./utils/const";
import {render} from "./utils/main.js";
import {mocks} from "./mocks/movie.js";

const generateCards = (min = 0, max = 0) => {
  const bottom = Math.min(min, max);
  const ceiling = Math.max(min, max);

  let preparedMocks = mocks.slice(bottom, ceiling);
  return preparedMocks.reduce((accumulator, movie) => accumulator + generateCard(movie), ``);
};

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

render(header, generateRank(), RenderPosition.BEFOREEND);

render(main, generateMenu(), RenderPosition.BEFOREEND);
render(main, generateSort(), RenderPosition.BEFOREEND);
render(main, generateFilmsMain(), RenderPosition.BEFOREEND);

const filmsMainContainer = main.querySelector(`.films`);

render(filmsMainContainer, generateFilmsContainer(MovieContainers.ALL), RenderPosition.BEFOREEND);
render(filmsMainContainer, generateFilmsContainer(MovieContainers.TOP), RenderPosition.BEFOREEND);
render(filmsMainContainer, generateFilmsContainer(MovieContainers.COMMENTED), RenderPosition.BEFOREEND);

const filmsAllMain = filmsMainContainer.querySelector(`.films-list`);

render(filmsAllMain, generateMoreButton(), RenderPosition.BEFOREEND);

const filmsAll = filmsMainContainer.querySelector(`.films-list .films-list__container`);
const filmsTop = filmsMainContainer.querySelector(`.films-list--top .films-list__container`);
const filmsCommented = filmsMainContainer.querySelector(`.films-list--commented .films-list__container`);

render(filmsAll, generateCards(CARD_COUNT_MAIN), RenderPosition.BEFOREEND);
render(filmsTop, generateCards(CARD_COUNT_EXTRA), RenderPosition.BEFOREEND);
render(filmsCommented, generateCards(CARD_COUNT_EXTRA), RenderPosition.BEFOREEND);

const footerStats = footer.querySelector(`.footer__statistics`);

render(footerStats, generateStats(), RenderPosition.BEFOREEND);

const showMoreButton = document.querySelector(`.films-list__show-more`);

let generatedCardCount = CARD_COUNT_MAIN;

showMoreButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  render(filmsAll, generateCards(generatedCardCount, generatedCardCount + CARD_COUNT_MAIN), RenderPosition.BEFOREEND);

  generatedCardCount += CARD_COUNT_MAIN;
  if (generatedCardCount >= mocks.length) {
    showMoreButton.remove();
  }
});

render(footer, generatePopup(mocks[0]), RenderPosition.AFTEREND);
