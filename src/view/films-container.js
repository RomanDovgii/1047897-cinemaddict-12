import Abstract from "./abstract.js";

const createFilmsContainerTemplate = (container) => {
  const {elementClass, heading, visuallyHidden} = container;

  const headingAndContainer = heading ? `<h2 class="films-list__title ${visuallyHidden ? `visually-hidden` : ``}">${heading}</h2>
  <div class="films-list__container"></div>` : ``;

  return `
  <section class="${elementClass}">
    ${headingAndContainer}
  </section>
  `;
};

export default class FilmsContainer extends Abstract {
  constructor(container) {
    super();
    this._container = container;
  }

  getTemplate() {
    return createFilmsContainerTemplate(this._container);
  }
}
