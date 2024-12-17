import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Importar HttpClient
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.tutiempo.net/json/?lan=es&apid=XxE4qqz4zz4hjmw&lid=55735';  private apimonea = 'https://mindicador.cl/api';

  constructor(private http: HttpClient) { }
  getTiempo(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getmonea(): Observable<any> {
    return this.http.get<any>(this.apimonea);
  }
}
