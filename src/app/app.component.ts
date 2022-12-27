import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Scheduling', url: '/scheduling', icon: 'hourglass' },
    { title: 'Items', url: '/items', icon: 'heart' },
    { title: 'Orders', url: '/orders', icon: 'archive' },
    { title: 'Reports', url: '/reports', icon: 'document' },
    { title: 'Users', url: '/users', icon: 'people' },
    { title: 'Settings', url: '/folder/Spam', icon: 'settings' },
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
  pages = [
    {
      title: 'Allorder',
      url: '/viewall',
      icon: 'recipt'
    },
    {
      title: 'Invoice',
      url: '/invoice',
      icon: 'person'
    },
    {
      title: 'List',
      url: '/filter',
      icon: 'filter'
    }
  ];
}
