import Abstract from "./abstract.js";
import {render} from "../utils/render.js";
import {RenderPosition} from "../utils/const.js";
import {getPath, createElement} from "../utils/main.js";

const createNewCommentTemplate = () => {
  return `
  <div class="film-details__new-comment">
    <div for="add-emoji" class="film-details__add-emoji-label">
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>
  `;
};

const emojiPreviewTemplate = (emoji) => {
  const emojiPath = getPath(`emoji`, emoji);
  return `<img class="film-details__emoji-preview" src="${emojiPath}" width="55" height="55" alt="${emoji}">`;
};

export default class AddComment extends Abstract {
  constructor() {
    super();
    this._comment = {};
    this._handleEmojiClick = this._handleEmojiClick.bind(this);
  }

  getTemplate() {
    return createNewCommentTemplate(this._comment);
  }

  _handleEmojiClick(evt) {
    const emoji = evt.target.closest(`.film-details__emoji-label`).getAttribute(`for`);
    const emojiContainer = this.getElement().querySelector(`.film-details__add-emoji-label`);
    const imagePreviewElement = createElement(emojiPreviewTemplate(emoji));
    const existingImagePreviewElement = this.getElement().querySelector(`.film-details__emoji-preview`);

    if (!existingImagePreviewElement) {
      render(emojiContainer, imagePreviewElement, RenderPosition.BEFOREEND);
    } else {
      existingImagePreviewElement.remove();
      render(emojiContainer, imagePreviewElement, RenderPosition.BEFOREEND);
    }
  }

  setEmojiClickHandler() {
    const labels = Array.from(this.getElement().querySelectorAll(`.film-details__emoji-label`));
    labels.map((element) => element.addEventListener(`click`, this._handleEmojiClick));
  }
}
