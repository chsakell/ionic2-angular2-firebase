import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import { IThread } from '../interfaces';
import { UserAvatarComponent } from '../../shared/directives/user-avatar.component';
import { DataService } from '../services/data.service';

@Component({
    selector: 'forum-thread',
    templateUrl: 'build/shared/directives/thread.component.html',
    directives: [UserAvatarComponent]
})
export class ThreadComponent implements OnInit {
    @Input() thread: IThread;
    @Output() onViewComments = new EventEmitter<string>();

    constructor(private dataService: DataService) { }

    ngOnInit() {
        var self = this;
        this.dataService.getThreadsRef().child(self.thread.key).on('child_changed',
            function (childSnapshot, prevChildKey) {
                // Attention: only number of comments is supposed to changed.
                // Otherwise you should run some checks..
                self.thread.comments = childSnapshot.val();
            });
    }

    viewComments(key: string) {
        this.onViewComments.emit(key);
    }

}