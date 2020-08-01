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

const generateCards = (number, container) => {
  for (let i = 0; i < number; i++) {
    render(container, generateCard(), RenderPosition.BEFOREEND);
  }
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

generateCards(CARD_COUNT_MAIN, filmsAll);
generateCards(CARD_COUNT_EXTRA, filmsTop);
generateCards(CARD_COUNT_EXTRA, filmsCommented);

const footerStats = footer.querySelector(`.footer__statistics`);

render(footerStats, generateStats(), RenderPosition.BEFOREEND);
render(footer, generatePopup(), RenderPosition.AFTEREND);

