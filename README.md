Unifi Payment Gateway Integration

Unifi Payment is a Node.js project that provides a unified interface to handle multiple payment gateways, such as Razorpay and Stripe. This project is designed to simplify the integration and management of various payment methods in your applications.


Razorpay Integration: Verify payments and handle transactions with Razorpay.
Stripe Integration: Create and manage checkout sessions with Stripe.
Modular Design: Separate gateway logic for easy maintenance and scalability.
Testing: Unit tests for payment gateway integrations using Jest. 


Project Structure
plaintext
 
│
├── src/
│   ├── gateways/
│   │   ├── razorpay.gateway.js
│   │   └── stripe.gateway.js
│   └── index.js
│
├── tests/
│   ├── razorpay.gateway.test.js
│   └── stripe.gateway.test.js
│
├── node_modules/
│
├── .env
├── jest.config.js
├── package.json
├── package-lock.json
└── README.md

src/gateways/: Contains the payment gateway integration logic.
tests/: Contains Jest unit tests for the gateways.
.env: Environment variables for API keys.
jest.config.js: Configuration file for Jest.
package.json: Project dependencies and scripts.
Installation
Clone the repository:

bash
Copy code
git clone  https://github.com/chetan137/NPM.git 
cd unifi-payment
Install dependencies:

bash
Copy code
npm install
Create a .env file in the root directory and add your API keys:

plaintext
Copy code
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
Usage
To use the Razorpay and Stripe gateways, instantiate the classes and call the appropriate methods. Here’s an example of how to verify a payment using Razorpay:

javascript
ex. =>

const RazorpayGateway = require('./src/gateways/razorpay.gateway');

const razorpayGateway = new RazorpayGateway();

const paymentDetails = {}; // Your payment details here

razorpayGateway.verifyPayment(paymentDetails)
  .then(() => console.log('Payment verified successfully'))
  .catch((error) => console.error('Payment verification failed:', error.message));

  
Similarly, you can use the Stripe gateway to create a checkout session:
 --------------------------------------------------------------------------------------------------------------------------------------------------

 
const StripeGateway = require('./src/gateways/stripe.gateway');

const stripeGateway = new StripeGateway();

const sessionData = {
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
    success_url: 'https://yourdomain.com/success',
    cancel_url: 'https://yourdomain.com/cancel',
};

stripeGateway.createCheckoutSession(sessionData)
  .then(session => console.log('Checkout session created:', session.id))
  .catch(error => console.error('Checkout session creation failed:', error.message));



  
Testing
Run unit tests using Jest:

bash
Copy code
npx jest --verbose
This command will execute all tests in the tests/ directory and provide detailed output.

Environment Variables
Make sure to set the following environment variables in your .env file:

RAZORPAY_KEY_ID: Your Razorpay API key ID.
RAZORPAY_KEY_SECRET: Your Razorpay API key secret.
STRIPE_SECRET_KEY: Your Stripe API secret key.

These variables are required for the respective payment gateways to function correctly.

Contributing
Contributions are welcome! If you have any suggestions or improvements, please feel free to submit a pull request or open an issue.

