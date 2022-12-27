import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ViewScheduleComponent } from './view-schedule/view-schedule.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { IonicStorageModule } from '@ionic/storage-angular';

const firebaseConfig = {
  apiKey: "AIzaSyCwM0vlQI2SKwmSI6SNtlan9fv72bRJ9GE",
  authDomain: "akaa-444.firebaseapp.com",
  projectId: "akaa-444",
  storageBucket: "akaa-444.appspot.com",
  messagingSenderId: "196171789559",
  appId: "1:196171789559:web:5c7e007520c89cacf34ff2",
  measurementId: "G-NQTMEG77BS"
};
var  firebaseConfig2 = {
  apiKey: "AIzaSyBTZFuTU-aUTBfuotKaJeybNKPihLd5Uuo",
  authDomain: "project-2c8d8.firebaseapp.com",
  projectId: "project-2c8d8",
  storageBucket: "project-2c8d8.appspot.com",
  messagingSenderId: "596900348723",
  appId: "1:596900348723:web:57897122f6ae2bfb737446"
};

@NgModule({
  declarations: [AppComponent, ViewScheduleComponent, EditProfileComponent],
  imports: [BrowserModule, FormsModule, IonicModule.forRoot(),provideFirebaseApp(()=>initializeApp(firebaseConfig2)),IonicStorageModule.forRoot(), provideFirestore(()=>getFirestore()), ReactiveFormsModule, AngularFireModule.initializeApp(firebaseConfig), AngularFirestoreModule, AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  entryComponents: [ViewScheduleComponent, EditProfileComponent]
})
export class AppModule {}
