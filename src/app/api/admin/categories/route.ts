import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error("[CATEGORIES_GET_ERROR]", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const slug = String(body.slug || "").trim();

    if (!name || !slug) {
      return NextResponse.json(
        {
          error: "Name and slug are required.",
        },
        { status: 400 }
      );
    }

    const duplicate = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            duplicate.name === name
              ? "Category name already exists."
              : "Category slug already exists.",
        },
        { status: 409 }
      );
    }

    const sortOrder = Number(body.sortOrder ?? 0);

    const category = await prisma.category.create({
      data: {
        name,
        slug,

        description: body.description
          ? String(body.description).trim()
          : null,

        imageUrl: body.imageUrl
          ? String(body.imageUrl).trim()
          : null,

        icon: body.icon
          ? String(body.icon).trim()
          : "package",

        sortOrder: Number.isNaN(sortOrder)
          ? 0
          : Math.max(0, sortOrder),

        isActive:
          body.isActive === undefined
            ? true
            : Boolean(body.isActive),
      },
    });

    return NextResponse.json(
      {
        success: true,
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CATEGORIES_POST_ERROR]", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}