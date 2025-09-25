import { ObjectId } from "mongodb";

export default class User {
    _id?: ObjectId;
    name: string;
    email: string;
    password_hash?: string;
    google_id?: string;
    created_at: Date;
    refresh_token?: string;

    constructor(name: string, email: string, passwordHash: string) {
        this.name = name;
        this.email = email;
        this.password_hash = passwordHash;
        this.created_at = new Date();
    }
}