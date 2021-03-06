import SmartView from "./smart.js";
import {render} from "../utils/render.js";
import {RenderPosition, UpdateType, UserAction} from "../utils/const.js";
import {getPath, createElement} from "../utils/main.js";
import moment from "moment";

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

const getEmojiPreviewTemplate = (emoji) => {
  const emojiPath = getPath(`emoji`, emoji);
  return `<img class="film-details__emoji-preview" src="${emojiPath}" width="55" height="55" alt="${emoji}">`;
};

export default class AddComment extends SmartView {
  constructor(action) {
    super();
    this._action = action;
    this._comment = {};
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._sendMessageKeydownHandler = this._sendMessageKeydownHandler.bind(this);
  }

  getTemplate() {
    return createNewCommentTemplate(this._comment);
  }

  setEmojiClickHandler() {
    const labels = Array.from(this.getElement().querySelectorAll(`.film-details__emoji-label`));
    labels.map((element) => element.addEventListener(`click`, this._emojiClickHandler));
  }

  setSendMessageKeydownHandler(callback) {
    this._callback.addCommentKeydown = callback;
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._sendMessageKeydownHandler);
  }

  renderEmojiContainer(emoji) {
    const emojiContainer = this.getElement().querySelector(`.film-details__add-emoji-label`);
    const imagePreviewElement = createElement(getEmojiPreviewTemplate(emoji));
    render(emojiContainer, imagePreviewElement, RenderPosition.BEFOREEND);
  }

  showProblem() {
    const element = this.getElement();
    element.classList.add(`shake`);
    this.getElement().querySelector(`.film-details__comment-input`).removeEventListener(`keydown`, this._sendMessageKeydownHandler);
    setTimeout(() => {
      element.classList.remove(`shake`);
      this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._sendMessageKeydownHandler);
    }, 700);
  }

  lock() {
    const element = this.getElement();
    const textarea = element.querySelector(`.film-details__comment-input`);
    const emojiInputs = element.querySelectorAll(`.film-details__emoji-item`);

    textarea.disabled = true;

    Array.from(emojiInputs).map((input) => {
      input.disabled = true;
    });
  }

  unlock() {
    const element = this.getElement();
    const textarea = element.querySelector(`.film-details__comment-input`);
    const emojiInputs = element.querySelectorAll(`.film-details__emoji-item`);

    textarea.disabled = false;
    Array.from(emojiInputs).map((input) => {
      input.disabled = false;
    });
  }

  _sendMessageKeydownHandler(evt) {
    if (evt.ctrlKey && evt.keyCode === 13) {
      const element = this.getElement();


      if (!element.querySelector(`.film-details__comment-input`).value || !element.querySelector(`.film-details__emoji-preview`)) {
        this.showProblem();
        return;
      }

      const textLocal = element.querySelector(`.film-details__comment-input`).value;

      const emojiLocal = element.querySelector(`.film-details__emoji-preview`).alt;

      const comment = {
        text: textLocal,
        emoji: emojiLocal,
        date: moment().toISOString()
      };

      element.querySelector(`.film-details__comment-input`).removeEventListener(`keydown`, this._sendMessageKeydownHandler);
      element.querySelector(`.film-details__comment-input`).disabled = true;


      this._action(UserAction.ADD_COMMENT, UpdateType.MAJOR, comment);
    }
  }

  _emojiClickHandler(evt) {
    const emoji = evt.target.closest(`.film-details__emoji-label`).getAttribute(`for`);
    const existingImagePreviewElement = this.getElement().querySelector(`.film-details__emoji-preview`);

    if (!existingImagePreviewElement) {
      this.renderEmojiContainer(emoji);
    } else {
      existingImagePreviewElement.remove();
      this.renderEmojiContainer(emoji);
    }
  }

}
