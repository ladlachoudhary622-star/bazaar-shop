const nodemailer = require('nodemailer');
const Order = require('../models/Order');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Email templates
const emailTemplates = {
    orderConfirmation: (order, user) => ({
        subject: `Order Confirmation - Order #${order._id}`,
        html: `
            <h2>Order Confirmation</h2>
            <p>Hello ${user.name},</p>
            <p>Thank you for your order! Here are the details:</p>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Total Amount:</strong> Rs. ${order.totalPrice}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p>Your order will be shipped soon. You'll receive a tracking number via email.</p>
            <p>Thank you for shopping with Bazaar!</p>
        `,
    }),
    orderShipped: (order, user, trackingNumber) => ({
        subject: `Your Order is on the Way - Order #${order._id}`,
        html: `
            <h2>Order Shipped</h2>
            <p>Hello ${user.name},</p>
            <p>Great news! Your order has been shipped.</p>
            <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p>Track your package: <a href="https://bazaar.com/track/${trackingNumber}">Click here</a></p>
            <p>Expected delivery: 3-5 business days</p>
        `,
    }),
    orderDelivered: (order, user) => ({
        subject: `Order Delivered - Order #${order._id}`,
        html: `
            <h2>Order Delivered</h2>
            <p>Hello ${user.name},</p>
            <p>Your order has been delivered!</p>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p>We hope you're happy with your purchase. Please leave a review to help other customers.</p>
            <p><a href="https://bazaar.com/review/${order._id}">Leave a Review</a></p>
        `,
    }),
    passwordReset: (user, resetLink) => ({
        subject: 'Password Reset Request',
        html: `
            <h2>Password Reset</h2>
            <p>Hello ${user.name},</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="${resetLink}">Reset Password</a></p>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `,
    }),
    welcomeEmail: (user) => ({
        subject: 'Welcome to Bazaar!',
        html: `
            <h2>Welcome to Bazaar!</h2>
            <p>Hello ${user.name},</p>
            <p>Welcome to our online shopping platform. Start exploring amazing deals and discounts!</p>
            <p>Your account has been created with email: ${user.email}</p>
            <p><a href="https://bazaar.com">Start Shopping</a></p>
        `,
    }),
};

// Send email function
const sendEmail = async (to, template) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            ...template,
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error(`❌ Email error: ${error.message}`);
    }
};

// Send order confirmation email
const sendOrderConfirmation = async (order, user) => {
    const template = emailTemplates.orderConfirmation(order, user);
    await sendEmail(user.email, template);
};

// Send order shipped email
const sendOrderShipped = async (order, user, trackingNumber) => {
    const template = emailTemplates.orderShipped(order, user, trackingNumber);
    await sendEmail(user.email, template);
};

// Send order delivered email
const sendOrderDelivered = async (order, user) => {
    const template = emailTemplates.orderDelivered(order, user);
    await sendEmail(user.email, template);
};

// Send password reset email
const sendPasswordReset = async (user, resetLink) => {
    const template = emailTemplates.passwordReset(user, resetLink);
    await sendEmail(user.email, template);
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
    const template = emailTemplates.welcomeEmail(user);
    await sendEmail(user.email, template);
};

module.exports = {
    sendEmail,
    sendOrderConfirmation,
    sendOrderShipped,
    sendOrderDelivered,
    sendPasswordReset,
    sendWelcomeEmail,
};