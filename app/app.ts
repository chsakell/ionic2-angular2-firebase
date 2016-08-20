import {Component, ViewChild, OnInit } from '@angular/core';
import {Platform, ionicBootstrap, Nav, MenuController, ViewController, Events } from 'ionic-angular';
import { Network, Splashscreen, StatusBar } from 'ionic-native';
import { Subscription } from '../node_modules/rxjs/Subscription';

import { AuthService } from './shared/services/auth.service';
import { DataService } from './shared/services/data.service';
import { SqliteService } from './shared/services/sqlite.service';
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

  connectSubscription: Subscription;

  constructor(platform: Platform,
    private dataService: DataService,
    private authService: AuthService,
    private sqliteService: SqliteService,
    private menu: MenuController,
    private events: Events) {
    var self = this;
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      self.watchForConnection();
      self.watchForDisconnect();
      Splashscreen.hide();
      self.sqliteService.InitDatabase();
      setTimeout(function () {
         // self.sqliteService.resetDatabase();
      }, 2000);
    });
  }

  watchForConnection() {
    var self = this;
    let connectSubscription = Network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type.  Might need to wait
      // prior to doing any api requests as well.
      setTimeout(() => {
        console.log(Network.connection);
        if (Network.connection === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
          self.dataService.goOnline();
          self.events.publish('network:connected', true);
        }
      }, 3000);
    });
  }

  watchForDisconnect() {
    var self = this;
    // watch network for a disconnect
    let disconnectSubscription = Network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      self.dataService.goOffline();
      self.events.publish('network:connected', false);
    });
  }

  hideSplashScreen() {
    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
  }

  ngOnInit() {
    var self = this;

    this.authService.onAuthStateChanged(function (user) {
      if (user === null) {
        self.menu.close();
        self.nav.setRoot(LoginPage);
      }
    });
  }

  openPage(page) {
    let viewCtrl: ViewController = this.nav.getActive();
    // console.log(viewCtrl);
    // close the menu when clicking a link from the menu
    this.menu.close();

    if (page === 'login') {
      if (!(viewCtrl.instance instanceof LoginPage))
        this.nav.pop();
    } else if (page === 'signup') {
      if (!(viewCtrl.instance instanceof SignupPage))
        this.nav.push(SignupPage);
    }
  }

  signout() {
    var self = this;
    self.menu.close();
    self.authService.signOut();
  }

  isUserLoggedIn(): boolean {
    let user = this.authService.getLoggedInUser();
    return user !== null;
  }
}

ionicBootstrap(ForumApp, [APP_PROVIDERS]);