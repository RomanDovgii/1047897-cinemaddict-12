import Abstract from "./abstract";

const createFilmsMainTemplate = () => {
  return `
  <section class="films">
  </section>
  `;
};

export default class FilmsMain extends Abstract {
  getTemplate() {
    return createFilmsMainTemplate();
  }
}
