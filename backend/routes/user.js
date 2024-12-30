const express = require('express');
const zod = require('zod');
const { User, Account } = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const { authMiddleware } = require('../middleware');

const router = express.Router();

const signUpBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

const signInBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

const updateBody = zod.object({
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

router.post('/signup', async (req, res) => {
    const { success } = signUpBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.status(411).json({
            message: "User already exists"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    const user_id = user._id;

    await Account.create({
        userId: user_id,
        balance: (1 + (Math.random() * 10000))
    })

    const token = jwt.sign({
        user_id
    }, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token: token
    });
});

router.post('/signin', async (req, res) => {
    const { success } = signInBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Incorrect Inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username
    })

    if (!user) {
        return res.status(411).json({
            message: "User not registered"
        })
    }

    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })
})

router.put('/', authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(403).json({
            message: "Incorrect inputs"
        })
    }

    const userId = req.userId;

    try {
        await User.updateOne({ _id: userId }, req.body);

        res.status(200).json({
            message: "User updated successfully"
        });
    } catch (err) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }
})

router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.status(200).json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
})

module.exports = router;