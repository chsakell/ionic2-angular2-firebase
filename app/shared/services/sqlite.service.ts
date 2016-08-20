import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

import { IThread, IComment, IUser } from '../interfaces';

@Injectable()
export class SqliteService {
    db: SQLite;

    constructor() {

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
        let query = 'DROP TABLE Users';
        self.db.executeSql(query, {}).then((data) => {
            console.log('Users table dropped');
        }, (err) => {
            console.error('Unable to print threads: ', err);
        });
    }

    resetThreads() {
        var self = this;
        let query = 'DROP TABLE Threads';
        self.db.executeSql(query, {}).then((data) => {
            console.log('Threads table dropped');
        }, (err) => {
            console.error('Unable to drop table Threads: ', err);
        });
    }

    resetComments() {
        var self = this;
        let query = 'DROP TABLE Comments';
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
        self.db.executeSql('CREATE TABLE IF NOT EXISTS Comments ( KEY VARCHAR(255) PRIMARY KEY NOT NULL, thread VARCHAR(255) NOT NULL, text text NOT NULL, USER VARCHAR(255) NOT NULL, datecreated text, votesUp INT NULL, votesDown INT NULL);', {}).then(() => {
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

    checkUser(user: IUser) {
        var self = this;
        self.db.executeSql('SELECT * FROM Users where uid = ?', [user.uid]).then((data) => {
            if (data.rows.length > 0) {
                self.updateUser(user);
            } else {
                self.addUser(user);
            }
        }, (err) => {
            console.error('Unable to check user: ', err);
        });
    }

    addUser(user: IUser) {
        var self = this;
        let query: string = 'INSERT INTO Users (uid, username) Values (?,?)';
        self.db.executeSql(query, [user.uid, user.username]).then((data) => {
        }, (err) => {
            console.error('Unable to add user: ', err);
        });
    }

    updateUser(user: IUser) {
        var self = this;
        let query: string = 'UPDATE Users SET username = ? Where uid = ?';
        self.db.executeSql(query, [user.username, user.uid]).then((data) => {
        }, (err) => {
            console.error('Unable to update user: ', err);
        });
    }

    addThread(thread: IThread) {
        var self = this;
        self.checkUser(thread.user);

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
        }, (err) => {
            console.error('Unable to add thread: ', err);
        });
    }
}