const PaymentGateway = require('./gateway.interface');
const axios = require('axios');

class StripeGateway extends PaymentGateway {
    constructor() {
        super();
        this.stripe = null;
    }

    init(config) {
        this.stripe = require('stripe')(config.apiKey);
    }

    async createCheckoutSession(sessionData) {
        try {
            return await this.stripe.checkout.sessions.create(sessionData);
        } catch (error) {
            throw new Error(`Stripe Checkout Session Error: ${error.message}`);
        }
    }

    async verifyPayment(paymentData) {
        try {
            const event = this.stripe.webhooks.constructEvent(
                paymentData.rawBody,
                paymentData.signature,
                paymentData.endpointSecret
            );
            return event;
        } catch (error) {
            throw new Error(`Stripe Verification Error: ${error.message}`);
        }
    }

    handleWebhook(webhookData) {
        // Handle webhook events and take actions
        const event = this.verifyPayment(webhookData);
        switch (event.type) {
            case 'payment_intent.succeeded':
                // Handle successful payment
                break;
            case 'payment_intent.payment_failed':
                // Handle failed payment
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}

module.exports = StripeGateway;
