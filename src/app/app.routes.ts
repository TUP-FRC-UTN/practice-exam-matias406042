import { Routes } from '@angular/router';
import { NewOrderComponent } from './new-order/new-order.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ViewOrdersComponent } from './view-orders/view-orders.component';


export const routes: Routes = [

    {
        path: 'newOrder', component: NewOrderComponent
    },
    {
        path:'list',component: ViewOrdersComponent
    }



];
