import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController, ToastController, LoadingController, NavParams, Content } from 'ionic-angular';

import { UserAvatarComponent } from '../../shared/directives/user-avatar.component';
import { CommentCreatePage } from '../comment-create/comment-create';
import { IComment } from '../../shared/interfaces';
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { ItemsService } from '../../shared/services/items.service';
import { MappingsService } from '../../shared/services/mappings.service';

import { TimeAgoPipe } from 'angular2-moment';

@Component({
    templateUrl: 'build/pages/thread-comments/thread-comments.html',
    pipes: [TimeAgoPipe],
    directives: [UserAvatarComponent]
})
export class ThreadCommentsPage implements OnInit {
    @ViewChild(Content) content: Content;
    threadKey: string;
    commentsLoaded: boolean = false;
    comments: IComment[];

    constructor(private actionSheeCtrl: ActionSheetController,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private navParams: NavParams,
        private authService: AuthService,
        private itemsService: ItemsService,
        private dataService: DataService,
        private mappingsService: MappingsService) { }

    ngOnInit() {
        var self = this;
        self.threadKey = self.navParams.get('threadKey');
        self.commentsLoaded = false;

        self.dataService.getThreadCommentsRef(self.threadKey).once('value', function (snapshot) {
            self.comments = self.mappingsService.getComments(snapshot);
            self.commentsLoaded = true;
        }, function (error) {});
    }

    createComment() {
        let self = this;

        let modalPage = this.modalCtrl.create(CommentCreatePage, {
            threadKey: this.threadKey
        });

        modalPage.onDidDismiss((commentData: any) => {
            if (commentData) {
                let commentVals = commentData.comment;
                let commentUser = commentData.user;

                let createdComment: IComment = {
                    key: commentVals.key,
                    thread: commentVals.thread,
                    text: commentVals.text,
                    user: commentUser,
                    dateCreated: commentVals.dateCreated,
                    votesUp: null,
                    votesDown: null
                };

                self.comments.push(createdComment);
                self.scrollToBottom();

                let toast = this.toastCtrl.create({
                    message: 'Comment created',
                    duration: 2000,
                    position: 'top'
                });
                toast.present();
            }
        });

        modalPage.present();
    }

    scrollToBottom() {
        this.content.scrollToBottom();
    }

    vote(like: boolean, comment: IComment) {
        var self = this;

        self.dataService.voteComment(comment.key, like, self.authService.getLoggedInUser().uid).then(function () {
            self.dataService.getCommentsRef().child(comment.key).once('value').then(function (snapshot) {
                comment = self.mappingsService.getComment(snapshot, comment.key);
                self.itemsService.setItem<IComment>(self.comments, c => c.key === comment.key, comment);
            });
        });
    }

    showCommentActions() {
        var self = this;
        let actionSheet = self.actionSheeCtrl.create({
            title: 'Thread Actions',
            buttons: [
                {
                    text: 'Add to favorites',
                    icon: 'heart',
                    handler: () => {
                        self.addThreadToFavorites();
                    }
                },
                {
                    text: 'Cancel',
                    icon: 'close-circle',
                    role: 'cancel',
                    handler: () => { }
                }
            ]
        });

        actionSheet.present();
    }

    addThreadToFavorites() {
        var self = this;
        let currentUser = self.authService.getLoggedInUser();
        if (currentUser != null) {
            self.dataService.addThreadToFavorites(currentUser.uid, self.threadKey)
                .then(function () {
                    let toast = self.toastCtrl.create({
                        message: 'Added to favorites',
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present();
                });
        } else {
            let toast = self.toastCtrl.create({
                message: 'This action is available only for authenticated users',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }
    }
}