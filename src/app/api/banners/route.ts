import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      banners,
    });
  } catch (error) {
    console.error("GET /api/banners error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch banners",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = String(body.title || "").trim();
    const imageUrl = String(body.imageUrl || "").trim();

    if (!title) {
      return NextResponse.json(
        {
          error: "Banner title is required",
        },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        {
          error: "Banner image is required",
        },
        { status: 400 }
      );
    }

    const sortOrder = Number(body.sortOrder || 0);

    const banner = await prisma.banner.create({
      data: {
        title,

        subtitle: body.subtitle
          ? String(body.subtitle).trim()
          : null,

        imageUrl,

        mobileImageUrl: body.mobileImageUrl
          ? String(body.mobileImageUrl).trim()
          : null,

        buttonText: body.buttonText
          ? String(body.buttonText).trim()
          : null,

        linkUrl: body.linkUrl
          ? String(body.linkUrl).trim()
          : null,

        sortOrder: Number.isNaN(sortOrder)
          ? 0
          : sortOrder,

        isActive:
          body.isActive === undefined
            ? true
            : Boolean(body.isActive),

        startsAt: body.startsAt
          ? new Date(body.startsAt)
          : null,

        endsAt: body.endsAt
          ? new Date(body.endsAt)
          : null,
      },
    });

    return NextResponse.json(
      {
        banner,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/banners error:", error);

    return NextResponse.json(
      {
        error: "Failed to create banner",
      },
      { status: 500 }
    );
  }
}