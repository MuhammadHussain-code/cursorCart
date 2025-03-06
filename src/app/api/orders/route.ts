import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createPaymentIntent } from "@/lib/stripe";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema for order creation
const OrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      image: z.string(),
    })
  ),
  paymentMethod: z.enum(["STRIPE", "CASH_ON_DELIVERY"]),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const result = OrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { items, paymentMethod, address } = result.data;

    // Calculate total price
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      // Create address record
      const shippingAddress = await prisma.address.create({
        data: {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
          userId: session.user.id,
        },
      });

      // Initialize payment intent for Stripe payments
      let paymentIntentId = null;
      if (paymentMethod === "STRIPE") {
        try {
          const paymentIntent = await createPaymentIntent(total, "usd", {
            userId: session.user.id,
          });
          paymentIntentId = paymentIntent.id;
        } catch (error) {
          console.error("Error creating payment intent:", error);
          // Still create the order but mark it as pending
        }
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          total,
          paymentMethod,
          paymentStatus: paymentMethod === "STRIPE" ? "PENDING" : "PENDING",
          paymentIntentId,
          addressId: shippingAddress.id,
          orderItems: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      return NextResponse.json(
        {
          message: "Order created successfully",
          order: {
            id: order.id,
            total: order.total,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            paymentIntentId: order.paymentIntentId,
          },
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database error during order creation:", dbError);
      return NextResponse.json(
        { message: "Failed to save order information" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the order" },
      { status: 500 }
    );
  }
} 