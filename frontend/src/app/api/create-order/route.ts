import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string, // Use your Razorpay Key ID here
  key_secret: process.env.RAZORPAY_KEY_SECRET as string, // Use your Razorpay Key Secret here
});

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create order in Razorpay
    const options = {
      amount: amount * 100, // Amount in smallest currency unit, e.g., paise for INR
      currency: 'INR',
      receipt: 'receipt_order_74394', // Customize or generate dynamically as needed
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error in creating order:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
