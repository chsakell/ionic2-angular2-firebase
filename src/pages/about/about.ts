import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

@Component({
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(private navCtrl: NavController) {
  }

  openUrl(url) {
    let browser = new InAppBrowser(url, '_blank', 'location=yes');
  }
}