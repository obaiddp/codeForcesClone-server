const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const createTokenAndSendCookie = (res, userId) => {
    const token = jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE || '7d'}
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return token;
}

exports.register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        
        if (existingUser){
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'user'
            }
        });

        const token = createTokenAndSendCookie(res, newUser.id);

        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            token 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, existingUser.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = createTokenAndSendCookie(res, existingUser.id);

        res.json({ 
            message: "Login successful", 
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            },
            token 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
}

exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out successfully" });
}

exports.profile = async (req, res) => {
    try {
        if (!req.user){
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                submissions: {
                    include: {
                        problem: {
                            select: {
                                id: true,
                                name: true,
                                difficulty: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ user });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: error.message });
    }
}