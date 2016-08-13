import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, ToastController, NavParams } from 'ionic-angular';

import { CommentCreatePage } from '../comment-create/comment-create';
import { IComment } from '../../shared/interfaces';
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';

import { TimeAgoPipe } from 'angular2-moment';

@Component({
    templateUrl: 'build/pages/thread-comments/thread-comments.html',
    pipes: [TimeAgoPipe]
})
export class ThreadCommentsPage implements OnInit {
    threadKey: string;
    comments: IComment[];

    constructor(private actionSheeCtrl: ActionSheetController,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private navParams: NavParams,
        private authService: AuthService,
        private dataService: DataService,
        private mappingsService: MappingsService) { }

    ngOnInit() {
        var self = this;
        self.threadKey = self.navParams.get('threadKey');

        self.dataService.getThreadCommentsRef(self.threadKey).on('value', function (snapshot) {
            self.comments = self.mappingsService.getComments(snapshot);
        });
    }

    createComment() {
        let modalPage = this.modalCtrl.create(CommentCreatePage, {
            threadKey: this.threadKey
        });

        modalPage.onDidDismiss((data: any[]) => {
            if (data) {
                let toast = this.toastCtrl.create({
                    message: 'Comment created',
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
            }
        });

        modalPage.present();
    }

    vote(like: boolean, comment: IComment) {
        this.dataService.voteComment(comment.key, like, this.authService.getLoggedInUser().uid);
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
                    handler: () => {
                        console.log('Cancel clicked');
                    }
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