import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, ToastController, Content, Events } from 'ionic-angular';

import { ThreadComponent } from '../../shared/directives/thread.component';
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
  directives: [UserAvatarComponent, ThreadComponent]
})
export class ThreadsPage implements OnInit {
  @ViewChild(Content) content: Content;
  segment: string = 'all';
  selectedSegment: string = this.segment;
  queryText: string = '';
  private start: number;
  private pageSize: number = 3;
  private loading: boolean = true;

  public threads: Array<IThread> = [];
  public newThreads: Array<IThread> = [];
  public favoriteThreadKeys: string[];

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private dataService: DataService,
    private mappingsService: MappingsService,
    private itemsService: ItemsService,
    private events: Events) { }

  ngOnInit() {
    var self = this;
    self.segment = 'all';
    if (self.authService.getLoggedInUser() === null) {
      //
    } else {
      self.loadThreads(true).then(() => {
        self.loading = false;
      });
    }

    self.dataService.getStatisticsRef().on('child_changed', self.onThreadAdded);
    self.events.subscribe('threads:add', self.addNewThreads);
  }

  // Notice function declarion to keep the right this reference
  public onThreadAdded = (childSnapshot, prevChildKey) => {
    let priority = childSnapshot.val(); // priority..
    var self = this;
    console.log(priority);
    self.events.publish('thread:created');
    // fetch new thread..
    self.dataService.getThreadsRef().orderByPriority().equalTo(priority).once('value').then(function (dataSnapshot) {
      let key = Object.keys(dataSnapshot.val())[0];
      let newThread: IThread = self.mappingsService.getThread(dataSnapshot.val()[key], key);
      self.newThreads.push(newThread);
    });
  }

  public addNewThreads = () => {
    var self = this;
    console.log(self.newThreads);
    self.newThreads.forEach(function (thread: IThread) {
      self.threads.unshift(thread);
    });

    self.newThreads = [];
    self.scrollToTop();
    console.log(self.newThreads.length);
    self.events.publish('threads:viewed');
  }

  loadThreads(fromStart: boolean) {
    var self = this;

    if (fromStart) {
      self.loading = true;
      self.threads = [];
      self.newThreads = [];

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
    let startFrom: number = self.start - self.pageSize;
    if (startFrom < 0)
      startFrom = 0;
    if (self.segment === 'all') {
      return this.dataService.getThreadsRef().orderByPriority().startAt(startFrom).endAt(self.start).once('value', function (snapshot) {
        self.itemsService.reversedItems<IThread>(self.mappingsService.getThreads(snapshot)).forEach(function (thread) {
          self.threads.push(thread);
        });
        self.start -= (self.pageSize + 1);
        self.loading = false;
      });
    } else {
      self.favoriteThreadKeys.forEach(key => {
        this.dataService.getThreadsRef().child(key).once('value')
          .then(function (dataSnapshot) {
            self.threads.unshift(self.mappingsService.getThread(dataSnapshot.val(), key));
          });
      });
    }
    self.events.publish('threads:viewed');
    self.loading = false;
  }

  filterThreads(segment) {
    console.log(segment);
    if (this.selectedSegment !== this.segment) {
      this.selectedSegment = this.segment;
      if (this.selectedSegment === 'favorites')
        this.queryText = '';
      console.log(this.segment);
      // Initialize
      this.loadThreads(true);
    } else {
      this.scrollToTop();
    }
  }

  searchThreads() {
    var self = this;
    console.log('searching..');
    if (self.queryText.trim().length !== 0) {
      self.segment = 'all';
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
    var self = this;
    let modalPage = this.modalCtrl.create(ThreadCreatePage);

    modalPage.onDidDismiss((data: any[]) => {
      if (data) {
        let toast = this.toastCtrl.create({
          message: 'Thread created',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        //this.loadThreads(true);
        self.addNewThreads();
      }
    });

    modalPage.present();
  }

  /*
  viewComments(thread: IThread) {
    this.navCtrl.push(ThreadCommentsPage, {
      threadKey: thread.key
    });
  }
  */

  viewComments(key: string) {
    this.navCtrl.push(ThreadCommentsPage, {
      threadKey: key
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

  scrollToTop() {
    this.content.scrollToTop();
  }
}