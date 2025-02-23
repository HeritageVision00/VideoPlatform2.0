import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { api } from "../models/APIVS";


@Injectable(
  {
  providedIn: "root",
}
)
export class VideoService {
  constructor(private http: HttpClient) {}

  processVideo(data: any) {
   // return this.http.post(`/api3/video/process`, data);
    return this.http.post(`${api}/video/process`, data);
  }
  
  uploadVideo(data: any) {
    //return this.http.post(`/api3/video`, data);
    return this.http.post(`${api}/video`, data);
  } // used in processvideoPOST

  getVideo(){
    //return this.http.get(`/api3/video/list`);
    return this.http.get(`${api}/video/list`);

  }

  getSummariseVideo(){ 
    //return this.http.get('/api3/video/processed');
    return this.http.get(`${api}/video/processed`);

 }


}
