import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DataService, Order } from '../data.service';
import { Modal2Page } from '../modal2/modal2.page';
import { Modal3Page } from '../modal3/modal3.page';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {


  Orders:Order[]=[];
  Supplier:string='' ;
  suppliers:string[]=[];
    constructor(public datasrv:DataService,public modalctrl:ModalController,public navctrl:NavController) {
      this.datasrv.getOrders().subscribe(res=>{
        console.log(res);
        this.Orders=res;
        res.forEach((element)=>{
          if(this.suppliers.lastIndexOf(element.Supname)==-1)
          this.suppliers.push(element.Supname)});
      });
      this.suppliers.sort();
    }
  ngOnInit() {
  }
  async openOrder(Order:Order){
    const modal =await this.modalctrl.create(
      {
        component: Modal3Page,
        componentProps:{Order:Order},
        breakpoints:[0,0.5,0.8],
        initialBreakpoint:0.5
      }
    );
    modal.present();
    }
sort(){
  this.Orders.sort((obj1, obj2) => {
    if (obj1.Supname < obj2.Supname) {
        return 1;
    }

    if (obj1.Supname > obj2.Supname) {
        return -1;
    }

    return 0;
});
}
back(){
  this.navctrl.navigateBack('/reports');
 }
}