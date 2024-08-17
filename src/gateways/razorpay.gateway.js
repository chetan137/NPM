const PaymentGateway = require('./gateway.interface');
const Razorpay = require('razorpay');

class RazorpayGateway extends PaymentGateway {
    constructor() {
        super();
        this.razorpay = null;
    }

    init(config) {
        this.razorpay = new Razorpay({
            key_id: config.key_id,
            key_secret: config.key_secret,
        });
    }

    async createCheckoutSession(sessionData) {
        try {
            return await this.razorpay.orders.create(sessionData);
        } catch (error) {
            throw new Error(`Razorpay Checkout Session Error: ${error.message}`);
        }
    }

    async verifyPayment(paymentData) {
        const crypto = require('crypto');
        const shasum = crypto.createHmac('sha256', this.razorpay.key_secret);
        shasum.update(paymentData.orderId + '|' + paymentData.razorpay_payment_id);
        const digest = shasum.digest('hex');

        if (digest !== paymentData.razorpay_signature) {
            throw new Error('Razorpay Verification Failed');
        }
        return paymentData;
    }

    handleWebhook(webhookData) {
        // Handle webhook events and take actions
        const verified = this.verifyPayment(webhookData);
        if (verified) {
            // Take action based on event type
        }
    }
}

module.exports = RazorpayGateway;
