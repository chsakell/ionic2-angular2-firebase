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
    storageRef: any = firebase.storage();

    constructor() { }

    getTotalThreads() {
        return this.statisticsRef.child('threads').once('value');
    }

    getThreadsRef() {
        return this.threadsRef;
    }

    getCommentsRef() {
        return this.commentsRef;
    }

    getUsersRef() {
        return this.usersRef;
    }

    getStorageRef() {
        return this.storageRef.ref();
    }

    getThreadCommentsRef(threadKey: string) {
        return this.commentsRef.orderByChild('thread').equalTo(threadKey);
    }

    loadThreads() {
        return this.threadsRef.once('value');
    }

    submitThread(thread: IThread, priority: number) {

        var newThreadRef = this.threadsRef.push();
        this.statisticsRef.child('threads').set(priority);
        console.log(priority);
        return newThreadRef.setWithPriority(thread, priority);
    }

    addThreadToFavorites(userKey: string, threadKey: string) {
        return this.usersRef.child(userKey + '/favorites/' + threadKey).set(true);
    }

    getFavoriteThreads(user: string) {
        return this.usersRef.child(user + '/favorites/').once('value');
    }

    setUserImage(uid: string) {
        this.usersRef.child(uid).update({
            image: true
        });
    }

    loadComments(threadKey: string) {
        return this.commentsRef.orderByChild('thread').equalTo(threadKey).once('value');
    }

    submitComment(threadKey: string, comment: IComment) {
        // let commentRef = this.commentsRef.push();
        // let commentkey: string = commentRef.key;
        this.commentsRef.child(comment.key).set(comment);

        return this.threadsRef.child(threadKey + '/comments').once('value')
            .then((snapshot) => {
                let numberOfComments = snapshot == null ? 0 : snapshot.val();
                this.threadsRef.child(threadKey + '/comments').set(numberOfComments + 1);
            });
    }

    voteComment(commentKey: string, like: boolean, user: string): any {
        let commentRef = this.commentsRef.child(commentKey + '/votes/' + user);
        return commentRef.set(like);
    }

    getUsername(userUid: string) {
        return this.usersRef.child(userUid + '/username').once('value');
    }

    getUser(userUid: string) {
        return this.usersRef.child(userUid).once('value');
    }

    getUserThreads(userUid: string) {
        return this.threadsRef.orderByChild('user/uid').equalTo(userUid).once('value');
    }

    getUserComments(userUid: string) {
        return this.commentsRef.orderByChild('user/uid').equalTo(userUid).once('value');
    }
}