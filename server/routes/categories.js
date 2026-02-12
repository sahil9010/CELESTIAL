import express from 'express';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const router = express.Router();
const prisma = new PrismaClient();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

export default router;
