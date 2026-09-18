import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BRANDING_KEY = "branding";

const defaultBranding = {
  brandName: "STORE.",
  logoUrl: "",
  mobileLogoUrl: "",
  faviconUrl: "",
  siteTitle: "STORE.",
  siteDescription: "",
};

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: BRANDING_KEY },
    });

    return NextResponse.json({
      branding: setting?.value || defaultBranding,
    });
  } catch (error) {
    console.error("GET /api/settings/branding error:", error);

    return NextResponse.json(
      { error: "Failed to fetch branding settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const branding = {
      brandName:
        String(body.brandName || "").trim() ||
        defaultBranding.brandName,

      logoUrl: String(body.logoUrl || "").trim(),

      mobileLogoUrl: String(body.mobileLogoUrl || "").trim(),

      faviconUrl: String(body.faviconUrl || "").trim(),

      siteTitle:
        String(body.siteTitle || "").trim() ||
        defaultBranding.siteTitle,

      siteDescription:
        String(body.siteDescription || "").trim(),
    };

    const setting = await prisma.siteSetting.upsert({
      where: { key: BRANDING_KEY },

      create: {
        key: BRANDING_KEY,
        value: branding,
        group: "branding",
        isPublic: true,
      },

      update: {
        value: branding,
        group: "branding",
        isPublic: true,
      },
    });

    return NextResponse.json({
      success: true,
      branding: setting.value,
    });
  } catch (error) {
    console.error("PUT /api/settings/branding error:", error);

    return NextResponse.json(
      { error: "Failed to save branding settings" },
      { status: 500 }
    );
  }
}