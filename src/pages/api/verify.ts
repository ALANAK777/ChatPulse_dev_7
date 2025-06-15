import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
export const runtime = 'nodejs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log('Received payment verification request');

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      console.log('Signature verified');
      res.status(200).json({ success: true });
    } else {
      console.log('Invalid signature');
      res.status(400).json({ success: false, error: "Invalid signature" });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
