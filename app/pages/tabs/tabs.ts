import {Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import {ThreadsPage} from '../threads/threads';
import {ProfilePage} from '../profile/profile';
import {AboutPage} from '../about/about';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage implements OnInit {

    private threadsPage: any;
    private profilePage: any;
    private aboutPage: any;

    private newThreads: string = '';

    constructor(private navCtrl: NavController,
        private authService: AuthService,
        public events: Events) {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.threadsPage = ThreadsPage;
        this.profilePage = ProfilePage;
        this.aboutPage = AboutPage;
    }

    ngOnInit() {
        this.startListening();
    }

    startListening() {
        var self = this;

        self.events.subscribe('thread:created', (threadData) => {
            if (self.newThreads === '')
                self.newThreads = '1';
            else {
                self.newThreads = (+self.newThreads + 1).toString();
            }
        });

        self.events.subscribe('threads:viewed', (threadData) => {
            self.newThreads = '';
        });
    }

}