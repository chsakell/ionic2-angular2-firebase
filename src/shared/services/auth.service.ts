import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UserCredentials } from '../interfaces';

declare var firebase: any;

@Injectable()
export class AuthService {

    usersRef: any = firebase.database().ref('users');

    constructor() { }

    registerUser(user: UserCredentials) {
        return firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
    }

    signInUser(email: string, password: string) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    signOut() {
        return firebase.auth().signOut();
    }

    addUser(username: string, dateOfBirth: string, uid: string) {
        this.usersRef.child(uid).update({
            username: username,
            dateOfBirth: dateOfBirth
        });
    }

    getLoggedInUser() {
        return firebase.auth().currentUser;
    }

    onAuthStateChanged(callback) {
        return firebase.auth().onAuthStateChanged(callback);
    }

}