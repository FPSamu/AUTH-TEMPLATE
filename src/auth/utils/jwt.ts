import jwt, { SignOptions  } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const secretKey = process.env.JWT_SECRET || "";

export async function generateToken(userId: ObjectId, email: string, expiration: SignOptions['expiresIn']) {
    const payload: JwtPayload = { userId: userId.toString(), email: email};
    const token = jwt.sign(payload, secretKey, { expiresIn: expiration });

    return token;
}