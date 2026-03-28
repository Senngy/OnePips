import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (apiKey) {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2025-01-27' as any,
      });
    } else {
      console.warn('Stripe API key is not configured. Stripe features will be disabled.');
    }
  }

  async createPaymentIntent(amount: number) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured.');
    }
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'eur',
    });
  }
}
