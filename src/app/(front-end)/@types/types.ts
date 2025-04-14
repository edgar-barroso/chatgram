export interface Group {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: User[];
}

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: User;
}