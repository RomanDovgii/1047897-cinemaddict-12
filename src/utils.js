export const CARD_COUNT_MAIN = 5;
export const CARD_COUNT_EXTRA = 2;

export const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

export const MovieContainers = {
  ALL: {
    elementClass: `films-list`,
    heading: `All movies. Upcoming`,
    visuallyHidden: true,
  },
  TOP: {
    elementClass: `films-list--extra films-list--top`,
    heading: `Top rated`,
    visuallyHidden: false,
  },
  COMMENTED: {
    elementClass: `films-list--extra films-list--commented`,
    heading: `Most commented`,
    visuallyHidden: false,
  },
};

export const render = (container, element, position) => {
  container.insertAdjacentHTML(position, element);
};
