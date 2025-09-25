import { Router } from "express";
import { getDB } from "../../services/database.service";
import bcrypt from 'bcrypt';
import validEmail from "../utils/validEmail";
import { generateToken } from "../utils/jwt";

const router = Router();
const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try{
        if (!email || !password) {
            return res.status(400).json({error:'Some fields missing'});
        }
        
        const db = getDB();
        const usersCollection = db.collection(process.env.USERS_COLLECTION_NAME || 'users');

        const user = await usersCollection.findOne({email});
        if (!user) return res.status(401).json({message: "No user found"});

        const correctPassword = await bcrypt.compare(password, user.passwordHash);  
        if (!correctPassword) return res.status(401).json({message: "Incorrect email or password"});

        const accessToken = await generateToken(user._id, user.email, "15m")
        const refreshToken = await generateToken(user._id, user.email, "7d");
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
                email: user.email,
                name: user.name
            },
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message, 
            message: 'Server error'
        });
    }
    
});

export default router;