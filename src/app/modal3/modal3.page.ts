import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-modal3',
  templateUrl: './modal3.page.html',
  styleUrls: ['./modal3.page.scss'],
})
export class Modal3Page implements OnInit {
  @Input() Order:any;
  price:any;
  total:any;
  constructor(public datasrv:DataService) { }

  ngOnInit() {
this.datasrv.getItem(this.Order.itemid).subscribe((res)=>
{
  this.price=res.price;
  this.total=this.Order.total*this.price;
});


    
  }

}
