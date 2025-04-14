import { z } from 'zod'

export const createMessageSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  content: z.string().min(1, 'Message content is required'),
  groupId: z.string().min(1, 'Group ID is required'),
})

export const deleteMessageSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  messageId: z.string().min(1, 'Message ID is required'),
})

export const fetchMessagesSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  groupId: z.string().min(1, 'Group ID is required'),
})
