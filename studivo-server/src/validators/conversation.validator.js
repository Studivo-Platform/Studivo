const { z } = require("zod");

const createConversationSchema = z.object({
  requestId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid request ID")
    .optional(),
  sellerId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid seller ID")
    .optional(),
  targetUserId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid target user ID")
    .optional(),
  offerId: z
    .string()
    .regex(/^[a-f\d]{24}$/i)
    .optional(),
});

module.exports = { createConversationSchema };
