import { z } from 'zod'

export const getGroupSchema = z.object({
  userId: z.string()
    .min(1, 'User ID is required'),
  groupId: z.string()
    .min(1, 'Group ID is required')
})


export const fetchGroupsSchema = z.object({
  userId: z.string()
    .min(1, 'User ID is required')
})