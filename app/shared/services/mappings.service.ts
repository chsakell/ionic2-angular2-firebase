import { Injectable } from '@angular/core';

import { IThread, IComment } from '../interfaces';
import { ItemsService } from '../services/items.service';

@Injectable()
export class MappingsService {

    constructor(private itemsService: ItemsService) { }

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
                user: thread.user,
                comments: thread.comments == null ? 0 : thread.comments
            });
        });

        return threads;
    }

    getComments(snapshot: any): Array<IComment> {
        let comments: Array<IComment> = [];
        if (snapshot.val() == null)
            return comments;

        let list = snapshot.val();

        Object.keys(snapshot.val()).map((key: any) => {
            let comment: any = list[key];
            comments.push({
                key: key,
                text: comment.title,
                thread: comment.thread,
                dateCreated: comment.dateCreated,
                user: comment.user
            });
        });

        return comments;
    }

}