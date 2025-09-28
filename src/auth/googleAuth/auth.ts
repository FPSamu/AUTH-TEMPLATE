import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { getDB } from '../../services/database.service';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';
import User from '../../models/User';

const router = Router();

router.post('/google', async (req, res) => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(clientId);
    const db = getDB();
    const usersCollection = db.collection(process.env.USERS_COLLECTION_NAME || 'users');

    try {
        const { idToken } = req.body;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: clientId
        });

        const payload = ticket.getPayload();
        if (!payload) return res.status(400).json({message: 'Invalid Google token'});

        const { name, email } = payload;

        if (!name || !email) {
            return res.status(400).json({message: 'Missing email or name'});
        }

        let user = await usersCollection.findOne({ email });
        if (!user) {
            const newUser = new User(name || '', email || '', 'google', { googleId: ticket.getUserId() || undefined });
            const result = await usersCollection.insertOne(newUser);
            user = { ...newUser, _id: result.insertedId};
        }
        
        const accessToken = await generateToken(user._id, email, "15m")
        const refreshToken = await generateToken(user._id, email, "7d");
        const hashedRefreshedToken = await bcrypt.hash(refreshToken, saltRounds);
        
        await usersCollection.updateOne(
            { email }, 
            { $set: {
                refresh_token: hashedRefreshedToken 
        }});

        res.status(200).json({
            message:'User logged in',
            user: {
                _id: user._id,
                email,
                name
            },
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Google register failed', 
            error: (error as Error).message
        })
    }
});

export default router;