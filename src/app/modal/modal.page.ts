import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService, Item } from '../data.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
@Input() item:any;
ordercartoons:number=0;
orderitems:number=0;
date:any;
  constructor(public datasrv:DataService, public modalctrl:ModalController) { }

  ngOnInit() {
    this.date=new Date(this.item.lastorderd);
    console.log(this.date);
    
  }

updateitem(){
this.datasrv.update(this.item);
}
order(){
this.datasrv.placeorder(this.item,this.item.supplier,this.ordercartoons,this.orderitems);

}
}
