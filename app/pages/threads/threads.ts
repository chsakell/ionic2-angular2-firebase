import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ToastController  } from 'ionic-angular';

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
  private start: number;
  private pageSize: number = 3;

  public threads: Array<IThread> = [];

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private dataService: DataService,
    private mappingsService: MappingsService,
    private itemsService: ItemsService) { }

  ngOnInit() {
    var self = this;
    this.dataService.getTotalThreads().then(function (snapshot) {
      self.start = snapshot.val();
      console.log(self.start);
      if (self.start != null) {
        self.loadThreads();
      }
    });
    /*
    this.dataService.getThreadsRef().orderByPriority().startAt(3).endAt(5).on('value', function (snapshot) {
      self.threads = self.itemsService.reversedItems(self.mappingsService.getThreads(snapshot));
      console.log(self.threads);
    });
    */

  }

  loadThreads() {
    var self = this;
    return this.dataService.getThreadsRef().orderByPriority().startAt(self.start - self.pageSize).endAt(self.start).once('value', function (snapshot) {
      self.itemsService.reversedItems<IThread>(self.mappingsService.getThreads(snapshot)).forEach(function (thread) {
        self.threads.push(thread);
      });
      console.log(self.threads);
      self.start -= (self.pageSize + 1);
    });

  }

  filterThreads() {
    console.log('ok..');
  }

  createThread() {
    let modalPage = this.modalCtrl.create(ThreadCreatePage);

    modalPage.onDidDismiss((data: any[]) => {
      if (data) {
        let toast = this.toastCtrl.create({
          message: 'Thread created',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    });

    modalPage.present();
  }

  viewComments(thread: IThread) {
    this.navCtrl.push(ThreadCommentsPage, {
      threadKey: thread.key
    });
  }


  fetchNextThreads(infiniteScroll) {
    console.log(this.start);
    if (this.start > 0) {
      this.loadThreads().then(() => {
        infiniteScroll.complete();
      });
    } else {
      infiniteScroll.complete();
    }
  }
}