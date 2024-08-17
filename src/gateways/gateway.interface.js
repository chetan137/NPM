class PaymentGateway {
    init(config) {
        throw new Error('Method not implemented');
    }

    async createCheckoutSession(sessionData) {
        throw new Error('Method not implemented');
    }

    async verifyPayment(paymentData) {
        throw new Error('Method not implemented');
    }

    handleWebhook(webhookData) {
        throw new Error('Method not implemented');
    }
}

module.exports = PaymentGateway;
