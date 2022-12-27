import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera/dist/esm/index';
import { Filesystem } from '@capacitor/filesystem/dist/esm/index';

interface Users {
  Fname: string,
  Lname: string,
  owner: string,
  type: string,
  username: string,
  path: string,
  phone: string
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  @Input() username: string = "";
  @Input() id: string = "";
  images: any[] = [];
  UserID: string | undefined | null;
  ProfileForm: FormGroup;
  loading: any;
  photo = '../assets/images/profiles/defaultUserProfile.png';
  ID: string = "";
  currentUser = {} as Users;
  password: string = "";
  constructor(private modalCtrl:ModalController, private afStorage: AngularFireStorage, private platform: Platform, private modalController: ModalController, private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, public formbuilder: FormBuilder, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.ProfileForm = formbuilder.group({
      Fname: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z]*$/), Validators.minLength(3), Validators.maxLength(15)])],
      Lname: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z]*$/), Validators.minLength(3), Validators.maxLength(15)])],
      mobile: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{8}$/)])]
    });
  }

  ngOnInit() {
    this.getInformation();
  }


  async checkPhoto() {
    this.afStorage.ref(`users/profiles/`).child(`${this.currentUser.path.split('/profile')[0].split('users/')[1]}.jpg` || 'a.jpg').getDownloadURL()?.subscribe({
      next: res => {
        this.photo = res;
        this.loading.dismiss();
      },
      error: () => {
        this.loading.dismiss();
      },
      complete: () => {
        this.loading.dismiss();
      }
    })
  }

  async getInformation() {
    this.afs.collectionGroup('profile').get().subscribe({
      next: res => {
        res.docs.forEach(doc => {
          let s = (doc.data() as Users);
          s.path = doc.ref.path;
          s.username === this.username && s.owner === this.id ? this.currentUser = s : null;
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

  async Update(val: any) {
    if (this.ProfileForm.valid) {
      await this.showLoading();
      this.afs.doc(`${this.currentUser.path}`).update({
        Fname: val.Fname,
        Lname: val.Lname,
        owner: this.currentUser.owner,
        type: this.currentUser.type,
        username: this.currentUser.username,
        phone: val.mobile
      }).then(async () => {
        this.alertCtrl.create({
          header: "UPDATE",
          message: "Your information updated",
          buttons: ["Okay"]
        }).then(async res => {
          await res.present();
          this.loading.dismiss();
        })
      }).catch(async () => {
        this.alertCtrl.create({
          header: "ERROR",
          message: "There is some error",
          buttons: ["Okay"]
        }).then(async res => {
          await res.present();
          this.loading.dismiss();
        })
      })
    }
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please Wait'
    });
    this.loading.present();
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    if (image) {
      this.showLoading();
      const base64Data = await this.readAsBase64(image);
      const storageRef = this.afStorage.ref('users/profiles');
      storageRef.child(`${this.currentUser.path.split('/profile')[0].split('users/')[1]}.jpg` || 'a.jpg').putString(base64Data.split('base64,')[1], 'base64', { contentType: 'image/jpeg' }).then(res => {
        this.loading.dismiss();
        this.checkPhoto();
      }).catch(async err => {
        this.loading.dismiss();
        (await this.alertCtrl.create({
          header: "Error",
          message: "There is error in your photo",
          buttons: ["Okay"]
        })).present();
      })
    }
  }

  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path || ''
      });

      return file.data;
    }
    else {
      const response = await fetch(photo.webPath || '');
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob);
  })
  close(){
    this.modalCtrl.dismiss();
   }
}

