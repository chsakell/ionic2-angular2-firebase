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
import { SqliteService } from '../../shared/services/sqlite.service';

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
  private connected: boolean = true;

  public threads: Array<IThread> = [];
  public newThreads: Array<IThread> = [];
  public favoriteThreadKeys: string[];

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private dataService: DataService,
    private sqliteService: SqliteService,
    private mappingsService: MappingsService,
    private itemsService: ItemsService,
    private events: Events) { }

  ngOnInit() {
    var self = this;
    self.segment = 'all';
    self.events.subscribe('network:connected', self.networkConnected);

    setTimeout(function () {
      var connectedRef = self.dataService.getConnectionRef();
      connectedRef.on('value', function (snap) {
        console.log(snap.val());
        if (snap.val() === true) {
          // OK We are connected..
          console.log('ok we are connected');
          if (self.authService.getLoggedInUser() === null) {
            //
          } else {
            self.loadThreads(true).then(() => {
              self.loading = false;
            });
          }

          self.dataService.getStatisticsRef().on('child_changed', self.onThreadAdded);
          self.events.subscribe('threads:add', self.addNewThreads);
        } else {
          console.log('No we are not');
          self.connected = false;
          self.dataService.goOffline();
          // todo load from SQLite
          if (self.threads.length === 0)
            self.loadSqliteThreads();
        }
      });
    }, 3000);
  }

  loadSqliteThreads() {
    let self = this;

    if (self.threads.length > 0)
      return;

    self.threads = [];
    console.log('Loading from db..');
    self.sqliteService.getThreads().then((data) => {
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let thread: IThread = {
            key: data.rows.item(i).key,
            title: data.rows.item(i).title,
            question: data.rows.item(i).question,
            category: data.rows.item(i).category,
            dateCreated: data.rows.item(i).datecreated,
            user: { uid: data.rows.item(i).user, username: data.rows.item(i).username },
            comments: data.rows.item(i).comments
          };

          self.threads.push(thread);
          console.log('Thread added from db:' + thread.key);
          console.log(thread);
        }
        self.loading = false;
      }
    }, (error) => {
      console.log('Error: ' + JSON.stringify(error));
      self.loading = true;
    });
  }

  public networkConnected = (connection) => {
    var self = this;
    self.connected = connection[0];
    console.log(connection);

    if (self.connected) {
      self.loadThreads(true).then(() => {
        self.loading = false;
      });

    } else {
      self.notify('Connection lost. Working offline..');
      // save current threads..
      self.sqliteService.resetDatabase();
      setTimeout(function () {
        console.log(self.threads.length);
        self.sqliteService.saveThreads(self.threads);
        self.loadSqliteThreads();
      }, 2000);
    }
  }

  // Notice function declarion to keep the right this reference
  public onThreadAdded = (childSnapshot, prevChildKey) => {
    let priority = childSnapshot.val(); // priority..
    var self = this;
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
    self.newThreads.forEach(function (thread: IThread) {
      self.threads.unshift(thread);
    });

    self.newThreads = [];
    self.scrollToTop();
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
    if (this.selectedSegment !== this.segment) {
      this.selectedSegment = this.segment;
      if (this.selectedSegment === 'favorites')
        this.queryText = '';
      if (this.connected)
        // Initialize
        this.loadThreads(true);
    } else {
      this.scrollToTop();
    }
  }

  searchThreads() {
    var self = this;
    if (self.queryText.trim().length !== 0) {
      self.segment = 'all';
      // empty current threads
      self.threads = [];
      self.dataService.loadThreads().then(function (snapshot) {
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

    modalPage.onDidDismiss((data: any) => {
      if (data) {
        let toast = this.toastCtrl.create({
          message: 'Thread created',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();

        if (data.priority === 1)
          self.newThreads.push(data.thread);

        self.addNewThreads();
      }
    });

    modalPage.present();
  }

  viewComments(key: string) {
    if (this.connected) {
      this.navCtrl.push(ThreadCommentsPage, {
        threadKey: key
      });
    } else {
      this.notify('Network not found..');
    }
  }

  reloadThreads(refresher) {
    this.queryText = '';
    if (this.connected) {
      this.loadThreads(true).then(() => {
        refresher.complete();
      });
    } else {
      // TODO SQLitie
      refresher.complete();
    }
  }

  fetchNextThreads(infiniteScroll) {
    if (this.start > 0 && this.connected) {
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

  notify(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}