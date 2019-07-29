import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {isDevMode} from '@angular/core';

@Injectable()
export class HttpService {


  public static PRODUCT_IMAGE_PATH = 'images/product-image';
  public static Host;
  private serverAddress = '/api/';
  // constructor(private http: HttpClient) {
  //   // HttpService.Host = window.location.protocol + '//' + window.location.hostname + ':' + (window.location.port);
  //   // if (this.isInDevMode()) {
  //   //   HttpService.Host = HttpService.Host.replace(window.location.port, '3000');
  //   // }
  //   HttpService.Host = 'https://lithium.style';
  // }

  constructor(private http: HttpClient) {
    HttpService.Host = window.location.protocol + '//' + window.location.hostname + ':' + (window.location.port);
    // HttpService.Host = 'https://lithium.style';
  }

  isInDevMode() {
    return isDevMode();
  }

  get(url): Observable<any> {
    return this.http.get(this.serverAddress + url, {observe: 'response'}).map(data => data.body);
  }

  put(url, values): Observable<any> {
    return this.http.put(this.serverAddress + url, values, {observe: 'response'}).map(data => data.body);
  }

  post(url, values): Observable<any> {
    return this.http.post(this.serverAddress + url, values, {observe: 'response'}).map(data => data.body);
  }

  delete(url): Observable<any> {
    return this.http.delete(this.serverAddress + url, {observe: 'response'}).map(data => data.body);
  }
}
