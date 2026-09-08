const request = require('supertest');
const app = require('../index');
const Order = require('../models/Order');

describe('Orders API', () => {
    let userId;
    let orderId;

    beforeAll(async () => {
        // Setup test user
        userId = 'test-user-id';
    });

    describe('POST /api/orders', () => {
        it('should create a new order', async () => {
            const res = await request(app)
                .post('/api/orders')
                .send({
                    user: userId,
                    items: [
                        {
                            product: 'product-id-1',
                            quantity: 2,
                            price: 1000,
                        },
                    ],
                    totalPrice: 2000,
                    shippingAddress: {
                        street: '123 Main St',
                        city: 'Karachi',
                        country: 'Pakistan',
                        postalCode: '75000',
                    },
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.status).toBe('pending');
            orderId = res.body._id;
        });
    });

    describe('GET /api/orders/:userId', () => {
        it('should retrieve user orders', async () => {
            const res = await request(app).get(`/api/orders/${userId}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
});
