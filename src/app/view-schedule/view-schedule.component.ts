import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


interface schedule {
  path: string,
  Date: string,
  EndTime: string,
  StartTime: string,
  owner: string
}
interface Users {
  Fname: string,
  Lname: string,
  owner: string,
  type: string,
  username: string,
  isChecked: boolean,
  path: string
}

@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.scss'],
})
export class ViewScheduleComponent implements OnInit {
  @Input() user: Users[]=[];
  @Input() sch: schedule[]=[];
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.user,this.sch);
    
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
