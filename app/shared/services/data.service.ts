import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IThread } from '../interfaces';

declare var firebase: any;

@Injectable()
export class DataService {

    constructor() { }

    submitThread(thread: IThread) {
        return firebase.database().ref('threads').push(thread);
    }
}