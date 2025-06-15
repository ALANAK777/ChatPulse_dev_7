import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
export const runtime = 'nodejs';

export async function POST(req: Request) {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY as string)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        try {
            const order = await prisma.user.findUnique({
                where: { razorpayOrderId: razorpay_order_id }
            });
            if (order) {
                await prisma.user.update({
                    where: { id: order.id },
                    data: { 
                     
                        subscriptionId: razorpay_payment_id
                    }
                });

                await prisma.user.update({
                    where: { id: order.id },
                    data: { 
                        subscriptionStatus: 'active',
                        subscriptionPlan: order.plan
                    }
                });
            }

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error('Payment verification error:', error);
            return NextResponse.json({ success: false }, { status: 500 });
        }
    } else {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}
