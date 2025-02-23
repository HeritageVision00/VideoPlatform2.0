import { environment } from "../../environments/environment";
import { ip } from "./IpServer";

let url: string;

if (environment.production === false) {
  url = "http://" + ip + ":3300/api4";
} else {
  url = "/api4";
}

export var api: string = url;
