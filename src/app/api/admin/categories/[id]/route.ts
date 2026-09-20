import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params;
    const body = await req.json();

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    const name = String(body.name || "").trim();
    const slug = String(body.slug || "").trim();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required." },
        { status: 400 }
      );
    }

    const duplicate = await prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
        NOT: { id },
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

    const category = await prisma.category.update({
      where: { id },
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
            ? existingCategory.isActive
            : Boolean(body.isActive),
      },
    });

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("[CATEGORY_PUT_ERROR]", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params;

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    const productCount = await prisma.product.count({
      where: {
        categoryId: id,
      },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `This category has ${productCount} product(s). Please move or delete those products first.`,
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("[CATEGORY_DELETE_ERROR]", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}