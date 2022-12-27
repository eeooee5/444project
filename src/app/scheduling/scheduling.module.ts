import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchedulingPageRoutingModule } from './scheduling-routing.module';

import { SchedulingPage } from './scheduling.page';
import { ViewScheduleComponent } from '../view-schedule/view-schedule.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulingPageRoutingModule
  ],
  declarations: [SchedulingPage],
  entryComponents: [ViewScheduleComponent]
})
export class SchedulingPageModule {}
