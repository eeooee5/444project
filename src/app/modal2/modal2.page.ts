import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../data.service';

@Component({
  selector: 'app-modal2',
  templateUrl: './modal2.page.html',
  styleUrls: ['./modal2.page.scss'],
})
export class Modal2Page implements OnInit {
@Input() Order:any;
  constructor() { }

  ngOnInit() {
  }

}
