import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
export const runtime = 'nodejs';

export async function POST(request: Request) {
    const body = await request.json();
    const { plan, price } = body;
  
    let instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_SECRET_KEY as string
    });

    const options = {
        amount: price*100, // amount in paise
        currency: "INR",
        receipt: "order_rcptid_" + Date.now(),
        notes: {
            plan: plan
        }
    };

    try {
        const order = await instance.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
