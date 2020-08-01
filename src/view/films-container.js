export const generateFilmsContainer = (container) => {
  return `
  <section class="${container.elementClass}">
    <h2 class="films-list__title ${container.visuallyHidden ? `visually-hidden` : ``}">${container.heading}</h2>
    <div class="films-list__container"></div>
  </section>
  `;
};
