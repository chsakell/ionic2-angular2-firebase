import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';

import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  templateUrl: 'build/pages/profile/profile.html'
})
export class ProfilePage implements OnInit {

  username: string;

  constructor(private navCtrl: NavController,
    private authService: AuthService,
    private dataService: DataService) {

  }

  ngOnInit() {
    var self = this;
    self.dataService.getUsername(self.authService.getLoggedInUser().uid)
    .then(function(snapshot) {
      self.username = snapshot.val();
      console.log(self.username);
    });
  }
}