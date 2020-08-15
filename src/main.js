import Card from "./view/card.js";
import FilmsContainer from "./view/films-container.js";
import FilmsMain from "./view/films-main.js";
import Menu from "./view/menu.js";
import MoreButton from "./view/more-button.js";
import Popup from "./view/popup.js";
import UserRank from "./view/user-rank.js";
import SortMenu from "./view/sort-menu.js";
import Statistics from "./view/statistics.js";
import {CARD_COUNT_MAIN, CARD_COUNT_EXTRA, RenderPosition, MovieContainers} from "./utils/const";
import {render} from "./utils/main.js";
import {mocks} from "./mocks/movie.js";

const getPreparedMocks = (type) => {
  const mocksCopy = [...mocks];

  switch (type) {
    case MovieContainers.TOP:
      return mocksCopy.sort((a, b) => b.raiting - a.raiting);
    case MovieContainers.COMMENTED:
      return mocksCopy.sort((a, b) => b.comments.length - a.comments.length);
    default:
      return mocksCopy;
  }
};

const showPopup = (evt, popupLocal) => {
  evt.preventDefault();
  evt.stopPropagation();

  if (document.querySelector(`.film-details`)) {
    document.querySelector(`.film-details`).remove();
  }

  render(body, popupLocal.getElement(), RenderPosition.BEFOREEND);

  const closeButton = popupLocal.getElement().querySelector(`.film-details__close-btn`);

  const removePopup = (evnt) => {
    evnt.preventDefault();
    evnt.stopPropagation();

    closeButton.removeEventListener(`click`, removePopup);
    document.removeEventListener(`click`, documentClickHandler);
    document.removeEventListener(`keydown`, documentEscKeydownHandler);

    popupLocal.removeElement();
  };

  const documentClickHandler = (evnt) => {
    const eventTarget = evnt.target;
    if ((!eventTarget.closest(`.film-details`))) {
      removePopup(evnt);
    }
  };

  const documentEscKeydownHandler = (evnt) => {
    if (evnt.keyCode === 27) {
      removePopup(evnt);
    }
  };

  closeButton.addEventListener(`click`, removePopup);

  if (popupLocal) {
    document.addEventListener(`click`, documentClickHandler);
    document.addEventListener(`keydown`, documentEscKeydownHandler);
  }
};

const generateCards = (min, max, type) => {
  const bottom = Math.min(min, max);
  const ceiling = Math.max(min, max);
  const preparedMocks = getPreparedMocks(type).slice(bottom, ceiling);

  const fragment = new DocumentFragment();

  preparedMocks.forEach((movie) => {
    const cardElement = new Card(movie).getElement();
    const popup = new Popup(movie);
    fragment.append(cardElement);

    cardElement.querySelector(`.film-card__poster`).addEventListener(`click`, (evt) => {
      showPopup(evt, popup);
    });
    cardElement.querySelector(`.film-card__comments`).addEventListener(`click`, (evt) => {
      showPopup(evt, popup);
    });
    cardElement.querySelector(`.film-card__title`).addEventListener(`click`, (evt) => {
      showPopup(evt, popup);
    });
  });

  return fragment;
};

const body = document.querySelector(`.body`);
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

render(header, new UserRank().getElement(), RenderPosition.BEFOREEND);

render(main, new Menu(mocks).getElement(), RenderPosition.BEFOREEND);
render(main, new SortMenu().getElement(), RenderPosition.BEFOREEND);
render(main, new FilmsMain().getElement(), RenderPosition.BEFOREEND);

const filmsMainContainer = main.querySelector(`.films`);

render(filmsMainContainer, new FilmsContainer(MovieContainers.ALL).getElement(), RenderPosition.BEFOREEND);
render(filmsMainContainer, new FilmsContainer(MovieContainers.TOP).getElement(), RenderPosition.BEFOREEND);
render(filmsMainContainer, new FilmsContainer(MovieContainers.COMMENTED).getElement(), RenderPosition.BEFOREEND);

const filmsAllMain = filmsMainContainer.querySelector(`.films-list`);

render(filmsAllMain, new MoreButton().getElement(), RenderPosition.BEFOREEND);

const filmsAll = filmsMainContainer.querySelector(`.films-list .films-list__container`);
const filmsTop = filmsMainContainer.querySelector(`.films-list--top .films-list__container`);
const filmsCommented = filmsMainContainer.querySelector(`.films-list--commented .films-list__container`);

render(filmsAll, generateCards(0, CARD_COUNT_MAIN, MovieContainers.ALL), RenderPosition.BEFOREEND);
render(filmsTop, generateCards(0, CARD_COUNT_EXTRA, MovieContainers.TOP), RenderPosition.BEFOREEND);
render(filmsCommented, generateCards(0, CARD_COUNT_EXTRA, MovieContainers.COMMENTED), RenderPosition.BEFOREEND);

const footerStats = footer.querySelector(`.footer__statistics`);

render(footerStats, new Statistics(mocks).getElement(), RenderPosition.BEFOREEND);

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
