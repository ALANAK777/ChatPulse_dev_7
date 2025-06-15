import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env.mjs";
import { prisma } from "@/server/db";

const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/7uxnl2pfx5o1qgu9zc9jq48wb51l2gqv";

async function sendToMakeWebhook(userData: any) {
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Error sending data to Make webhook:', error);
  }
}
//first time sign up mail using make
export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user) {
        const userData = {
          ...user,
          body: `<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #2E86C1;">Hey {{name}}, Your Files Are Waiting for You! 📄</h2>
  
  <p>We noticed it's been a little while since you've last visited Chatpulse, and your files miss you! Don’t worry, they’re all safe and sound – just waiting for you to dive back in.</p>
  
  <p>With Chatpulse, you can:</p>

  <ul>
    <li><strong>💬 Chat with Your Documents:</strong> Get instant answers from your PDFs and notes like never before.</li>
    <li><strong>📚 Flashcard Creation:</strong> Turn your content into study-ready flashcards effortlessly.</li>
    <li><strong>🧠 AI-Powered Insights:</strong> Need help analyzing or summarizing? Chatpulse's AI is ready to assist.</li>
  </ul>

  <p>Whether you're studying, working, or organizing, Chatpulse is here to help you make the most of your time and simplify your workflow.</p>

  <p>Ready to pick up where you left off? <a href="https://www.chatpulse.dev" style="color: #2E86C1; text-decoration: none;"><strong>Log in now</strong></a> and start chatting with your documents again. 🚀</p>

  <p>If you have any questions or need assistance, feel free to reach out , we're always here to help you get the most out of Chatpulse.</p>

  <p>Best regards,<br>
  The Chatpulse Team 💡</p>
</div>
`,
          subject: "Your Files Are Missing You! Chat with Them Again ⚡",
          timestamp : new Date().toISOString()
        };
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // This is a new user, send their details to the webhook
          await sendToMakeWebhook(userData);
        }
      }
      return true;
    },    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.plan = token.plan;
      }

      return session;
    },

    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        plan: dbUser.plan,
      };
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};