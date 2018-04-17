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

  private orderLineObservable = new Observable(observer => {
    this.orderLineSocket.on('msg', (message) => {
      console.log('-> socket message: ', message);
      observer.next(message);
    });
  });

  constructor() {
  }

  public init(nsp) {
    this.orderLineSocket = io(HttpService.Host + '/' + nsp, this.socketConfig);
  }

  getOrderLineMessage() {
    return this.orderLineObservable;
  }

  disconnect() {
    this.orderLineSocket.disconnect();
  }
}
