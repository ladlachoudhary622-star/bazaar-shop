const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const { sendPasswordReset, sendWelcomeEmail } = require('../services/emailService');
const router = express.Router();

// Request password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        // Save token (in production, store in database with expiry)
        user.resetTokenHash = resetTokenHash;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();
        
        // Send email
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await sendPasswordReset(user, resetLink);
        
        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reset password
router.post('/reset-password', async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const user = await User.findOne({
            resetTokenHash,
            resetTokenExpiry: { $gt: Date.now() },
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        
        user.password = newPassword;
        user.resetTokenHash = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;