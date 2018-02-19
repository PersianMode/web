import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HttpService {

  public static Host = 'http://localhost:3000';
  private serverAddress = '/api/';
  constructor(private http: HttpClient) {
  }

  // only for mock server purpose -> will be deleted when server api was completed
  getMockCollections(): Observable<any> {
    return this.http.get('https://69ab57c3-ac95-43ee-9f43-f4bd89a4d427.mock.pstmn.io/api/collections/', {observe: 'response'});
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

  //ONLY WORKS FOR ADDING PRODUCTS TO COLLECTIONS FOR NOW!
  suggest(data, values) {
    //API address should be changed in order to be generalized
    //BETTER TO BE: 'suggest/' and data is given through values :-?
    return this.http.post(this.serverAddress + 'products/search', values);
  }

  //ONLY WORKS FOR SEARCHING ON COLLECTIONS FOR NOW
  search(data) {
    return this.http.post(this.serverAddress + 'search/', data);
  }
}
