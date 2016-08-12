import {Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import {ThreadsPage} from '../threads/threads';
import {ProfilePage} from '../profile/profile';
import {SettingsPage} from '../settings/settings';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

    private threadsPage: any;
    private profilePage: any;
    private settingsPage: any;

    constructor(private navCtrl: NavController,
                private authService: AuthService) {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.threadsPage = ThreadsPage;
        this.profilePage = ProfilePage;
        this.settingsPage = SettingsPage;
    }
}