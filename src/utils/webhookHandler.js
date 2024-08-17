function handleWebhook(req, res, gateway) {
    try {
        const webhookData = {
            rawBody: req.rawBody,
            signature: req.headers['stripe-signature'] || req.headers['razorpay-signature'],
            endpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
            orderId: req.body.orderId,
            razorpay_payment_id: req.body.razorpay_payment_id,
            razorpay_signature: req.body.razorpay_signature
        };

        gateway.handleWebhook(webhookData);
        res.status(200).send('Webhook received and processed');
    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
}

module.exports = handleWebhook;
