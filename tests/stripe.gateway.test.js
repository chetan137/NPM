const StripeGateway = require('../src/gateways/stripe.gateway');

test('StripeGateway should create a checkout session', async () => {
    const stripe = new StripeGateway();
    stripe.init({ apiKey: 'test-api-key' });

    const session = await stripe.createCheckoutSession({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'https://your-domain/success',
        cancel_url: 'https://your-domain/cancel',
    });

    expect(session.id).toBeDefined();
});
