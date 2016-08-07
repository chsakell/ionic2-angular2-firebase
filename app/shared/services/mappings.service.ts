import { Injectable } from '@angular/core';

import { IThread } from '../interfaces';
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
                comments: this.itemsService.getObjectKeysSize(thread.comments)
            });
        });

        return threads;
    }

}