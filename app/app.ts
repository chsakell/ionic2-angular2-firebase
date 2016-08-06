import {Component } from '@angular/core';
import {Platform, ionicBootstrap, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {TabsPage} from './pages/tabs/tabs';
import { APP_PROVIDERS } from './app.providers';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class ForumApp {

  private rootPage: any;

  constructor(platform: Platform) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(ForumApp, [APP_PROVIDERS]);