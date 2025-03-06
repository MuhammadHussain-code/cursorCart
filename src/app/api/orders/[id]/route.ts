import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const unwrappedParams = await params;
    const orderId = unwrappedParams.id;

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch the order
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
        address: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Check if the order belongs to the authenticated user
    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized to view this order" },
        { status: 403 }
      );
    }

    // Format the order data for the response
    const formattedOrder = {
      id: order.id,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentIntentId: order.paymentIntentId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images[0] || "",
      })),
      address: {
        street: order.address.street,
        city: order.address.city,
        state: order.address.state,
        zipCode: order.address.zipCode,
        country: order.address.country,
      },
    };

    return NextResponse.json({ order: formattedOrder });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the order" },
      { status: 500 }
    );
  }
} 