import express from 'express';
import pkg from '@prisma/client';
import { protect } from '../middleware/auth.js';
const { PrismaClient } = pkg;

const router = express.Router();
const prisma = new PrismaClient();

// Get all listings (with search support)
router.get('/', async (req, res) => {
    const { q } = req.query;
    try {
        const listings = await prisma.listing.findMany({
            where: q ? {
                OR: [
                    { title: { contains: q } },
                    { description: { contains: q } }
                ]
            } : {},
            include: {
                seller: {
                    select: {
                        name: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

// Get listings by category
router.get('/category/:category', async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: {
                category: req.params.category
            },
            include: {
                seller: {
                    select: {
                        name: true,
                        avatar: true
                    }
                }
            }
        });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch listings by category' });
    }
});

// Get a single listing
router.get('/:id', async (req, res) => {
    try {
        const listing = await prisma.listing.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                seller: {
                    select: {
                        name: true,
                        avatar: true,
                        bio: true
                    }
                }
            }
        });
        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ error: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch listing' });
    }
});

// Get listings by user
router.get('/user/:userId', async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: {
                sellerId: parseInt(req.params.userId)
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user listings' });
    }
});

// Create a new listing
router.post('/', protect, async (req, res) => {
    const { title, price, location, description, category, details, images } = req.body;
    try {
        const listing = await prisma.listing.create({
            data: {
                title,
                price,
                location,
                description,
                category,
                details,
                images,
                sellerId: req.user.id
            }
        });
        res.status(201).json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create listing' });
    }
});

// Delete a listing
router.delete('/:id', protect, async (req, res) => {
    try {
        const listing = await prisma.listing.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        if (listing.sellerId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this listing' });
        }

        await prisma.listing.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.json({ message: 'Listing removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete listing' });
    }
});

export default router;

