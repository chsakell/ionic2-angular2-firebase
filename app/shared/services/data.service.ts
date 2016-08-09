import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IThread, IComment } from '../interfaces';

declare var firebase: any;

@Injectable()
export class DataService {

    threadsRef: any = firebase.database().ref('threads');
    commentsRef: any = firebase.database().ref('comments');

    constructor() { }

    getThreadsRef() {
        return this.threadsRef;
    }

    getThreadCommentsRef(threadKey: string) {
        return this.commentsRef.orderByChild('thread').equalTo(threadKey);
    }

    loadThreads() {
        return this.threadsRef.once('value');
    }
    submitThread(thread: IThread) {
        return this.threadsRef.push(thread);
    }

    loadComments(threadKey: string) {
        return this.commentsRef.orderByChild('thread').equalTo(threadKey).once('value');
    }

    submitComment(threadKey: string, comment: IComment) {
        let commentRef = this.commentsRef.push();
        let commentkey: string = commentRef.key;
        commentRef.set(comment);

        return this.threadsRef.child(threadKey + '/comments').once('value')
            .then((snapshot) => {
                let numberOfComments = snapshot == null ? 0 : snapshot.val();
                this.threadsRef.child(threadKey + '/comments').set(numberOfComments + 1);
            });
    }
}