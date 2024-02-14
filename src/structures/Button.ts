import { ButtonType } from "../@types/Command";

export class Button {
  constructor(buttonOptions: ButtonType) {
    Object.assign(this, buttonOptions);
  }
}
