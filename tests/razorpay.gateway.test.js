

const RazorpayGateway = require('../src/gateways/razorpay.gateway');
const axios = require('axios');
jest.mock('axios');

describe('RazorpayGateway', () => {
    let razorpayGateway;

    beforeEach(() => {

        razorpayGateway = new RazorpayGateway();
        razorpayGateway.init({
            key_id: 'test_key_id',
            key_secret: 'test_key_secret',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should initialize with given config', () => {
        expect(razorpayGateway.razorpay.key_id).toBe('test_key_id');
        expect(razorpayGateway.razorpay.key_secret).toBe('test_key_secret');
    });

    test('should create a checkout session', async () => {
        const sessionData = {
            amount: 5000,
            currency: 'INR',
            receipt: 'receipt#1',
            payment_capture: '1',
        };

        axios.post.mockResolvedValue({
            data: {
                id: 'order_1',
                amount: 5000,
                currency: 'INR',
                receipt: 'receipt#1',
                status: 'created',
            },
        });

        const result = await razorpayGateway.createCheckoutSession(sessionData);

        expect(axios.post).toHaveBeenCalledWith(
            'https://api.razorpay.com/v1/orders',
            sessionData,
            {
                auth: {
                    username: 'test_key_id',
                    password: 'test_key_secret',
                },
            }
        );
        expect(result.id).toBe('order_1');
        expect(result.status).toBe('created');
    });

    test('should verify payment', async () => {
        const paymentData = {
            razorpay_order_id: 'order_1',
            razorpay_payment_id: 'payment_1',
            razorpay_signature: 'signature_1',
        };

        const validSignature = 'generated_signature';

        razorpayGateway.razorpay.utils = {
            hmac_sha256: jest.fn(() => validSignature),
        };

        const isValid = await razorpayGateway.verifyPayment(paymentData);

        expect(razorpayGateway.razorpay.utils.hmac_sha256).toHaveBeenCalledWith(
            'order_1|payment_1',
            'test_key_secret'
        );
        expect(isValid).toBe(true);
    });

    test('should handle webhook correctly', async () => {
        const webhookData = {
            event: 'payment.captured',
            payload: { payment_id: 'payment_1' },
        };

        const result = await razorpayGateway.handleWebhook(webhookData);

        expect(result).toEqual({
            status: 'success',
            event: 'payment.captured',
            paymentId: 'payment_1',
        });
    });

    test('should handle errors in createCheckoutSession', async () => {
        axios.post.mockRejectedValue(new Error('API error'));

        const sessionData = {
            amount: 5000,
            currency: 'INR',
            receipt: 'receipt#1',
            payment_capture: '1',
        };

        await expect(razorpayGateway.createCheckoutSession(sessionData)).rejects.toThrow(
            'API error'
        );
    });

    test('should handle invalid payment verification', async () => {
        const paymentData = {
            razorpay_order_id: 'order_1',
            razorpay_payment_id: 'payment_1',
            razorpay_signature: 'invalid_signature',
        };

        razorpayGateway.razorpay.utils = {
            hmac_sha256: jest.fn(() => 'generated_signature'),
        };

        const isValid = await razorpayGateway.verifyPayment(paymentData);

        expect(isValid).toBe(false);
    });
});
