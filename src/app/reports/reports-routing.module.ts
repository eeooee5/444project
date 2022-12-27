import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsPage } from './reports.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsPage
    
  },
  {
    path: 'tab1',
    loadChildren: () => import('../viewall/viewall.module').then(m => m.ViewallPageModule)
  },
  {
    path: 'tab2',
    loadChildren: () => import('../invoice/invoice.module').then(m => m.InvoicePageModule)
  },
  {
    path: 'tab3',
    loadChildren: () => import('../filter/filter.module').then(m => m.FilterPageModule)
  },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsPageRoutingModule {}
