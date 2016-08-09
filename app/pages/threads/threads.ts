import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { IThread } from '../../shared/interfaces';
import { ThreadCreatePage } from '../thread-create/thread-create';
import { ThreadCommentsPage } from '../thread-comments/thread-comments';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';
import { ItemsService } from '../../shared/services/items.service';

@Component({
  templateUrl: 'build/pages/threads/threads.html'
})
export class ThreadsPage implements OnInit {
  segment = 'all';

  public threads: Array<IThread> = [];

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private dataService: DataService,
    private mappingsService: MappingsService,
    private itemsService: ItemsService) { }

  ngOnInit() {
    var self = this;
    /*
    this.dataService.loadThreads()
      .then(function (snapshot) {
        self.threads = self.mappingsService.getThreads(snapshot);
        console.log(self.threads);
      });
      */
    this.dataService.getThreadsRef().orderByKey().on('value', function (snapshot) {
      self.threads = self.itemsService.reversedItems(self.mappingsService.getThreads(snapshot));
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

  viewComments(thread: IThread) {
    this.navCtrl.push(ThreadCommentsPage, {
      threadKey: thread.key
    });
  }
}