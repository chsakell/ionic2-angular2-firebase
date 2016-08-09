import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, ToastController, NavParams } from 'ionic-angular';

import { CommentCreatePage } from '../comment-create/comment-create';
import { IComment } from '../../shared/interfaces';
import { DataService } from '../../shared/services/data.service';
import { MappingsService } from '../../shared/services/mappings.service';

@Component({
    templateUrl: 'build/pages/thread-comments/thread-comments.html',
})
export class ThreadCommentsPage implements OnInit {
    threadKey: string;
    comments: IComment[];

    constructor(private actionSheeCtrl: ActionSheetController,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private navParams: NavParams,
        private dataService: DataService,
        private mappingsService: MappingsService) { }

    ngOnInit() {
        var self = this;
        self.threadKey = self.navParams.get('threadKey');
        console.log(self.threadKey);

        self.dataService.getThreadCommentsRef(self.threadKey).on('value', function (snapshot) {
            self.comments = self.mappingsService.getComments(snapshot);
            console.log(self.comments);
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

    showCommentActions() {
        let actionSheet = this.actionSheeCtrl.create({
            title: 'Actions',
            buttons: [
                {
                    text: 'Add comment',
                    icon: 'create',
                    handler: () => {

                    }
                }, {
                    text: 'Report abuse',
                    icon: 'warning',
                    role: 'destructive',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                }, {
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
}