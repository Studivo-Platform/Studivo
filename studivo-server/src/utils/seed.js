/**
 * Studivo — Database Seed Script
 * 
 * Creates initial test data:
 *   - 1 Admin user
 *   - 2 Students  
 *   - 2 Sellers
 *   - 5 Student requests (with AI-parsed data)
 *   - 4 Seller offers on those requests
 *   - 2 Conversations with messages
 *   - 5 Notifications
 * 
 * Usage:  npm run seed
 * Reset:  npm run seed -- --reset  (drops existing data first)
 */

require('dotenv').config();
const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const { env }   = require('../config/env');

// Models
const { User }         = require('../models/User');
const { Request }      = require('../models/Request');
const { Offer }        = require('../models/Offer');
const { Conversation } = require('../models/Conversation');
const { Message }      = require('../models/Message');
const { Notification } = require('../models/Notification');

// ─── Seed Data ────────────────────────────────────────────

const SALT_ROUNDS = 12;

async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function seed() {
  const reset = process.argv.includes('--reset');

  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    if (reset) {
      console.log('🗑️  Resetting database...');
      await Promise.all([
        User.deleteMany({}),
        Request.deleteMany({}),
        Offer.deleteMany({}),
        Conversation.deleteMany({}),
        Message.deleteMany({}),
        Notification.deleteMany({}),
      ]);
      console.log('   All collections cleared.');
    }

    // Check if data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0 && !reset) {
      console.log(`⚠️  Database already has ${existingUsers} users. Use --reset to clear first.`);
      process.exit(0);
    }

    const password = await hashPassword('Test@1234');

    // ── 1. Users ──────────────────────────────────────────
    console.log('\n👤 Creating users...');
    const [admin, student1, student2, seller1, seller2] = await User.insertMany([
      {
        name: 'Admin Studivo',
        email: 'admin@studivo.com',
        password,
        role: 'admin',
        isVerified: true,
        isProfileCompleted: true,
        phone: '01000000000',
      },
      {
        name: 'أحمد محمد',
        email: 'ahmed@student.com',
        password,
        role: 'student',
        isVerified: true,
        isProfileCompleted: true,
        university: 'جامعة المنصورة',
        phone: '01111111111',
      },
      {
        name: 'Sara Ali',
        email: 'sara@student.com',
        password,
        role: 'student',
        isVerified: true,
        isProfileCompleted: true,
        university: 'Mansoura University',
        phone: '01222222222',
      },
      {
        name: 'محل الأمير للإلكترونيات',
        email: 'emir@seller.com',
        password,
        role: 'seller',
        isVerified: true,
        isProfileCompleted: true,
        phone: '01033333333',
      },
      {
        name: 'BookWorm Store',
        email: 'books@seller.com',
        password,
        role: 'seller',
        isVerified: true,
        isProfileCompleted: true,
        phone: '01044444444',
      },
    ]);
    console.log(`   ✅ ${5} users created`);

    // ── 2. Student Requests ───────────────────────────────
    console.log('\n📝 Creating student requests...');
    const requests = await Request.insertMany([
      {
        userId: student1._id,
        rawText: 'محتاج لابتوب للبرمجة، رام ١٦ جيجا، بروسيسور i7 على الأقل، الميزانية ١٥٠٠٠ جنيه',
        parsedData: {
          category: 'electronics',
          subCategory: 'laptop',
          specs: { ram: '16GB', cpu: 'i7', usage: 'programming' },
          budget: { min: 12000, max: 15000, currency: 'EGP' },
          location: 'المنصورة',
          keywords: ['laptop', 'لابتوب', 'برمجة', 'i7', '16GB'],
        },
        status: 'open',
      },
      {
        userId: student1._id,
        rawText: 'عايز شقة ايجار قريبة من جامعة المنصورة، غرفتين، الايجار لا يتجاوز ٣٠٠٠ جنيه',
        parsedData: {
          category: 'housing',
          subCategory: 'apartment',
          specs: { rooms: '2', type: 'rent' },
          budget: { min: 1500, max: 3000, currency: 'EGP' },
          location: 'المنصورة - قريبة من الجامعة',
          keywords: ['شقة', 'ايجار', 'جامعة', 'المنصورة', 'غرفتين'],
        },
        status: 'open',
      },
      {
        userId: student2._id,
        rawText: 'Looking for a Data Structures and Algorithms textbook, CLRS edition preferred, budget up to 500 EGP',
        parsedData: {
          category: 'books',
          subCategory: 'textbook',
          specs: { title: 'CLRS', subject: 'Data Structures and Algorithms' },
          budget: { min: 100, max: 500, currency: 'EGP' },
          location: null,
          keywords: ['CLRS', 'data structures', 'algorithms', 'textbook'],
        },
        status: 'open',
      },
      {
        userId: student2._id,
        rawText: 'Need a reliable Android phone under 5000 EGP, good camera preferred',
        parsedData: {
          category: 'electronics',
          subCategory: 'phone',
          specs: { os: 'Android', camera: 'good' },
          budget: { min: 3000, max: 5000, currency: 'EGP' },
          location: null,
          keywords: ['android', 'phone', 'camera', 'mobile'],
        },
        status: 'open',
      },
      {
        userId: student1._id,
        rawText: 'محتاج حد يعمل تصميم لوجو لمشروع التخرج، مش غالي',
        parsedData: {
          category: 'services',
          subCategory: 'logo design',
          specs: { type: 'graduation project logo' },
          budget: { min: 100, max: 500, currency: 'EGP' },
          location: null,
          keywords: ['لوجو', 'تصميم', 'مشروع تخرج', 'logo', 'design'],
        },
        status: 'open',
      },
    ]);
    console.log(`   ✅ ${requests.length} requests created`);

    // ── 3. Seller Offers ──────────────────────────────────
    console.log('\n💰 Creating seller offers...');
    const offers = await Offer.insertMany([
      {
        requestId: requests[0]._id, // laptop request
        sellerId: seller1._id,
        price: 14500,
        description: 'لابتوب Lenovo IdeaPad 5 Pro — رام ١٦ جيجا، بروسيسور i7 الجيل ١٢، SSD 512، شاشة ١٤ بوصة 2.2K، حالة ممتازة، الضمان لسه ساري ٦ شهور',
        status: 'pending',
        deliveryNote: 'التسليم من المحل في شارع الجمهورية، المنصورة',
      },
      {
        requestId: requests[0]._id, // laptop request — second offer
        sellerId: seller2._id,
        price: 13800,
        description: 'HP Pavilion 15 — i7 Gen 11, 16GB RAM, 512GB SSD, NVIDIA MX450, used 6 months, excellent condition, original charger and box included',
        status: 'pending',
        deliveryNote: 'Can deliver to campus',
      },
      {
        requestId: requests[2]._id, // CLRS book request
        sellerId: seller2._id,
        price: 350,
        description: 'Introduction to Algorithms (CLRS) 3rd Edition — slightly used, all pages intact, no highlights. Bought it last semester and finished the course.',
        status: 'pending',
        deliveryNote: 'Meet at university library',
      },
      {
        requestId: requests[3]._id, // phone request
        sellerId: seller1._id,
        price: 4800,
        description: 'Samsung Galaxy A54 — حالة زيرو، شاشة Super AMOLED ١٢٠ هيرتز، كاميرا ٥٠ ميجا، بطارية ٥٠٠٠ مللي أمبير، معاه الكرتونة والشاحن الأصلي',
        status: 'pending',
        deliveryNote: 'التسليم من المحل أو نتقابل في الجامعة',
      },
    ]);
    console.log(`   ✅ ${offers.length} offers created`);

    // ── 4. Conversations + Messages ───────────────────────
    console.log('\n💬 Creating conversations and messages...');

    // Conversation 1: student1 ↔ seller1 about laptop
    const conv1Key = [student1._id, seller1._id].sort().join('_') + '_' + requests[0]._id;
    const conv1 = await Conversation.create({
      conversationKey: conv1Key,
      participants: [student1._id, seller1._id],
      requestId: requests[0]._id,
      offerId: offers[0]._id,
      lastMessage: 'لا، الضمان الرسمي من لينوفو لسه ساري',
      lastMessageAt: new Date(),
      lastSenderId: seller1._id,
      status: 'active',
    });

    await Message.insertMany([
      {
        conversationId: conv1._id,
        senderId: student1._id,
        text: 'السلام عليكم، اللابتوب ده لسه عليه ضمان؟',
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        conversationId: conv1._id,
        senderId: seller1._id,
        text: 'وعليكم السلام، أيوا لسه عليه ٦ شهور ضمان',
        createdAt: new Date(Date.now() - 3000000),
      },
      {
        conversationId: conv1._id,
        senderId: student1._id,
        text: 'ده ضمان المحل ولا الشركة؟',
        createdAt: new Date(Date.now() - 2400000),
      },
      {
        conversationId: conv1._id,
        senderId: seller1._id,
        text: 'لا، الضمان الرسمي من لينوفو لسه ساري',
        createdAt: new Date(Date.now() - 1800000),
      },
    ]);

    // Conversation 2: student2 ↔ seller2 about CLRS book
    const conv2Key = [student2._id, seller2._id].sort().join('_') + '_' + requests[2]._id;
    const conv2 = await Conversation.create({
      conversationKey: conv2Key,
      participants: [student2._id, seller2._id],
      requestId: requests[2]._id,
      offerId: offers[2]._id,
      lastMessage: 'Sure! Tomorrow at 2pm at the main library?',
      lastMessageAt: new Date(),
      lastSenderId: student2._id,
      status: 'active',
    });

    await Message.insertMany([
      {
        conversationId: conv2._id,
        senderId: student2._id,
        text: 'Hi! Is the CLRS book still available?',
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        conversationId: conv2._id,
        senderId: seller2._id,
        text: 'Yes! It\'s in great condition. When would you like to meet?',
        createdAt: new Date(Date.now() - 6600000),
      },
      {
        conversationId: conv2._id,
        senderId: student2._id,
        text: 'Sure! Tomorrow at 2pm at the main library?',
        createdAt: new Date(Date.now() - 6000000),
      },
    ]);

    console.log('   ✅ 2 conversations with 7 messages created');

    // ── 5. Notifications ──────────────────────────────────
    console.log('\n🔔 Creating notifications...');
    await Notification.insertMany([
      {
        userId: student1._id,
        type: 'new_offer',
        message: 'محل الأمير قدم عرض على طلب اللابتوب — ١٤,٥٠٠ ج.م',
        resourceId: offers[0]._id,
        resourceType: 'Offer',
      },
      {
        userId: student1._id,
        type: 'new_offer',
        message: 'BookWorm Store submitted an offer on your laptop request — 13,800 EGP',
        resourceId: offers[1]._id,
        resourceType: 'Offer',
      },
      {
        userId: student2._id,
        type: 'new_offer',
        message: 'BookWorm Store submitted an offer on your CLRS book request — 350 EGP',
        resourceId: offers[2]._id,
        resourceType: 'Offer',
      },
      {
        userId: seller1._id,
        type: 'new_request',
        message: 'طلب جديد في الإلكترونيات — لابتوب للبرمجة، ميزانية ١٥,٠٠٠ ج.م',
        resourceId: requests[0]._id,
        resourceType: 'Request',
      },
      {
        userId: seller2._id,
        type: 'new_request',
        message: 'New request in Books — CLRS textbook, budget 500 EGP',
        resourceId: requests[2]._id,
        resourceType: 'Request',
      },
    ]);
    console.log('   ✅ 5 notifications created');

    // ── Summary ───────────────────────────────────────────
    console.log('\n' + '═'.repeat(50));
    console.log('🎉 Seed complete!');
    console.log('═'.repeat(50));
    console.log(`
  📋 Summary:
    • 5 Users (1 admin + 2 students + 2 sellers)
    • 5 Student Requests
    • 4 Seller Offers  
    • 2 Conversations (7 messages)
    • 5 Notifications

  🔐 Login credentials (all same password):
    • Admin:    admin@studivo.com    / Test@1234
    • Student:  ahmed@student.com    / Test@1234
    • Student:  sara@student.com     / Test@1234
    • Seller:   emir@seller.com      / Test@1234
    • Seller:   books@seller.com     / Test@1234
    `);

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
