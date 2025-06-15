import type { NextApiRequest, NextApiResponse } from 'next';
import emailjs from '@emailjs/browser';

emailjs.init("n2HHehuy4rt5Tus2C")

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, name } = req.body;
    console.log("from email",email,name)
  
    try {
      const result = await emailjs.send(
        "service_g0bctsb",
        "template_yyrn5eo",
        {
          to_email: email,
          from_name: "ChatPulse",
          to_name: name,
          message: "Welcome to ChatPulse! We're excited to have you on board."
        }
      );

      res.status(200).json({ message: 'Email sent successfully', result });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      res.status(500).json({ message: 'Failed to send email', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
