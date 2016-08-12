import {Component, ViewChild, OnInit } from '@angular/core';
import {Platform, ionicBootstrap, Nav, MenuController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import { AuthService } from './shared/services/auth.service';

import {TabsPage} from './pages/tabs/tabs';
import { LoginPage } from './pages/login/login';
import { SignupPage } from './pages/signup/signup';
import { APP_PROVIDERS } from './app.providers';

@Component({
  templateUrl: 'build/app.html'
})
export class ForumApp implements OnInit {
  @ViewChild('content') nav: Nav;

  private rootPage: any;
  private loginPage: LoginPage;

  constructor(platform: Platform,
    private authService: AuthService,
    private menu: MenuController) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  ngOnInit() {
    var self = this;

    this.authService.onAuthStateChanged(function (user) {
      if (user === null) {
        self.menu.close();
        self.nav.push(LoginPage);
      } else {

      }
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();

    if (page === 'login') {
      this.nav.push(LoginPage);
    } else if (page === 'signup')
      this.nav.push(SignupPage);
  }

  signout() {
    var self = this;
    self.menu.close();
    self.authService.signOut();
    /*
    self.authService.signOut().then(() => {
      self.menu.close();
      self.nav.push(LoginPage);
    });
    */
  }

  isUserLoggedIn(): boolean {
    let user = this.authService.getLoggedInUser();
    return user !== null;
  }
}

ionicBootstrap(ForumApp, [APP_PROVIDERS]);