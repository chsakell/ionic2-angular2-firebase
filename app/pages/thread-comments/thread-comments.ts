import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';

@Component({
    templateUrl: 'build/pages/thread-comments/thread-comments.html',
})
export class ThreadCommentsPage implements OnInit {
    constructor(private actionSheeCtrl: ActionSheetController) { }

    ngOnInit() { }

    showCommentActions() {
        let actionSheet = this.actionSheeCtrl.create({
            title: 'Actions',
            buttons: [
                {
                    text: 'Add comment',
                    icon: 'create',
                    handler: () => {
                        console.log('Destructive clicked');
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