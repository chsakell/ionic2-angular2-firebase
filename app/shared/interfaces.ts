export interface IThread {
    key: string;
    title: string;
    question: string;
    category: string;
    dateCreated: string;
    user: string;
    comments: number;
}

export interface IComment {
    key?: string;
    thread: string;
    text: string;
    user: string;
    dateCreated: string;
    votesUp: number;
    votesDown: number;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface Predicate<T> {
    (item: T): boolean;
}