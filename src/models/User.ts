import { ObjectId } from "mongodb";

type Provider = 'google' | 'local';

export default class User {
    _id?: ObjectId;
    name: string;
    email: string;
    password_hash?: string | null;
    google_id?: string;
    provider: Provider;
    created_at: Date;
    refresh_token?: string;

    constructor(name: string, email: string, provider: Provider, options?: { passwordHash?:string; googleId?: string}) {
        this.name = name;
        this.email = email;
        this.password_hash = options?.passwordHash ?? null;
        this.provider = provider;
        this.google_id = options?.googleId
        this.created_at = new Date();
    }
}