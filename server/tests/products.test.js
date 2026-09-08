const request = require('supertest');
const app = require('../index');
const Product = require('../models/Product');

describe('Products API', () => {
    beforeAll(async () => {
        // Create test products
        await Product.create([
            {
                title: 'Test Product 1',
                price: 1000,
                category: 'Electronics',
                stock: 50,
            },
            {
                title: 'Test Product 2',
                price: 2000,
                category: 'Fashion',
                stock: 30,
            },
        ]);
    });

    afterAll(async () => {
        await Product.deleteMany({});
    });

    describe('GET /api/products', () => {
        it('should return all products', async () => {
            const res = await request(app).get('/api/products');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should filter by category', async () => {
            const res = await request(app)
                .get('/api/products')
                .query({ category: 'Electronics' });

            expect(res.status).toBe(200);
            expect(res.body.every(p => p.category === 'Electronics')).toBe(true);
        });

        it('should filter by price range', async () => {
            const res = await request(app)
                .get('/api/products')
                .query({ minPrice: 1500, maxPrice: 2500 });

            expect(res.status).toBe(200);
            expect(res.body.every(p => p.price >= 1500 && p.price <= 2500)).toBe(true);
        });

        it('should search by title', async () => {
            const res = await request(app)
                .get('/api/products')
                .query({ search: 'Test' });

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });
});
