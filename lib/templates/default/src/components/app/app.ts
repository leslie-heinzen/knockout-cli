import * as ko from "knockout";
import { Observable } from "knockout";

interface AppParams {
  message: string;
}

export default class App {
  message?: Observable<string>;

  constructor({ message }: AppParams) {
    this.message = ko.observable(message);
  }

  dispose() {}
}
