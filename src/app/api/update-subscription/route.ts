import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { userId, subscriptionId, subscriptionPlan, subscriptionStartDate, subscriptionEndDate } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionId,
        subscriptionPlan,
        plan:'PRO',
        subscriptionStartDate: new Date(subscriptionStartDate),
        subscriptionEndDate: new Date(subscriptionEndDate),
        subscriptionStatus: 'active',
      },
    });
    console.log(updatedUser)
    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ success: false, message: 'Failed to update subscription' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
