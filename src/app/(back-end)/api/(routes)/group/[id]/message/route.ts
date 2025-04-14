import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createMessageSchema, deleteMessageSchema, fetchMessagesSchema } from "../../../schemas/message";
import env from "@/app/(back-end)/api/_env/env";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, groupId } = fetchMessagesSchema.parse({
      userId: request.headers.get("x-user-id"),
      groupId: (await params).id,
    });

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const skip = (page - 1) * env.MESSAGE_PER_PAGE;

    const [messages, totalCount] = await Promise.all([
      prisma.message.findMany({
        where: {
          group: {
            id: groupId,
            members: {
              some: {
                id: userId,
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: env.MESSAGE_PER_PAGE,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.message.count({
        where: {
          group: {
            id: groupId,
            members: {
              some: {
                id: userId,
              },
            },
          },
        },
      }),
    ]);

    if (!messages) {
      return NextResponse.json(
        { error: "Group not found or you are not a member" },
        { status: 404 }
      );
    }

    const hasMore = skip + messages.length < totalCount;

    return NextResponse.json({ 
      messages: messages.reverse(),
      hasMore,
      totalCount
    });
  } catch (error) {
    console.error("Error fetching messages:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, groupId, content } = createMessageSchema.parse({
      userId: request.headers.get("x-user-id"),
      groupId: (await params).id,
      ...(await request.json()),
    });


    const isMember = await prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!isMember) {
      return NextResponse.json(
        { error: "You are not a member of this group" },
        { status: 403 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        content,
        groupId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {

    const {messageId,userId} = deleteMessageSchema.parse({...(await request.json()),userId:request.headers.get('x-user-id')});

    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
        userId: userId,
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found or you are not a member" },
        { status: 404 }
      );
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
