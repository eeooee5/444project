import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DataService, Order } from '../data.service';
import { Modal2Page } from '../modal2/modal2.page';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  Orders:Order[]=[];
  Supplier:string='' ;
  suppliers:string[]=[];
    constructor(public datasrv:DataService,public modalctrl:ModalController,public navctrl:NavController) {
      this.datasrv.getOrders().subscribe(res=>{
       
        this.Orders=res;
        res.forEach((element)=>{
          if(this.suppliers.lastIndexOf(element.Supname)==-1)
          this.suppliers.push(element.Supname)});
      });
      this.suppliers.sort();
    }
  ngOnInit(): void {
   
  }
    async openOrder(Order:Order){
    const modal =await this.modalctrl.create(
      {
        component: Modal2Page,
        componentProps:{Order:Order},
        breakpoints:[0,0.5,0.8],
        initialBreakpoint:0.5
      }
    );
    modal.present();
    }

    deliver(order:Order){
       this.datasrv.Deliver(order);

    }
    gotoporders(){
      this.navctrl.navigateForward('/past-orders');
     }
  }
