import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { fetchGroupsSchema } from '../schemas/group'
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    
    const {userId} = fetchGroupsSchema.parse({userId:request.headers.get('x-user-id')})

    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            id: userId
          }
        }
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({groups})
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    )
  }
}
