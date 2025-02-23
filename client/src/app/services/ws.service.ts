import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { Message } from "../models/WsMess";
import { api } from "../models/APIVS";
import { webSocket } from 'rxjs/webSocket';
import { Account } from "../models/Account";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WsService {
  API_URI = api;
  now_user: Account;

  constructor(
    private http: HttpClient
    ) {
    this.now_user = JSON.parse(localStorage.getItem('now_user'));
  }

  // private reconnectionAttempts = 5;
  // public currentAttempt = 0;
  // private socket$: WebSocketSubject<Message>;

  public connection(){
    return webSocket<Message>(`ws://${environment.webSocketUrl}/ws/connect/${this.now_user.id_account}/${this.now_user.id_branch}/client`)
  }

  public status(){
    return webSocket(`ws://${environment.webSocketUrl}/ws/status/${this.now_user.id_account}/${this.now_user.id_branch}/reader`)
  }
  
  startStop(body){
    return this.http.post(`${this.API_URI}/status/${this.now_user.id_account}/${this.now_user.id_branch}`, body);
  }

  info(){
    return this.http.get(`http://${environment.webSocketUrl}/info`);
  }
  // private connection(): void {
  //   this.socket$ = webSocket<Message>(`${environment.webSocketUrl}/ws/connect/client`)

  //   this.socket$.subscribe(
  //     () => {
  //       console.log('WebSocket connected');
  //       this.currentAttempt = 0;
  //     },
  //     (error) => {
  //       console.log(`WebSocket error: ${error}`);
  //       this.tryReconnect();
  //     },
  //     () => {
  //       console.log('WebSocket disconnected');
  //       this.tryReconnect();
  //     }
  //   );
  // }

  // public tryReconnect(): void {
  //   if (this.currentAttempt < this.reconnectionAttempts) {
  //     this.currentAttempt++;
  //     console.log(`WebSocket reconnecting (attempt ${this.currentAttempt})...`);
  //     setTimeout(() => {
  //       console.log('Trying...')
  //       this.connection();
  //     }, 5000); // Wait for 5 seconds before attempting to reconnect
  //   } else {
  //     console.log('WebSocket reconnection failed');
  //   }
  // }

  // public onMessage(): Observable<any> {
  //   return this.socket$.asObservable();
  // }
}
