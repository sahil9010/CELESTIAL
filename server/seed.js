import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const categories = [
    { name: 'Bikes', slug: 'bikes', icon: 'Bike', count: '1.2k' },
    { name: 'Cars', slug: 'cars', icon: 'Car', count: '850' },
    { name: 'Houses', slug: 'house', icon: 'Home', count: '420' },
    { name: 'Office Space', slug: 'office', icon: 'Briefcase', count: '150' },
    { name: 'Land', slug: 'land', icon: 'Map', count: '310' },
];

const featuredListings = [
    {
        category: 'cars',
        title: 'Tesla Model 3 Performance 2023',
        price: '$45,000',
        location: 'Kathmandu',
        images: [
            'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800'
        ],
        details: { model: 'Model 3', year: '2023', condition: 'Like New', brand: 'Tesla', speed: '0-60 in 3.1s' },
        description: 'This is a premium Tesla Model 3 Performance in pristine condition. Autopilot enabled, premium interior, and lightning-fast acceleration.'
    },
    {
        category: 'bikes',
        title: 'Ducati Panigale V4 S Speciale',
        price: '$28,500',
        location: 'Pokhara',
        images: [
            'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=800'
        ],
        details: { model: 'V4 S', year: '2022', cc: '1103cc', mileage: '15 km/l', condition: 'Brand New' },
        description: 'The pinnacle of Italian engineering. Limited edition Speciale livery.'
    }
];

async function main() {
    console.log('Start seeding...');

    // Create a default user
    const user = await prisma.user.upsert({
        where: { email: 'seller@example.com' },
        update: {},
        create: {
            email: 'seller@example.com',
            password: 'password123', // In a real app, hash this!
            name: 'John Seller',
            avatar: 'S',
            bio: 'Trusted premium seller'
        }
    });

    // Create categories
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat
        });
    }

    // Create listings
    for (const listing of featuredListings) {
        await prisma.listing.create({
            data: {
                ...listing,
                sellerId: user.id
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
