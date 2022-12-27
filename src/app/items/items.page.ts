import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DataService, Item } from '../data.service';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  items:Item[]=[];

  Supplier:string='' ;
  suppliers:string[]=[];
  json:any;
    constructor(public storage:Storage,public datasrv:DataService,public modalctrl:ModalController,public navctrl:NavController) {
      this.datasrv.getItems().subscribe(res=>{
   
        this.items=res;
        res.forEach((element)=>{
          if(this.suppliers.lastIndexOf(element.supplier)==-1)
          this.suppliers.push(element.supplier)});
      });
      this.suppliers.sort();
    }
    async openItem(Item:Item){
    const modal =await this.modalctrl.create(
      {
        component: ModalPage,
        componentProps:{item:Item},
        breakpoints:[0,0.5,0.8],
        initialBreakpoint:0.65
      }
    );
    modal.present();
    }
    async ngOnInit() {
      await this.storage.create();
    }
    getItem(Item:Item){
      
      this.datasrv.getItem(Item.id).subscribe((res)=>res);  
      
  
    }
   gotoorders(){
    this.navctrl.navigateForward('/vieworders');
   }
   gotoporders(){
    this.navctrl.navigateForward('/pastorders');
   }
   async exportjson(){
    this.json=JSON.stringify(this.items);
   await this.storage.set("json",this.json);
    
   }
   async importjson(){
  this.json=await this.storage.get("json");
  this.json=JSON.parse(this.json);
  for(let item of this.json){
    console.log(item);
    
    this.items.push({
      id:item.id,
      name:item.name,
      quantity:item.quantity,
      supplier:item.supplier,
      threshold:item.threshold,
      csize:item.csize,
      lastorderd:item.lastorderd,
      lastorderq:item.lastorderq
  
    });
  }
  console.log(this.items);
  
   }
  }