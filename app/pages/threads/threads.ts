import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ToastController  } from 'ionic-angular';

import { UserAvatarComponent } from '../../shared/directives/user-avatar.component'; 
import { IThread } from '../../shared/interfaces';
import { ThreadCreatePage } from '../thread-create/thread-create';
import { ThreadCommentsPage } from '../thread-comments/thread-comments';
import { LoginPage } from '../login/login';
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';
import { ItemsService } from '../../shared/services/items.service';

@Component({
  templateUrl: 'build/pages/threads/threads.html',
  directives: [UserAvatarComponent]
})
export class ThreadsPage implements OnInit {
  segment: string = 'all';
  selectedSegment: string = this.segment;
  queryText: string = '';
  private start: number;
  private pageSize: number = 3;

  public threads: Array<IThread> = [];
  public favoriteThreadKeys: string[];

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private dataService: DataService,
    private mappingsService: MappingsService,
    private itemsService: ItemsService) { }

  ngOnInit() {
    var self = this;

    if (self.authService.getLoggedInUser() === null) {
      //
    } else {
      self.loadThreads(true);
    }

  }

  loadThreads(fromStart: boolean) {
    var self = this;

    if (fromStart) {
      self.threads = [];

      if (self.segment === 'all') {
        return this.dataService.getTotalThreads().then(function (snapshot) {
          self.start = snapshot.val();
          self.getThreads();
        });
      } else {
        self.start = 0;
        self.favoriteThreadKeys = [];
        return self.dataService.getFavoriteThreads(self.authService.getLoggedInUser().uid).then(function (dataSnapshot) {
          let favoriteThreads = dataSnapshot.val();
          self.itemsService.getKeys(favoriteThreads).forEach(function (threadKey) {
            self.start++;
            self.favoriteThreadKeys.push(threadKey);
          });
          return self.getThreads();
        });
      }
    } else {
      return self.getThreads();
    }
  }

  getThreads() {
    var self = this;

    if (self.segment === 'all') {
      return this.dataService.getThreadsRef().orderByPriority().startAt(self.start - self.pageSize).endAt(self.start).once('value', function (snapshot) {
        self.itemsService.reversedItems<IThread>(self.mappingsService.getThreads(snapshot)).forEach(function (thread) {
          self.threads.push(thread);
        });
        self.start -= (self.pageSize + 1);
      });
    } else {
      self.favoriteThreadKeys.forEach(key => {
        this.dataService.getThreadsRef().child(key).once('value')
          .then(function (dataSnapshot) {
            self.threads.unshift(self.mappingsService.getThread(dataSnapshot.val(), key));
          });
      });
      self.start -= (self.pageSize + 1);
    }
  }

  filterThreads(segment) {
    if (this.selectedSegment !== this.segment) {
      this.selectedSegment = this.segment;
      console.log(this.segment);
      // Initialize
      this.loadThreads(true);
    }
  }

  searchThreads() {
    var self = this;
    console.log('searching..');
    if (self.queryText.trim().length !== 0) {
      console.log(self.queryText.length);
      // empty current threads
      self.threads = [];
      self.dataService.loadThreads().then(function (snapshot) {
        console.log(snapshot.val());
        self.itemsService.reversedItems<IThread>(self.mappingsService.getThreads(snapshot)).forEach(function (thread) {
          if (thread.title.toLowerCase().includes(self.queryText.toLowerCase()))
            self.threads.push(thread);
        });
      });
    } else { // text cleared..
      this.loadThreads(true);
    }
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
        this.loadThreads(true);
      }
    });

    modalPage.present();
  }

  viewComments(thread: IThread) {
    this.navCtrl.push(ThreadCommentsPage, {
      threadKey: thread.key
    });
  }

  reloadThreads(refresher) {
    this.queryText = '';
    this.loadThreads(true).then(() => {
      refresher.complete();
    });
  }

  fetchNextThreads(infiniteScroll) {
    console.log(this.start);
    if (this.start > 0) {
      this.loadThreads(false).then(() => {
        infiniteScroll.complete();
      });
    } else {
      infiniteScroll.complete();
    }
  }
}