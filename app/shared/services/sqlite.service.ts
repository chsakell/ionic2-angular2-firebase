import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

import { IThread, IComment, IUser } from '../interfaces';
import { ItemsService } from '../services/items.service';

@Injectable()
export class SqliteService {
    db: SQLite;

    constructor(private itemsService: ItemsService) {

    }

    InitDatabase() {
        var self = this;
        this.db = new SQLite();
        self.db.openDatabase({
            name: 'forumdb.db',
            location: 'default' // the location field is required
        }).then(() => {
            self.createThreads();
            self.createComments();
            self.createUsers();
        }, (err) => {
            console.error('Unable to open database: ', err);
        });
    }

    runTest() {
        let thread: IThread = {
            key: '123456789',
            title: 'First thread',
            question: 'what is your pet name?',
            category: 'pets',
            dateCreated: new Date().toString(),
            user: { uid: '39402942424', username: 'Chris' },
            comments: 4
        };

        this.addThread(thread);
        this.printThreads();
    }

    resetDatabase() {
        var self = this;
        self.resetUsers();
        self.resetThreads();
        self.resetComments();
    }

    resetUsers() {
        var self = this;
        let query = 'DELETE FROM Users';
        self.db.executeSql(query, {}).then((data) => {
            console.log('Users table dropped');
        }, (err) => {
            console.error('Unable to print threads: ', err);
        });
    }

    resetThreads() {
        var self = this;
        let query = 'DELETE FROM Threads';
        self.db.executeSql(query, {}).then((data) => {
            console.log('Threads table dropped');
        }, (err) => {
            console.error('Unable to drop table Threads: ', err);
        });
    }

    resetComments() {
        var self = this;
        let query = 'DELETE FROM Comments';
        self.db.executeSql(query, {}).then((data) => {
            console.log('Comments table dropped');
        }, (err) => {
            console.error('Unable to drop table Commments: ', err);
        });
    }

    printThreads() {
        var self = this;
        self.db.executeSql('SELECT * FROM Threads', {}).then((data) => {
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    console.log(data.rows.item(i));
                    console.log(data.rows.item(i).key);
                    console.log(data.rows.item(i).title);
                    console.log(data.rows.item(i).question);
                }
            } else {
                console.log('no threads found..');
            }
        }, (err) => {
            console.error('Unable to print threads: ', err);
        });
    }

    createThreads() {
        var self = this;
        self.db.executeSql('CREATE TABLE IF NOT EXISTS Threads ( key VARCHAR(255) PRIMARY KEY NOT NULL, title text NOT NULL, question text NOT NULL, category text NOT NULL, datecreated text, USER VARCHAR(255), comments INT NULL);', {}).then(() => {
        }, (err) => {
            console.error('Unable to create Threads table: ', err);
        });
    }

    createComments() {
        var self = this;
        self.db.executeSql('CREATE TABLE IF NOT EXISTS Comments ( key VARCHAR(255) PRIMARY KEY NOT NULL, thread VARCHAR(255) NOT NULL, text text NOT NULL, USER VARCHAR(255) NOT NULL, datecreated text, votesUp INT NULL, votesDown INT NULL);', {}).then(() => {
        }, (err) => {
            console.error('Unable to create Comments table: ', err);
        });
    }

    createUsers() {
        var self = this;
        self.db.executeSql('CREATE TABLE IF NOT EXISTS Users ( uid text PRIMARY KEY NOT NULL, username text NOT NULL); ', {}).then(() => {
        }, (err) => {
            console.error('Unable to create Users table: ', err);
        });
    }

    saveUsers(users: IUser[]) {
        var self = this;

        users.forEach(user => {
            self.addUser(user);
        });
    }

    addUser(user: IUser) {
        var self = this;
        let query: string = 'INSERT INTO Users (uid, username) Values (?,?)';
        self.db.executeSql(query, [user.uid, user.username]).then((data) => {
            console.log('user ' + user.username + ' added');
        }, (err) => {
            console.error('Unable to add user: ', err);
        });
    }

    saveThreads(threads: IThread[]) {
        let self = this;
        let users: IUser[] = [];

        threads.forEach(thread => {
            if (!self.itemsService.includesItem<IUser>(users, u => u.uid === thread.user.uid)) {
                console.log('in add user..' + thread.user.username);
                users.push(thread.user);
            } else {
                console.log('user found: ' + thread.user.username);
            }
            self.addThread(thread);
        });

        self.saveUsers(users);
    }

    addThread(thread: IThread) {
        var self = this;

        let query: string = 'INSERT INTO Threads (key, title, question, category, datecreated, user, comments) VALUES (?,?,?,?,?,?,?)';
        self.db.executeSql(query, [
            thread.key,
            thread.title,
            thread.question,
            thread.category,
            thread.dateCreated,
            thread.user.uid,
            thread.comments
        ]).then((data) => {
            console.log('thread ' + thread.key + ' added');
        }, (err) => {
            console.error('Unable to add thread: ', err);
        });
    }

    getThreads(): any {
        var self = this;
        return self.db.executeSql('SELECT Threads.*, username FROM Threads INNER JOIN Users ON Threads.user = Users.uid', {});
    }
}