
import { environment } from "../../environments/environment";

let url: string;

if (environment.production === false) {
  url = "http://localhost:3301/api4";
} else {
  url = "/api4";
}

export var api: string = url;
