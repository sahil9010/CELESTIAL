import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import listingsRoutes from './routes/listings.js';
import categoriesRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js';
import chatsRoutes from './routes/chats.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Adjust this for production
    },
});

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/listings', listingsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatsRoutes);

// Basic test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
});

// Socket.io integration
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_chat', (listingId) => {
        socket.join(`listing_${listingId}`);
    });

    socket.on('send_message', async (data) => {
        const { content, senderId, receiverId, listingId } = data;
        try {
            // Save message to database
            const savedMessage = await prisma.chatMessage.create({
                data: {
                    content,
                    senderId: parseInt(senderId),
                    receiverId: parseInt(receiverId),
                    listingId: parseInt(listingId),
                },
                include: {
                    sender: { select: { name: true, avatar: true } }
                }
            });

            // Broadcast to users in the same listing chat
            io.to(`listing_${listingId}`).emit('receive_message', savedMessage);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
