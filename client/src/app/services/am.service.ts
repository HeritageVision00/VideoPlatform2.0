import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from '../models/API';

@Injectable({
  providedIn: 'root'
})
export class AmService {
  API_URL = api;
  constructor(
    private http: HttpClient
    ) { }

  am(data){
    return this.http.post(`${this.API_URL}/am/compare`, data);
  }
}
