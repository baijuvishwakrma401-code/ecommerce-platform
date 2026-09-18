import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const body = await request.json();

    const title = String(body.title || "").trim();
    const imageUrl = String(body.imageUrl || "").trim();

    if (!title) {
      return NextResponse.json(
        { error: "Banner title is required" },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Banner image is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.banner.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }

    const banner = await prisma.banner.update({
      where: {
        id: params.id,
      },
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

        sortOrder: Number(body.sortOrder || 0),

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

    return NextResponse.json({
      banner,
    });
  } catch (error) {
    console.error(
      "PUT /api/banners/[id] error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const existing = await prisma.banner.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }

    await prisma.banner.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/banners/[id] error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}