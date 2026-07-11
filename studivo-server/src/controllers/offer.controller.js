const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const offerRepo = require("../repositories/offer.repository");
const requestRepo = require("../repositories/request.repository");
const cloudinaryService = require("../services/cloudinary.service");
const { emitNewOffer } = require("../socket/events/request.events");
const { createAndEmit } = require("../services/notification.service");

const MAX_OFFERS_PER_SELLER = 3;

// POST /api/offers
// Seller submits an offer on a student request
const createOffer = asyncHandler(async (req, res) => {
  const { requestId, price, description, deliveryNote } = req.body;
  const sellerId = req.user._id;

  // 1. Verify the request exists and is still open
  const request = await requestRepo.findById(requestId);
  if (!request) 
    throw new ApiError(404, "Request not found");

  if (request.status !== "open")
    throw new ApiError(400, "This request is no longer accepting offers");

  // 2. Prevent seller from offering on their own request (if they somehow have both roles)
  const ownerId = request.userId?._id ? request.userId._id.toString() : request.userId ? request.userId.toString() : "";
  const sellerIdStr = sellerId?._id ? sellerId._id.toString() : sellerId ? sellerId.toString() : "";
  if (ownerId && sellerIdStr && ownerId === sellerIdStr) {
    throw new ApiError(400, "You cannot submit an offer on your own request");
  }

  // 3. Enforce max 3 offers per seller per request
  const existingCount = await offerRepo.countBySellerAndRequest(
    sellerId,
    requestId,
  );
  if (existingCount >= MAX_OFFERS_PER_SELLER) {
    throw new ApiError(
      400,
      `You can only submit ${MAX_OFFERS_PER_SELLER} offers per request`,
    );
  }

  console.log("[OfferController] Received req.files count:", req.files ? req.files.length : 0);
  const uploadedImages = await cloudinaryService.uploadImages(req.files ?? [], {
    folder: "studivo/offers",
  });

  const images = uploadedImages.map((img) => ({
    url: img.url,
    publicId: img.publicId,
  }));
  console.log("[OfferController] Uploaded images result count:", images.length);

  // 5. Create the offer
  const offer = await offerRepo.create({
    requestId,
    sellerId,
    price,
    description,
    deliveryNote,
    images,
  });

  // 6. Notify the student via Socket.IO
  try {
    emitNewOffer(req.io, {
      requestId,
      offerId: offer._id,
      price,
      sellerName: req.user.name,
      studentUserId: ownerId,
    });
  } catch {
    // Skip if socket not initialized
  }

  // Notify the student who owns the request
  createAndEmit({
    userId: ownerId,
    type: "new_offer",
    message: `وصول عرض جديد من البائع (${req.user.name}) بقيمة ${price} ج.م على طلبك`,
    resourceId: request._id,
    resourceType: "Request",
    io: req.io,
  }).catch(() => {});
  
  return res
    .status(201)
    .json(new ApiResponse(201, offer, "Offer submitted successfully"));
});

// GET /api/offers/request/:requestId
// Get all offers for a request (student sees this)
const getOffersByRequest = asyncHandler(async (req, res) => {
  const offers = await offerRepo.findByRequest(req.params.requestId);
  return res.json(new ApiResponse(200, offers));
});

// GET /api/offers/my
// Seller sees their own offers
const getMyOffers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await offerRepo.findBySeller(req.user._id, { page, limit });
  return res.json(new ApiResponse(200, result));
});

// GET /api/offers/received
// Student sees offers submitted on their requests
const getReceivedOffers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await offerRepo.findByStudent(req.user._id, { page, limit });
  return res.json(new ApiResponse(200, result));
});

// PATCH /api/offers/:id
// Seller updates their own offer
const updateOffer = asyncHandler(async (req, res) => {
  const offer = await offerRepo.findByIdAndSeller(req.params.id, req.user._id);
  if (!offer)
    throw new ApiError(404, "Offer not found or you are not the owner");

  if (offer.status !== "pending") {
    throw new ApiError(400, "Only pending offers can be updated");
  }

  const updateData = { ...req.body };

  if (req.files && req.files.length > 0) {
    const uploadedImages = await cloudinaryService.uploadImages(req.files, {
      folder: "studivo/offers",
    });
    const newImages = uploadedImages.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    }));

    let keptImages = offer.images || [];
    if (req.body.existingImages) {
      try {
        const parsed = typeof req.body.existingImages === "string" ? JSON.parse(req.body.existingImages) : req.body.existingImages;
        if (Array.isArray(parsed)) {
          keptImages = offer.images.filter((img) => parsed.includes(img.url));
        }
      } catch (e) {}
    }
    updateData.images = [...keptImages, ...newImages];
  } else if (req.body.existingImages !== undefined) {
    try {
      const parsed = typeof req.body.existingImages === "string" ? JSON.parse(req.body.existingImages) : req.body.existingImages;
      if (Array.isArray(parsed)) {
        updateData.images = offer.images.filter((img) => parsed.includes(img.url));
      }
    } catch (e) {}
  }

  const updated = await offerRepo.update(req.params.id, updateData);
  return res.json(new ApiResponse(200, updated, "Offer updated successfully"));
});

// DELETE /api/offers/:id
// Seller withdraws their offer (soft delete)
const withdrawOffer = asyncHandler(async (req, res) => {
  const offer = await offerRepo.findByIdAndSeller(req.params.id, req.user._id);
  if (!offer)
    throw new ApiError(404, "Offer not found or you are not the owner");

  if (offer.status === "withdrawn") {
    throw new ApiError(400, "Offer is already withdrawn");
  }

  await offerRepo.withdraw(req.params.id);
  return res.json(new ApiResponse(200, null, "Offer withdrawn successfully"));
});

module.exports = {
  createOffer,
  getOffersByRequest,
  getMyOffers,
  getReceivedOffers,
  updateOffer,
  withdrawOffer,
};
