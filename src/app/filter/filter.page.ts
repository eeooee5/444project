import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DataService, Item } from '../data.service';
import { ModalPage } from '../modal/modal.page';
import { Modal4Page } from '../modal4/modal4.page';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
  items:Item[]=[];

  Supplier:string='' ;
  suppliers:string[]=[];
  Category:string[]=[];
  Cat:string='';
  json:any;
  quan:any=100;
  price:any=1;
  bfast=true;
  back(){
    this.navctrl.navigateBack('/reports');
   }
    constructor(public storage:Storage,public datasrv:DataService,public modalctrl:ModalController,public navctrl:NavController) {
      
    }
    async openItem(Item:Item){
    const modal =await this.modalctrl.create(
      {
        component: Modal4Page,
        componentProps:{item:Item},
        breakpoints:[0,0.5,0.8],
        initialBreakpoint:0.65
      }
    );
    modal.present();
    }
    async ngOnInit() {
      await this.storage.create();
      this.datasrv.getItems().subscribe(res=>{
   
        this.items=res;
        res.forEach((element)=>{
          if(this.suppliers.lastIndexOf(element.supplier)==-1)
          this.suppliers.push(element.supplier);
          if(this.Category.lastIndexOf(element.category)==-1)
          this.Category.push(element.category)});
      });
      this.suppliers.sort();
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