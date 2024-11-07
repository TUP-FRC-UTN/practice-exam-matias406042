import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Order } from '../../models/order';
import { ServiceMockService } from '../service-mock.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css'
})
export class ViewOrdersComponent {

  orderForm: FormGroup =new FormGroup({});
  orders: Order[] = []
  tableOrders :Order [] = []

  constructor(private router : Router , private service : ServiceMockService ) {
  }


  loadOrders(){
    this.service.getOrders().subscribe((data :Order[])=>{ 
    this.orders= data;  
    this.tableOrders = this.orders

  })}




  ngOnInit(): void {

    this.loadOrders()

   this.orderForm =new FormGroup({
    buscador: new FormControl(''),
   });
   this.orderForm.get('buscador')?.valueChanges.subscribe((data)=> {
    this.filtrarTabla(data);
   }
  )
  }


  filtrarTabla(data: string): void {
    // Filtra las órdenes en base al texto de búsqueda
    
    let orders2 = this.orders
    console.log(data);
      orders2 = this.orders.filter((order) => {
      console.log(order);
      return (
        order.customerName.toLowerCase().includes(data.toLowerCase()) ||
        order.email.toString().includes(data) ||
        order.orderCode.includes(data) ||
        order.products.length.toString().includes(data)
      );
    });
    this.tableOrders= orders2
   
  }
  goTo(path: string){

    this.router.navigate([path])
  }



}
