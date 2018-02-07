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
