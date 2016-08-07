import { Component, OnInit } from '@angular/core';
import { Modal, NavController, ViewController, LoadingController, NavParams } from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { IComment } from '../../shared/interfaces';
import { DataService } from '../../shared/services/data.service';

@Component({
  templateUrl: 'build/pages/comment-create/comment-create.html',
  directives: [FORM_DIRECTIVES]
})
export class CommentCreatePage implements OnInit {

  createCommentForm: FormGroup;
  comment: AbstractControl;
  threadKey: string;
  loaded: boolean = false;

  constructor(private nav: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    private fb: FormBuilder,
    private dataService: DataService) {

  }

  ngOnInit() {
    console.log('in comment create..');
    this.threadKey = this.navParams.get('threadKey');
    console.log(this.threadKey);

    this.createCommentForm = this.fb.group({
      'comment': ['', Validators.compose([Validators.required, Validators.minLength(10)])]
    });

    this.comment = this.createCommentForm.controls['comment'];
    this.loaded = true;
  }

  cancelNewComment() {
    this.viewCtrl.dismiss();
  }

  onSubmit(commentForm: any): void {
    var self = this;
    if (this.createCommentForm.valid) {

      let loader = this.loadingCtrl.create({
        content: 'Posting comment...',
        dismissOnPageChange: true
      });

      let newComment: IComment = {
        text: commentForm.comment,
        thread: this.threadKey,
        user: 'chsakell',
        dateCreated: new Date().toString()
      };


      loader.present();

      this.dataService.submitComment(this.threadKey, newComment)
        .then(function (snapshot) {
          loader.dismiss()
            .then(() => {
              self.viewCtrl.dismiss({
                comment: newComment
              });
            });
        }, function (error) {
          // The Promise was rejected.
          console.error(error);
          loader.dismiss();
        });
    }
  }
}
