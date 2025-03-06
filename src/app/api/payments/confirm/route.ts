import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

const prisma = new PrismaClient();

const PaymentConfirmSchema = z.object({
  orderId: z.string().uuid(),
  paymentIntentId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const result = PaymentConfirmSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { orderId, paymentIntentId } = result.data;

    // Fetch the order
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Check if the order belongs to the authenticated user
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized to update this order" },
        { status: 403 }
      );
    }

    // Check if the payment intent matches
    if (order.paymentIntentId !== paymentIntentId) {
      return NextResponse.json(
        { message: "Invalid payment information" },
        { status: 400 }
      );
    }

    // In a real application, you would verify the payment with Stripe here
    // For this demo, we'll simulate a successful payment

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: "COMPLETED",
        status: "PROCESSING",
      },
    });

    return NextResponse.json({
      message: "Payment confirmed successfully",
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      { message: "An error occurred while confirming payment" },
      { status: 500 }
    );
  }
} 