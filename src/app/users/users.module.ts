import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { UsersPage } from './users.page';
import { AddUserComponent } from '../add-user/add-user.component';
import { ViewScheduleComponent } from '../view-schedule/view-schedule.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UsersPageRoutingModule
  ],
  declarations: [UsersPage,AddUserComponent],
  entryComponents: [AddUserComponent, ViewScheduleComponent]
})
export class UsersPageModule {}
