import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[PRODUCTS_GET_ERROR]", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      slug,
      description,
      sku,
      price,
      compareAtPrice,
      stock,
      categoryId,
      imageUrl,
      isActive,
      isFeatured,
    } = body;

    if (!name || !slug || !sku || price === undefined || !categoryId) {
      return NextResponse.json(
        {
          error: "Name, slug, SKU, price and category are required.",
        },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        sku,
        price,
        compareAtPrice:
          compareAtPrice !== undefined && compareAtPrice !== ""
            ? compareAtPrice
            : null,
        stock:
          stock !== undefined && stock !== ""
            ? Number(stock)
            : 0,
        categoryId,
        isActive:
          isActive !== undefined ? Boolean(isActive) : true,
        isFeatured:
          isFeatured !== undefined ? Boolean(isFeatured) : false,

        images: imageUrl
          ? {
              create: {
                url: imageUrl,
                isPrimary: true,
                sortOrder: 0,
              },
            }
          : undefined,
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[PRODUCTS_POST_ERROR]", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      name,
      slug,
      description,
      sku,
      price,
      compareAtPrice,
      stock,
      categoryId,
      isActive,
      isFeatured,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    if (!name || !slug || !sku || price === undefined || !categoryId) {
      return NextResponse.json(
        {
          error: "Name, slug, SKU, price and category are required.",
        },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
        description: description || null,
        sku,
        price,
        compareAtPrice:
          compareAtPrice !== undefined && compareAtPrice !== ""
            ? compareAtPrice
            : null,
        stock:
          stock !== undefined && stock !== ""
            ? Number(stock)
            : 0,
        categoryId,
        isActive:
          isActive !== undefined ? Boolean(isActive) : true,
        isFeatured:
          isFeatured !== undefined ? Boolean(isFeatured) : false,
      },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("[PRODUCTS_PUT_ERROR]", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("[PRODUCTS_DELETE_ERROR]", error);

    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}