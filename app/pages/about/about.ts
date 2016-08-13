import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/about/about.html'
})
export class AboutPage {
  constructor(private navCtrl: NavController) {

  }

  openUrl(url) {
    InAppBrowser.open(url, '_blank', 'location=yes');
  }
}