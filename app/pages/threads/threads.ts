import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { IThread } from '../../shared/interfaces';
import { ThreadCreatePage } from '../thread-create/thread-create';
import { ThreadCommentsPage } from '../thread-comments/thread-comments';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';

@Component({
  templateUrl: 'build/pages/threads/threads.html'
})
export class ThreadsPage implements OnInit {
  segment = 'all';

  public threads: Array<IThread> = [];
  /*{
    key: 1,
    title: 'Which programming language do you prefer?',
    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    user: 'Chris Sakellarios',
    dateCreated: new Date(),
    comments: 20,
    category: 'programming'
  },
  {
    key: 2,
    title: 'IPhone crashes after updating Facebook app',
    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    user: 'John Smith',
    dateCreated: new Date(),
    comments: 12,
    category: 'mobile'
  }
];*/

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private dataService: DataService,
    private mappingsService: MappingsService) { }

  ngOnInit() {
    var self = this;
    this.dataService.loadThreads()
      .then(function (snapshot) {
        /*
        var list = snapshot.val();
        Object.keys(snapshot.val()).map((key) => {
          console.log(key);
          console.log(list[key]);
        });
      });*/
        self.threads = self.mappingsService.getThreads(snapshot);
        console.log(self.threads);
      });
  }

  filterThreads() {
    console.log('ok..');
  }

  createThread() {
    let modalPage = this.modalCtrl.create(ThreadCreatePage);

    modalPage.onDidDismiss((data: any[]) => {
      if (data) {
        console.log(data);
      }
    });

    modalPage.present();
  }

  viewComments(thread: any) {
    this.navCtrl.push(ThreadCommentsPage);
  }
}