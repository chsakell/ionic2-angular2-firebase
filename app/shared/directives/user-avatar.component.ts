import { Component, Input, OnInit } from '@angular/core';

import { DataService } from '../services/data.service';

@Component({
    selector: 'forum-user-avatar',
    template: ` <img *ngIf="imageLoaded" src="{{imageUrl}}">`
})
export class UserAvatarComponent implements OnInit {
    @Input() uid: string;
    imageLoaded: boolean = false;
    imageUrl: string;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        var self = this;

        let defaultUrl = self.dataService.getDefaultImageUrl();
        this.imageUrl = defaultUrl.replace('default', self.uid);
        self.imageLoaded = true;
        /*
        self.dataService.getUsersRef().child(this.uid + '/image').once('value').then(function (snapshot) {
            if (snapshot.val() === null) {
                self.imageUrl = 'images/avatar.png';
                self.imageLoaded = true;
            } else {
                self.getUserImage().then(function (url) {
                    self.imageUrl = url;
                    self.imageLoaded = true;
                }).catch(function (error) {
                    console.log(error.code);
                    self.imageUrl = 'images/avatar.png';
                    self.imageLoaded = true;
                });
            }
        });
        */
    }

    getUserImage() {
        var self = this;

        return self.dataService.getStorageRef().child('images/' + self.uid + '/profile.png').getDownloadURL();
    }
}