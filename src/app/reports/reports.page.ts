import { Component, OnInit } from '@angular/core';
import { DataService, Item } from '../data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  items:Item[]=[];
  constructor(public datasrv:DataService) { 
    this.datasrv.getItems().subscribe(res=>{
   
      this.items=res;
    });
  }

  ngOnInit() {
  }

}
