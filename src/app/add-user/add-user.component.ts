import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Users } from '../users/users.page';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  RegisterForm: FormGroup;
  loading:any;
  @Input() id: string="";
  usernameU: boolean = false;
  constructor(private modalCtrl: ModalController, public formbuilder: FormBuilder, private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private alertCtrl: AlertController, private loadingCtrl:LoadingController) {
    this.RegisterForm = formbuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/), Validators.minLength(4), Validators.maxLength(15)])],
      password: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~])/), Validators.minLength(6), Validators.maxLength(20)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)])],
      Fname: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z]*$/), Validators.minLength(3), Validators.maxLength(15)])],
      Lname: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z]*$/), Validators.minLength(3), Validators.maxLength(15)])],
      type: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {    
  }

  Register(val: any) {
    this.usernameU = false;
    if (this.RegisterForm.valid) {
      this.showLoading();
      this.afs.collectionGroup('profile').get().subscribe({
        next: res => {
          res.docs.forEach(doc => {
            let s = (doc.data() as Users);
            s.username.toLocaleLowerCase() === val.username.toLocaleLowerCase() && s.owner === this.id? this.usernameU = true : null;
          })
        },
        complete: async () => {
          if(this.usernameU){
            (await this.alertCtrl.create({
              header:"ERROR",
              message:"Username should be unique",
              buttons:["okay"]
            })).present();
            this.loading.dismiss();
          }
          else{
            this.addUser({ newEmail: val.email, newPassword: val.password }).then(async res => {
              await (await this.afAuth?.currentUser)?.updateProfile({ displayName: `${val.Fname} ${val.Lname}` });
              localStorage.setItem("user", (await this.afAuth.currentUser)?.uid || "-1");
              this.afs.doc(`users/${res.user.uid}`).collection('profile').add({ username: val.username, type: val.type, Fname: val.Fname, Lname: val.Lname, owner: this.id }).then(async () => {
                (await this.alertCtrl.create({
                  header:"Added",
                  message:"User has been added",
                  buttons:["okay"]
                })).present();
                this.loading.dismiss();
              })
      
            })
            .catch(async err => {
              console.log(err);
              
              this.loading.dismiss();
              (await this.alertCtrl.create({
                header:"Incorrect Information",
                message:"There is error in your information",
                buttons:["Okay"]
              })).present();
            })
          }
        }
      });
    }
  }

  addUser(user: { newEmail: string, newPassword: string }): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(user.newEmail, user.newPassword);
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
     message: 'Please Wait'
   });
   this.loading.present();
 }

 close(){
  this.modalCtrl.dismiss();
 }

}
