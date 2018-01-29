import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/observable';

@Injectable()
export class SocketService {
  private url = 'http://localhost:3000';
  private socketConfig = {
    transports: ['websocket']
  };

  private orderLineSocket;

  private orderLineObsevable = new Observable(observer => {
    this.orderLineSocket.on('ans', (data) => {
      observer.next(data);
    });
  });

  constructor() { }

  public init() {
    this.orderLineSocket = io(this.url + '/orderline', this.socketConfig);
  }

  getOrderLineMessage() {
    return this.orderLineObsevable;
  }

  disconnect() {
    this.orderLineSocket.disconnect();
  }
}
