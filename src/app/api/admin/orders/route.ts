import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      session.user.accountType !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: true,
        items: true,
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customer?.name ?? "Guest Customer",
      email: order.customer?.email ?? "No email",
      date: order.createdAt.toLocaleDateString("en-IN"),
      items: order.items.length,
      total: Number(order.total),
      status: order.status,
      paymentStatus: order.paymentStatus,
    }));

    return NextResponse.json({
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}