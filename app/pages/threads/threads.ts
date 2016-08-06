import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { ThreadCreatePage } from '../thread-create/thread-create';

@Component({
  templateUrl: 'build/pages/threads/threads.html'
})
export class ThreadsPage implements OnInit {
  segment = 'all';

  threads: Array<any> = [
    {
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
  ];

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.threads);
  }

  filterThreads() {
    console.log('ok..');
  }

  createThread() {
    let modalPage = this.modalCtrl.create(ThreadCreatePage);

    modalPage.onDidDismiss((data: any[]) => {
      console.log('dismissed..');
      if (data) {
        console.log(data);
      }
    });

    modalPage.present();
  }
}