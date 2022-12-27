import { Injectable } from '@angular/core';
import{Firestore,collectionData, doc,docData, updateDoc,addDoc} from'@angular/fire/firestore';
import{collection, FieldValue}from'@firebase/firestore'
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { increment } from '@angular/fire/firestore';
export interface Item{
  id?:string,
  name:string,
  quantity:number,
  supplier:string,
  threshold:number,
  lastorderq?:number,
  lastorderd?:string,
  csize:number,
  price?:number,
  category?:string,
  fastmoving?:boolean
}

export interface Order{
  id?:string,
  itemname:string,
  Supname:string,
  cartoons:number,
  numperc:number,
  itemnum:number,
  delivered:boolean,
  itemid:string,
  total:number
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  total:number=0;
  add:number=0;
  item:any;
  constructor(private firestore:Firestore) { }
  getItems():Observable<Item[]>{
    const Itemsref=collection(this.firestore,'Items');
   
    
    return collectionData(Itemsref,{idField:'id'}) as Observable<Item[]>;
  }
addItem(item:Item){
  const Ordersref=collection(this.firestore,'Items');
  return addDoc(Ordersref,{
name:item.name,
csize:item.csize,
quantity:item.quantity,
threshold:item.threshold,
supplier:item.supplier,
  });
}
  update(item:Item){
    const Itemsdocref=doc(this.firestore,`Items/${item.id}`);
    
    return updateDoc(Itemsdocref,{threshold:item.threshold})
  }
  getItem(id:any):Observable<Item>{
    const Itemsdocref=doc(this.firestore,`Items/${id}`);
    
    return docData(Itemsdocref,{idField:'id'}) as Observable<Item>;
  }
  placeorder(item:Item,sup:string,cartoon:number,items:number)
  {this.total=(cartoon as number*item.csize)
    ;
    
  
    this.total+=Number(items);
    const Ordersref=collection(this.firestore,'Orders');
    return addDoc(Ordersref,{
      itemid:item.id,
Supname:sup,
cartoons:cartoon,
itemsnum:items,
delivered:false,
itemname:item.name,
numperc:item.csize,
total:this.total
    });
  
  }
  updatelast(order:Order,quan:number,date:number){
  
    
    const Itemsdocref=doc(this.firestore,`Items/${order.itemid}`);
    
    return updateDoc(Itemsdocref,{quantity:increment(quan),lastorderq:quan,lastorderd:date});
  }


  getOrders():Observable<Order[]>{
    const Itemsref=collection(this.firestore,'Orders');
   
    
    return collectionData(Itemsref,{idField:'id'}) as Observable<Order[]>;
  }
  Deliver(order:Order){
    
    const Orderdocref=doc(this.firestore,`Orders/${order.id}`);
   updateDoc(Orderdocref,{delivered:true});
    this.updatelast(order,order.total,Date.now());
    
  }
}


