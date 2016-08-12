import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IThread, IComment } from '../interfaces';

declare var firebase: any;

@Injectable()
export class DataService {

    usersRef: any = firebase.database().ref('users');
    threadsRef: any = firebase.database().ref('threads');
    commentsRef: any = firebase.database().ref('comments');
    statisticsRef: any = firebase.database().ref('statistics');
    totalThreads: number;

    constructor() {
        var self = this;
        self.statisticsRef.child('threads').on('value', function (snapshot) {
            self.totalThreads = snapshot.val() == null ? 0 : snapshot.val();
        });
    }

    getTotalThreads() {
        return this.statisticsRef.child('threads').once('value');
    }

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

        var newThreadRef = this.threadsRef.push();
        var newPriority = this.totalThreads + 1;
        this.statisticsRef.child('threads').set(newPriority);
        console.log(newPriority);
        return newThreadRef.setWithPriority(thread, newPriority);
    }

    addThreadToFavorites(userKey: string, threadKey: string) {
        return this.usersRef.child(userKey + '/favorites/' + threadKey).set(true);
    }

    getFavoriteThreads(user: string) {
        return this.usersRef.child(user + '/favorites/').once('value');
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

    voteComment(commentKey: string, like: boolean, user: string) {
        let commentRef = this.commentsRef.child(commentKey + '/votes/' + user);
        commentRef.set(like);
    }

    getUsername(userUid: string) {
        return this.usersRef.child(userUid + '/username').once('value');
    }
}