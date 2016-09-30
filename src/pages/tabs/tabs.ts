import {Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Events, Tabs } from 'ionic-angular';

import {ThreadsPage} from '../threads/threads';
import {ProfilePage} from '../profile/profile';
import {AboutPage} from '../about/about';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {
    @ViewChild('forumTabs') tabRef: Tabs;

    public threadsPage: any;
    public profilePage: any;
    public aboutPage: any;

    public newThreads: string = '';
    public selectedTab: number = -1;

    constructor(public navCtrl: NavController,
        public authService: AuthService,
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
            if (self.newThreads === '') {
                self.newThreads = '1';
            } else {
                self.newThreads = (+self.newThreads + 1).toString();
            }
        });

        self.events.subscribe('threads:viewed', (threadData) => {
            self.newThreads = '';
        });
    }

    clicked() {
        var self = this;      

        if (self.newThreads !== '') {
            self.events.publish('threads:add');
            self.newThreads = '';
        }
    }
}