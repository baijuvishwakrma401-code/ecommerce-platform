import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const name = String(body.name || "").trim();
    const slug = String(body.slug || "").trim();
    const sku = String(body.sku || "").trim();
    const categoryId = String(body.categoryId || "").trim();

    const description = body.description
      ? String(body.description).trim()
      : null;

    const price = Number(body.price);

    const compareAtPrice =
      body.compareAtPrice !== "" &&
      body.compareAtPrice !== null &&
      body.compareAtPrice !== undefined
        ? Number(body.compareAtPrice)
        : null;

    const stock = Number(body.stock || 0);

    const imageUrl = body.imageUrl
      ? String(body.imageUrl).trim()
      : null;

    if (!name || !slug || !sku || !categoryId) {
      return NextResponse.json(
        {
          error:
            "Name, slug, SKU and category are required.",
        },
        { status: 400 }
      );
    }

    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Invalid price." },
        { status: 400 }
      );
    }

    if (Number.isNaN(stock) || stock < 0) {
      return NextResponse.json(
        { error: "Invalid stock." },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { sku }],
        NOT: { id },
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          error:
            "Another product with this slug or SKU already exists.",
        },
        { status: 409 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        sku,
        description,
        price,
        compareAtPrice,
        stock,
        isActive: body.isActive !== false,
        isFeatured: body.isFeatured === true,
        categoryId,
      },
    });

    if (imageUrl) {
      const existingPrimary =
        await prisma.productImage.findFirst({
          where: {
            productId: id,
            isPrimary: true,
          },
        });

      if (existingPrimary) {
        await prisma.productImage.update({
          where: {
            id: existingPrimary.id,
          },
          data: {
            url: imageUrl,
            altText: name,
          },
        });
      } else {
        await prisma.productImage.create({
          data: {
            url: imageUrl,
            altText: name,
            sortOrder: 0,
            isPrimary: true,
            productId: id,
          },
        });
      }
    }

    const finalProduct =
      await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
      });

    return NextResponse.json({
      product: finalProduct,
    });
  } catch (error) {
    console.error("[PRODUCTS_PUT_ERROR]", error);

    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("[PRODUCTS_DELETE_ERROR]", error);

    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}