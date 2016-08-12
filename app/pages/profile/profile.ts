import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';

import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  templateUrl: 'build/pages/profile/profile.html'
})
export class ProfilePage implements OnInit {
  userDataLoaded: boolean = false;
  username: string;
  userProfile = {};
  firebaseAccount = {};

  constructor(private navCtrl: NavController,
    private authService: AuthService,
    private dataService: DataService) {

  }

  ngOnInit() {
    var self = this;

    this.getUserData().then(function (snapshot) {
      let userData: any = snapshot.val();
      self.userProfile = {
        username: userData.username,
        dateOfBirth: userData.dateOfBirth,
        totalFavorites: userData.hasOwnProperty('favorites') === true ?
          Object.keys(userData.favorites).length : 0
      };
      self.userDataLoaded = true;
    });
  }

  getUserData() {
    var self = this;

    self.firebaseAccount = self.authService.getLoggedInUser();
    return self.dataService.getUser(self.authService.getLoggedInUser().uid);
  }

  getFirebaseAccount() {
    var self = this;

    console.log(self.firebaseAccount);
  }


}