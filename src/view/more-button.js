import Abstract from "./abstract";

const createMoreButtonTemplate = () => {
  return `
  <button class="films-list__show-more">Show more</button>
  `;
};

export default class MoreButton extends Abstract {
  getTemplate() {
    return createMoreButtonTemplate();
  }
}
