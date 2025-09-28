import { Router } from "express";
import User from "../../models/User";
import validEmail from "../utils/validEmail";
import validPassword from "../utils/validPassword";
import bcrypt from 'bcrypt';
import { getDB } from "../../services/database.service";

const router = Router();
const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({error: 'Some fields missing'});
    }

    if (!validEmail(email)) return res.status(400).json({error: 'Email not valid'});
    if (!validPassword(password)) return res.status(400).json({error: "Password's length must be at least 8 characters"});

    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const db = getDB();
        const usersCollection = db.collection(process.env.USERS_COLLECTION_NAME || "users");

        const userExists = await usersCollection.findOne({email})

        if (userExists) {
            return res.status(400).json({error:'User already exists'});
        }

        const user = new User(name, email, 'local', {passwordHash});

        const result = await usersCollection.insertOne(user);

        res.status(201).json({
            message: 'User created susccesfully',
            user: {
                _id: result.insertedId,
                name,
                email,
            }
        })
    } catch (error) {
        res.status(500).json({error: (error as Error).message, message: 'Server error'});
    }
});


export default router;