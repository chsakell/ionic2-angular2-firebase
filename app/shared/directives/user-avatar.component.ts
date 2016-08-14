import { Component, Input, OnInit, AfterContentInit, AfterContentChecked } from '@angular/core';

import { DataService } from '../services/data.service';

@Component({
    selector: 'forum-user-avatar',
    template: ` <img *ngIf="!imageLoaded" src="images/balls.gif" style="margin:auto">
                <img *ngIf="imageLoaded" src="{{imageUrl}}">`
})
export class UserAvatarComponent implements OnInit {
    @Input() uid: string;
    imageLoaded: boolean = false;
    imageUrl: string;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        var self = this;

        console.log(this.uid);
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
    }

    getUserImage() {
        var self = this;

        return self.dataService.getStorageRef().child('images/' + self.uid + '/profile.png').getDownloadURL();
    }
}