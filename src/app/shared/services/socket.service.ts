import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Rx';
import {HttpService} from './http.service';

@Injectable()
export class SocketService {
  private socketConfig = {
    transports: ['websocket']
  };

  private orderLineSocket;

  private orderLineObsevable = new Observable(observer => {
    this.orderLineSocket.on('ans', (data) => {
      observer.next(data);
    });
  });

  constructor() {
  }

  public init(nsp) {
    this.orderLineSocket = io(HttpService.Host + '/' + nsp, this.socketConfig);
  }

  getOrderLineMessage() {
    return this.orderLineObsevable;
  }

  disconnect() {
    if (this.orderLineSocket)
      this.orderLineSocket.disconnect();
  }
}
