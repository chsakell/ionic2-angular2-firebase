export interface IThread {
    key: string;
    title: string;
    question: string;
    category: string;
    dateCreated: string;
    user: string;
    comments: Object;
}

export interface Predicate<T> {
    (item: T): boolean;
}