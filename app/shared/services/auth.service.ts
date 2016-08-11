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

    addUser(username: string, uid: string) {
        this.usersRef.child(username).update({
            uid: uid
        });
    }

    getLoggedInUser() {
        return firebase.auth().currentUser;
    }

}