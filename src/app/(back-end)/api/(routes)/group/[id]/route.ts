import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getGroupSchema } from "../../schemas/group";

const prisma = new PrismaClient();

// GET /api/group/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, groupId } = getGroupSchema.parse({
      userId: request.headers.get("x-user-id"),
      groupId: (await params).id,
    });

    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or you are not a member" },
        { status: 404 }
      );
    }

    return NextResponse.json({ group });
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
