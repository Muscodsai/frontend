export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    library: number[];
    avatar: string;
    publications: number[];
    followers: number[];
    following: number[];
    emailPreference: EmailPreference;
    bio: string;
    likes: number;
    balance: number;
    activeChats: number[];
    activeSessions: number[];
}

export interface EmailPreference {
    newFollower: boolean,
    newComment: boolean,
    newMessage: boolean,
}

export interface Comment {
    id: number[];
    author: User;
    body: string;
    replies: Comment[];
    likes: number;
    dislikes: number;
    commentTime: Date;
}

export interface Article {
    id: number;
    author: User;
    cover: string;
    title: string;
    content: string;
    isSeries: boolean;
    publishTime: Date;
    lastEdit: Date;
    likes: number[];
    dislikes: number[];
    readTime: number;
    comments: Comment[];
    previous: number;
    next: number;
    price: number;
    tags: string[];
}

export interface Message {
    id: number;
    sender: User;
    content: string;
    sendTime: Date;
}

export interface Chat {
    id: number;
    members: User[];
    messages: Message[];
    groupName: string;
}