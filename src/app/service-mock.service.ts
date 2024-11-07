import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Producto } from '../models/product';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class ServiceMockService {

  private readonly http = inject(HttpClient)
  
  private apiUrl = "http://localhost:3000/"

  get(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl+"products")
  }

  getByEmail(email:string):Observable<Order[]>{
    return this.http.get<Order[]>(this.apiUrl+"orders?email="+email)
  }

  post(p: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl+"orders", p)
  }

  getOrders():Observable<Order[]>
  {
      console.log("entro servicio")
      return this.http.get<Order[]>(this.apiUrl+"orders")
  }

}
