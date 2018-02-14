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
    return this.http.post(this.serverAddress + 'products/search', values);
  }

  //ONLY WORKS FOR SEARCHING ON COLLECTIONS FOR NOW
  search(data, offset, pageSize = 10) {
    return this.http.post(this.serverAddress + 'search/' + (offset? offset: 0) + '/' + pageSize, data);
  }
}
