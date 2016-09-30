import { Injectable } from '@angular/core';
import { Predicate } from '../interfaces';

import lodash from 'lodash';

@Injectable()
export class ItemsService {

    constructor() { }

    getKeys(object): string[] {
        return lodash.keysIn(object);
    }

    reversedItems<T>(array: T[]): T[] {
        return <T[]>lodash.reverse(array);
    }

    groupByBoolean(object, value: boolean): number {
        let result: number = 0;
        if (object == null)
            return result;

        lodash.map(lodash.shuffle(object), function (val) {
            if (val === value)
                result++;
        });

        return result;
    }

    /*
    Returns object's keys lenght
    */
    getObjectKeysSize(obj: any): number {
        if (obj == null) {
            return 0;
        } else {
            return lodash.size(obj);
        }
    }
    /*
    Removes an item from an array using the lodash library
    */
    removeItemFromArray<T>(array: Array<T>, item: any) {
        lodash.remove(array, function (current) {
            return JSON.stringify(current) === JSON.stringify(item);
        });
    }

    removeItems<T>(array: Array<T>, predicate: Predicate<T>) {
        lodash.remove(array, predicate);
    }

    includesItem<T>(array: Array<T>, predicate: Predicate<T>) {
        let result = lodash.filter(array, predicate);
        return result.length > 0;
    }

    /*
    Finds a specific item in an array using a predicate and replaces it
    */
    setItem<T>(array: Array<T>, predicate: Predicate<T>, item: T) {
        var _oldItem = lodash.find(array, predicate);
        if (_oldItem) {
            var index = lodash.indexOf(array, _oldItem);
            array.splice(index, 1, item);
        } else {
            array.push(item);
        }
    }

    /*
    Adds an item to zero index
    */
    addItemToStart<T>(array: Array<T>, item: any) {
        array.splice(0, 0, item);
    }

    /*
    From an array of type T, select all values of type R for property
    */
    getPropertyValues<T, R>(array: Array<T>, property: string): R {
        var result = lodash.map(array, property);
        return <R><any>result;
    }

    /*
    Util method to serialize a string to a specific Type
    */
    getSerialized<T>(arg: any): T {
        return <T>JSON.parse(JSON.stringify(arg));
    }
}