import {Component} from '@angular/core';
import {ThreadsPage} from '../threads/threads';
import {ProfilePage} from '../profile/profile';
import {SettingsPage} from '../settings/settings';

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

    private threadsPage: any;
    private profilePage: any;
    private settingsPage: any;

    constructor() {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.threadsPage = ThreadsPage;
        this.profilePage = ProfilePage;
        this.settingsPage = SettingsPage;
    }
}