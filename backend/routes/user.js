const express = require('express');
const zod = require('zod');
const { User } = require('../db');
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

module.exports = router;