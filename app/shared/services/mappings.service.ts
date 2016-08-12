import { Injectable } from '@angular/core';

import { IThread, IComment } from '../interfaces';
import { DataService } from '../services//data.service';
import { ItemsService } from '../services/items.service';

@Injectable()
export class MappingsService {

    constructor(private dataService: DataService,
        private itemsService: ItemsService) { }

    getThreads(snapshot: any): Array<IThread> {
        let threads: Array<IThread> = [];
        if (snapshot.val() == null)
            return threads;

        let list = snapshot.val();

        Object.keys(snapshot.val()).map((key: any) => {
            let thread: any = list[key];
            threads.push({
                key: key,
                title: thread.title,
                question: thread.question,
                category: thread.category,
                dateCreated: thread.dateCreated,
                user: { uid: thread.user.uid, username: thread.user.username },
                comments: thread.comments == null ? 0 : thread.comments
            });
        });

        return threads;
    }

    getThread(snapshot: any, key: string): IThread {

        let thread: IThread = {
            key: key,
            title: snapshot.title,
            question: snapshot.question,
            category: snapshot.category,
            dateCreated: snapshot.dateCreated,
            user: snapshot.user,
            comments: snapshot.comments == null ? 0 : snapshot.comments
        };

        return thread;
    }

    getComments(snapshot: any): Array<IComment> {
        let comments: Array<IComment> = [];
        if (snapshot.val() == null)
            return comments;

        let list = snapshot.val();

        Object.keys(snapshot.val()).map((key: any) => {
            let comment: any = list[key];
            //console.log(comment.votes);
            this.itemsService.groupByBoolean(comment.votes, true);
            comments.push({
                key: key,
                text: comment.text,
                thread: comment.thread,
                dateCreated: comment.dateCreated,
                user: comment.user,
                votesUp: this.itemsService.groupByBoolean(comment.votes, true),
                votesDown: this.itemsService.groupByBoolean(comment.votes, false)
            });
        });

        return comments;
    }

}