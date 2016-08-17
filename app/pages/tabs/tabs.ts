import {Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Events, Tabs } from 'ionic-angular';

import {ThreadsPage} from '../threads/threads';
import {ProfilePage} from '../profile/profile';
import {AboutPage} from '../about/about';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage implements OnInit {
    @ViewChild('forumTabs') tabRef: Tabs;

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
            if (self.newThreads === '') {
                self.newThreads = '1';
            } else {
                self.newThreads = (+self.newThreads + 1).toString();
            }
        });
    }

    setSelectedTab() {
        var self = this;
        console.log(self.tabRef.getSelected().tabTitle + ' ionChange');
    }

    clicked() {
        var self = this;
        let title = self.tabRef.getSelected().tabTitle;
        console.log(title  + ' clicked');
        if (title === 'Threads' && self.newThreads !== '') {
            self.events.publish('threads:add');
            self.newThreads = '';
        }
    }
}