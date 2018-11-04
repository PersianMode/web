import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, BehaviorSubject, Subject} from 'rxjs/Rx';
import {HttpService} from './http.service';

@Injectable()
export class SocketService {
  // private socketConfig = {
  //   transports: ['websocket']
  // };

  private orderLineSocket;
  private orderLine$ = new Subject();

  constructor() {
  }

  public init() {
    this.orderLineSocket = io(HttpService.Host);
    this.orderLineSocket.on('msg', (message) => {
      console.log('-> socket message: ', message);
      this.orderLine$.next(message);
    });

  }

  getOrderLineMessage() {
    if (this.orderLineSocket)
      return this.orderLine$;
  }

  disconnect() {
    if (this.orderLineSocket)
      this.orderLineSocket.disconnect();
  }
}
