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
  userStatistics: any = {};

  constructor(private navCtrl: NavController,
    private authService: AuthService,
    private dataService: DataService) {

  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
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

    self.getUserThreads();
    self.getUserComments();
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

  getUserThreads() {
    var self = this;

    self.dataService.getUserThreads(self.authService.getLoggedInUser().uid)
      .then(function (snapshot) {
        let userThreads: any = snapshot.val();
        if (userThreads !== null) {
          self.userStatistics.totalThreads = Object.keys(userThreads).length;
        } else {
          self.userStatistics.totalThread = 0;
        }
      });
  }

  getUserComments() {
    var self = this;

    self.dataService.getUserComments(self.authService.getLoggedInUser().uid)
      .then(function (snapshot) {
        let userComments: any = snapshot.val();
        if (userComments !== null) {
          self.userStatistics.totalComments = Object.keys(userComments).length;
        } else {
          self.userStatistics.totalComments = 0;
        }
      });
  }

  reload() {
    this.loadUserProfile();
  }
}