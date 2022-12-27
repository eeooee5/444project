import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ViewScheduleComponent } from '../view-schedule/view-schedule.component';

interface Users {
  Fname: string,
  Lname: string,
  owner: string,
  type: string,
  username: string,
  isChecked: boolean,
  path: string
}

interface schedule {
  path: string,
  Date: string,
  EndTime: string,
  StartTime: string,
  owner: string
}

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.page.html',
  styleUrls: ['./scheduling.page.scss'],
})
export class SchedulingPage implements OnInit {
  id: string = "awdawd";
  date: string = "";
  starttime: string = "";
  endtime: string = "";
  minDate: string = new Date(Date.now() + (3600 * 1000 * 24)).toISOString();
  loading: any;
  searched: boolean = false;
  users: Users[] = [];
  schedules: schedule[] = [];
  constructor(private modalCtrl: ModalController, private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }
  async search() {
    await this.showLoading();
    let end = new Date(this.endtime);
    let start = new Date(this.starttime);
    let date = new Date(this.date);
    if (isNaN(date.getTime())) {
      this.loading.dismiss();
      (await this.alertCtrl.create({
        header: "ERROR",
        message: "Please Select Date",
        buttons: ["Okay"]
      })).present();
    }
    else if (end <= start) {
      this.loading.dismiss();
      (await this.alertCtrl.create({
        header: "ERROR",
        message: "End Time Should be Greater than Start Time",
        buttons: ["Okay"]
      })).present();
    }
    else if (isNaN(end.getTime()) || isNaN(start.getTime())) {
      this.loading.dismiss();
      (await this.alertCtrl.create({
        header: "ERROR",
        message: "Please Select Start and End Time",
        buttons: ["Okay"]
      })).present();
    }
    else {
      this.searched = true;
      this.get();
    }
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please Wait'
    });
    this.loading.present();
  }

  get() {
    this.users = [];
    this.schedules = [];
    this.afs.collectionGroup('profile').get().subscribe({
      next: res => {
        res.docs.forEach(doc => {
          let s = (doc.data() as Users);
          s.isChecked = false;
          s.path = doc.ref.path;
          s.owner === this.id ? this.users.push(s) : null;
        })
      },
      complete: () => {
        this.afs.collectionGroup('schedule').get().subscribe({
          next: res => {
            res.docs.forEach(doc => {
              let s = (doc.data() as schedule);
              s.path = doc.ref.path;
              s.owner === this.id? this.schedules.push(s) : null;
              
            })
          },
          complete: () => {
            this.filter();
          }
        })
      }
    });
  }

  filter() {
    let date = new Date(this.date.split('T')[0]);
    let start = new Date(this.starttime);
    let end = new Date(this.endtime);
    this.users = this.users.filter(a => {
      let pathUser = a.path.split('/profile');
      for (let i = 0; i < this.schedules.length; i++) {
        let pathSchedul = this.schedules[i].path.split('/schedule');
        if (pathSchedul[0] === pathUser[0]) {
          let bdate = new Date(this.schedules[i].Date.split('T')[0]);
          if (bdate.getDate() == date.getDate() && bdate.getFullYear() == date.getFullYear() && bdate.getMonth() == date.getMonth()) {           
            let bstart = new Date(this.schedules[i].StartTime);
            let bend = new Date(this.schedules[i].EndTime);
            if (start.getHours() > bend.getHours()) continue;
            else if (end.getHours() < bstart.getHours()) continue;
            else if (start.getHours() == bend.getHours() && start.getMinutes() > bend.getMinutes()) continue;
            else if (end.getHours() == bstart.getHours() && end.getMinutes() < bstart.getMinutes()) continue;
            else return false;
          }
        }
      }
      return true;
    })
    this.loading.dismiss();
    console.log(this.users);

  }

  

  async select() {
    await this.showLoading();
    let x = 0;
    let m = 0;
    for (let i=0; i<this.users.length;i++) {
      if (!this.users[i].isChecked) continue;
      x++;
      let path = this.users[i].path.split('/profile');
      this.afs.doc(path[0]).collection('schedule').add({ Date: this.date, EndTime: this.endtime, StartTime: this.starttime, owner: this.id }).then(async () => {
        (await this.alertCtrl.create({
          header: "status",
          message: `Success add ${this.users[i].username}`,
          buttons: ["Okay"]
        })).present();
        m++;
        if(x === m) this.loading.dismiss();
      })
      .catch(async () => {
        (await this.alertCtrl.create({
          header: "status",
          message: `Error with ${this.users[i].username}`,
          buttons: ["Okay"]
        })).present();
        m++;
        if(x === m) this.loading.dismiss();
      })
    }
    if(x === m) this.loading.dismiss();
  }

  async showSchedule(index: number) {
    console.log(this.schedules);
    
    let sch = this.schedules.filter(a=> a.path.split('/schedule')[0] == this.users[index].path.split('/profile')[0] && a.owner == this.id);
    const modal = await this.modalCtrl.create({
      component:ViewScheduleComponent,
      componentProps:{user:[this.users[index]],sch}
    });
    modal.present();
  }

  async showSchedule1() {
    await this.showLoading();
    this.users = [];
    this.schedules = [];
    this.afs.collectionGroup('profile').get().subscribe({
      next: res => {
        res.docs.forEach(doc => {
          let s = (doc.data() as Users);
          s.isChecked = false;
          s.path = doc.ref.path;
          s.owner === this.id ? this.users.push(s) : null;
        })
      },
      complete: () => {
        this.afs.collectionGroup('schedule').get().subscribe({
          next: res => {
            res.docs.forEach(doc => {
              let s = (doc.data() as schedule);
              s.path = doc.ref.path;
              s.owner === this.id? this.schedules.push(s) : null;
            })
          },
          complete: async ()=>{
            this.loading.dismiss();
            const modal = await this.modalCtrl.create({
              component:ViewScheduleComponent,
              componentProps:{user:this.users,sch:this.schedules}
            });
            modal.present();
          }
        })
      }
    });
  }
}
