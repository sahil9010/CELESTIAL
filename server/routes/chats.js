import express from 'express';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { protect } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Get chat messages for a listing
// @route   GET /api/chats/:listingId
router.get('/:listingId', protect, async (req, res) => {
    const { listingId } = req.params;
    const userId = req.user.id;

    try {
        const messages = await prisma.chatMessage.findMany({
            where: {
                listingId: parseInt(listingId),
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            include: {
                sender: {
                    select: { name: true, avatar: true }
                },
                receiver: {
                    select: { name: true, avatar: true }
                }
            },
            orderBy: {
                timestamp: 'asc'
            }
        });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

export default router;
