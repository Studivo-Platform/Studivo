const { ApiError }     = require('../utils/ApiError');
const { ApiResponse }  = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { Request }      = require('../models/Request');
const { Offer }        = require('../models/Offer');
const { User }         = require('../models/User');
const { searchAmazon, searchNoon } = require('../services/affiliate.service');

const MIN_LOCAL_RESULTS = 3;

// 1. Search Requests
const searchRequests = async ({ q, category, maxPrice, minPrice, limit = 20 }) => {
  const filter = { status: 'open' };
  if (category && category !== 'all') filter['parsedData.category'] = category;
  if (maxPrice) filter['parsedData.budget.max'] = { $lte: maxPrice };
  if (minPrice) filter['parsedData.budget.min'] = { $gte: minPrice };

  if (q && q.trim().length > 0) {
    const regex = new RegExp(q.trim(), 'i');
    filter.$or = [
      { rawText: regex },
      { 'parsedData.title': regex },
      { 'parsedData.keywords': regex },
      { 'parsedData.category': regex },
    ];
  }

  return Request
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name university profileImage')
    .lean();
};

// 2. Search Offers
const searchOffers = async ({ q, limit = 20 }) => {
  const filter = { status: 'pending' };
  if (q && q.trim().length > 0) {
    const regex = new RegExp(q.trim(), 'i');
    filter.description = regex;
  }

  return Offer
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('sellerId', 'name university profileImage phone')
    .populate('requestId', 'rawText parsedData')
    .lean();
};

// 3. Search Sellers
const searchSellers = async ({ q, limit = 20 }) => {
  const filter = { role: 'seller' };
  if (q && q.trim().length > 0) {
    const regex = new RegExp(q.trim(), 'i');
    filter.$or = [
      { name: regex },
      { university: regex },
      { email: regex },
    ];
  }

  return User
    .find(filter)
    .select('name email university phone profileImage isVerified createdAt')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// GET /api/search
const search = asyncHandler(async (req, res) => {
  const { q, category, maxPrice, minPrice, page, limit } = req.query;
  const searchQuery = q ? q.trim() : '';

  const [requests, offers, sellers] = await Promise.all([
    searchRequests({ q: searchQuery, category, maxPrice, minPrice, limit }),
    searchOffers({ q: searchQuery, limit }),
    searchSellers({ q: searchQuery, limit }),
  ]);

  let externalResults = [];
  let triggeredScraper = false;

  if (searchQuery && requests.length < MIN_LOCAL_RESULTS) {
    triggeredScraper = true;
    const searchContext = {
      category: category || 'other',
      keywords: searchQuery.split(' ').filter((w) => w.length > 1),
      budget: { max: maxPrice || null, min: minPrice || null, currency: 'EGP' },
    };

    try {
      const [amazonRes, noonRes] = await Promise.all([
        searchAmazon(searchContext).catch(() => []),
        searchNoon(searchContext).catch(() => []),
      ]);
      externalResults = [
        ...(Array.isArray(amazonRes) ? amazonRes.map((r) => ({ ...r, _source: 'amazon' })) : []),
        ...(Array.isArray(noonRes) ? noonRes.map((r) => ({ ...r, _source: 'noon' })) : []),
      ];
    } catch (e) {
      console.error('[Search] External scrape error:', e.message);
    }
  }

  return res.json(
    new ApiResponse(200, {
      local: requests.map((r) => ({ ...r, _source: 'local' })),
      requests,
      offers,
      sellers,
      external: externalResults,
      meta: {
        query: searchQuery,
        requestsCount: requests.length,
        offersCount: offers.length,
        sellersCount: sellers.length,
        triggeredScraper,
      },
    })
  );
});

// GET /api/search/external
const searchExternal = asyncHandler(async (req, res) => {
  const { q, category, maxPrice } = req.query;
  const searchQuery = q ? q.trim() : '';

  const searchContext = {
    category: category || 'other',
    keywords: searchQuery ? searchQuery.split(' ').filter((w) => w.length > 1) : [],
    budget: { max: maxPrice || null, currency: 'EGP' },
  };

  const scrapers = [
    searchAmazon(searchContext).catch(() => []),
    searchNoon(searchContext).catch(() => []),
  ];

  const allResults = (await Promise.allSettled(scrapers))
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value);

  const externalResults = allResults.map((r) => ({ ...r, _source: r.source || 'external' }));

  return res.json(new ApiResponse(200, { externalResults, query: searchQuery }));
});

module.exports = { search, searchExternal };