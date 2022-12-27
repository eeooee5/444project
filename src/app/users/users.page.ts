import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AddUserComponent } from '../add-user/add-user.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ViewScheduleComponent } from '../view-schedule/view-schedule.component';

export interface Users {
  Fname: string,
  Lname: string,
  owner: string,
  type: string,
  username: string,
  isChecked: boolean,
  path: string,
  photo: string
}

interface schedule {
  path: string,
  Date: string,
  EndTime: string,
  StartTime: string,
  owner: string
}

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: Users[] = [];
  schedules: schedule[] = [];
  id: string = "awdawd";
  loading: any;
  constructor(private afStorage: AngularFireStorage, private modalCtrl: ModalController, private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
  }

  async ngOnInit() {
    this.users=[];
    this.schedules=[];
    await this.showLoading();
    this.afs.collectionGroup('profile').get().subscribe({
      next: res => {
        res.docs.forEach(doc => {
          let s = (doc.data() as Users);
          s.path = doc.ref.path;
          s.photo = '../assets/images/profiles/defaultUserProfile.png';
          s.owner === this.id ? this.users.push(s) : null;
        })
      },
      complete: () => {
        this.checkPhoto();
      },
      error: async () => {
        this.loading.dismiss();
        (await this.alertCtrl.create({
          header: "Error",
          message: "There is some errors",
          buttons: ["okay"]
        })).present();
      }
    })
  }

  async checkPhoto() {
    let m = 0;
    let f = 0;
    for(let x of this.users){
      m++;
      this.afStorage.ref(`users/profiles/`).child(`${x.path.split('/profile')[0].split('users/')[1]}.jpg` || 'a.jpg').getDownloadURL()?.subscribe({
        next: res => {
          x.photo = res;
          f++;
          m === f ? this.loading.dismiss() : null;
        },
        error: () => {
          f++;
          m === f ? this.loading.dismiss() : null;
        },
        complete: () => {
        }
      })
    }
    m === f ? this.loading.dismiss() : null;
  }

  async AddUser() {
    const modal = await this.modalCtrl.create({
      component: AddUserComponent,
      componentProps: { id: this.id }
    });
    modal.present();
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please Wait'
    });
    this.loading.present();
  }

  async showSchedule(index: number) {
    this.schedules = [];
    this.afs.collectionGroup('schedule').get().subscribe({
      next: res => {
        res.docs.forEach(doc => {
          let s = (doc.data() as schedule);
          s.path = doc.ref.path;
          s.owner === this.id ? this.schedules.push(s) : null;

        })
      },
      complete: async () => {
        let sch = this.schedules.filter(a => a.path.split('/schedule')[0] == this.users[index].path.split('/profile')[0] && a.owner == this.id)
        const modal = await this.modalCtrl.create({
          component: ViewScheduleComponent,
          componentProps: { user: [this.users[index]], sch }
        });
        modal.present();
      }
    })
  }

  async edit(index:number){
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
      componentProps: { username:this.users[index].username, id:this.id }
    });
    modal.present();
  }

  refresh(){
    this.ngOnInit();
  }

}
