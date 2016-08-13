import { Component, OnInit } from '@angular/core';
import { Modal, NavController, ViewController, LoadingController } from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { IThread } from '../../shared/interfaces';
import { AuthService } from  '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  templateUrl: 'build/pages/thread-create/thread-create.html',
  directives: [FORM_DIRECTIVES]
})
export class ThreadCreatePage implements OnInit {

  createThreadForm: FormGroup;
  title: AbstractControl;
  question: AbstractControl;
  category: AbstractControl;

  constructor(private nav: NavController,
    private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService) { }

  ngOnInit() {
    console.log('in thread create..');
    this.createThreadForm = this.fb.group({
      'title': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'question': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'category': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });

    this.title = this.createThreadForm.controls['title'];
    this.question = this.createThreadForm.controls['question'];
    this.category = this.createThreadForm.controls['category'];
  }

  cancelNewThread() {
    this.viewCtrl.dismiss();
  }

  onSubmit(thread: any): void {
    var self = this;
    if (this.createThreadForm.valid) {

      let loader = this.loadingCtrl.create({
        content: 'Posting thread...',
        dismissOnPageChange: true
      });

      loader.present();

      let uid = self.authService.getLoggedInUser().uid;
      self.dataService.getUsername(uid).then(function (snapshot) {
        let username = snapshot.val();

        self.dataService.getTotalThreads().then(function (snapshot) {
          let currentNumber = snapshot.val();
          let newPriority: number = currentNumber === null ? 0 : (currentNumber + 1);

          let newThread: IThread = {
            key: null,
            title: thread.title,
            question: thread.question,
            category: thread.category,
            user: { uid: uid, username: username },
            dateCreated: new Date().toString(),
            comments: null
          };

          self.dataService.submitThread(newThread, newPriority)
            .then(function (snapshot) {
              loader.dismiss()
                .then(() => {
                  self.viewCtrl.dismiss({
                    thread: newThread
                  });
                });
            }, function (error) {
              // The Promise was rejected.
              console.error(error);
              loader.dismiss();
            });
        });
      });







    }
  }

}
