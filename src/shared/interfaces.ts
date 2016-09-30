export interface IThread {
    key: string;
    title: string;
    question: string;
    category: string;
    dateCreated: string;
    user: IUser;
    comments: number;
}

export interface IComment {
    key?: string;
    thread: string;
    text: string;
    user: IUser;
    dateCreated: string;
    votesUp: number;
    votesDown: number;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface IUser {
    uid: string;
    username: string;
}

export interface Predicate<T> {
    (item: T): boolean;
}

export interface ValidationResult {
    [key: string]: boolean;
}