const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const router = express.Router();

// Create payment intent
router.post('/create-intent', async (req, res) => {
    try {
        const { amount, orderId } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'pkr',
            metadata: { orderId },
        });
        
        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Confirm payment
router.post('/confirm', async (req, res) => {
    try {
        const { paymentIntentId, orderId } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
            // Update order status
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'completed',
                status: 'processing',
            });
            
            res.json({ success: true, message: 'Payment successful' });
        } else {
            res.status(400).json({ success: false, message: 'Payment not successful' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook for payment events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        
        switch (event.type) {
            case 'payment_intent.succeeded':
                console.log('✅ Payment succeeded:', event.data.object.id);
                break;
            case 'payment_intent.payment_failed':
                console.log('❌ Payment failed:', event.data.object.id);
                break;
        }
        
        res.json({ received: true });
    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

module.exports = router;