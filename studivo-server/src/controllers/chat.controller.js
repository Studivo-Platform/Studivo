const { ApiError }     = require('../utils/ApiError');
const { ApiResponse }  = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const conversationRepo = require('../repositories/conversation.repository');
const messageRepo      = require('../repositories/message.repository');
const requestRepo      = require('../repositories/request.repository');

// POST /api/chat (or /api/conversations)
// Start or retrieve a conversation between student and seller
const createConversation = asyncHandler(async (req, res) => {
  const { requestId, sellerId, targetUserId, offerId } = req.body;
  const currentUserId = req.user._id.toString();

  const otherUser = targetUserId || sellerId;

  // Direct messaging or Admin messaging without request
  if (!requestId) {
    if (!otherUser) {
      throw new ApiError(400, 'Target user ID or Seller ID is required');
    }
    const conversation = await conversationRepo.findOrCreate({
      participants: [currentUserId, otherUser.toString()],
      offerId,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, conversation, 'Conversation started'));
  }

  // Request-based messaging
  const request = await requestRepo.findById(requestId);
  if (!request) throw new ApiError(404, 'Request not found');

  const studentId = request.userId._id ? request.userId._id.toString() : request.userId.toString();

  let targetSellerId = otherUser;
  if (!targetSellerId && req.user.role === 'seller') {
    targetSellerId = currentUserId;
  }

  if (!targetSellerId) {
    throw new ApiError(400, 'Seller ID is required');
  }

  // Ensure current user is involved or is admin
  if (req.user.role !== 'admin' && currentUserId !== studentId && currentUserId !== targetSellerId.toString()) {
    throw new ApiError(403, 'You can only start conversations for requests you are involved in');
  }

  const conversation = await conversationRepo.findOrCreate({
    participants: [studentId, targetSellerId.toString()],
    requestId,
    offerId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, conversation, 'Conversation started'));
});

// GET /api/conversations/my
// Get all conversations for the logged-in user
const getMyConversations = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;

  const result = await conversationRepo.findByUser(req.user._id, { page, limit });

  return res.json(new ApiResponse(200, result));
});

// GET /api/conversations/:id/messages
// Get paginated message history for a conversation
const getMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Verify user is a participant
  const conversation = await conversationRepo.findByIdAndParticipant(id, req.user._id);
  if (!conversation) throw new ApiError(404, 'Conversation not found or access denied');

  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 50;

  const result = await messageRepo.findByConversation(id, { page, limit });

  // Mark messages as read when fetching history via HTTP
  messageRepo.markAsRead(id, req.user._id).catch(() => {});

  return res.json(new ApiResponse(200, result));
});

module.exports = { createConversation, getMyConversations, getMessages };