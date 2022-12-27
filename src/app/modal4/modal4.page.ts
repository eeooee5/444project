import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService, Item } from '../data.service';

@Component({
  selector: 'app-modal4',
  templateUrl: './modal4.page.html',
  styleUrls: ['./modal4.page.scss'],
})
export class Modal4Page implements OnInit {
  @Input() item:any;
  ordercartoons:number=0;
  orderitems:number=0;
  date:any;
    constructor(public datasrv:DataService, public modalctrl:ModalController) { }
  
    ngOnInit() {
   
      
    }
  
 
  
  }
  