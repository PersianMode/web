import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HttpService {
  private serverAddress = '/api/';
  constructor(private http: HttpClient) {
  }

  //---------- START MOCK SERVER !! FOR TEST ONLY !! WILL BE REMOVED WHEN REAL SERVER WAS CREATED !! -----------------
  private mockServerAddress = 'http://p183d.mocklab.io/';

  getMockCollections(): Observable<any> {
    return this.http.get(this.mockServerAddress + 'api/collections', {observe: 'response'});
  }

  getProductByName(values): Observable<any> {
    return this.http.post(this.mockServerAddress + 'api/products', values, {observe: 'response'});
  }

  getOneCollection(id): Observable<any> {
    return this.http.get(this.mockServerAddress + 'api/collections/' + id, {observe: 'response'});
  }
  //------------------------------------------------ END MOCK --------------------------------------------------------

  getMockProducts(): Observable<any> {
    return this.http.get('https://b8478a2d-c842-415e-af78-1c41137667ee' +
      '.mock.pstmn.io/api/products/', {observe: 'response', headers: {
      'x-api-key': '9dbabc8e50de4db09056119030e44770',
    }});
  }

  get(url): Observable<any> {
    return this.http.get(this.serverAddress + url, {observe: 'response'});
  }

  put(url, values): Observable<any> {
    return this.http.put(this.serverAddress + url, values, {observe: 'response'}).map(data => data.body);
  }

  post(url, values): Observable<any> {
    return this.http.post(this.serverAddress + url, values, {observe: 'response'}).map(data => data.body);
  }

  delete(url): Observable<any> {
    return this.http.delete(this.serverAddress + url, {observe: 'response'});
  }
}
