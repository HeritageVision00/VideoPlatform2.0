import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from "../models/API";

@Injectable({
  providedIn: 'root'
})
export class VmsService {
  constructor(
    private http: HttpClient
    ) { }

  recording(data){
    return this.http.post(`${api}/vms/export_video`, data);
  }
}
