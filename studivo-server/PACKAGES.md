# دليل حزم مشروع Studivo Server (package.json)

## 🛠️ تفصيل الحزم واستخداماتها في مشروع Studivo

### 1. الذكاء الاصطناعي وكشط البيانات (AI & Web Scraping)

#### 🤖 `@google/generative-ai`
* **الوظيفة العامة**: المكتبة الرسمية للتكامل مع نماذج الذكاء الاصطناعي من جوجل (Gemini).
* **لماذا استخدمناها في Studivo**: لتزويد الطلاب بمساعد دراسي ذكي، تحليل الطلبات والمناهج، وتوليد اقتراحات ذكية ومخصصة بناءً على سلوك الطالب الدراسي.
* **كيف تشرحها بالإنجليزية**:
  > *"We integrated Gemini AI via the official `@google/generative-ai` SDK to build smart features for students, such as summarizing content and generating study recommendations."*

#### 🕸️ `playwright`
* **الوظيفة العامة**: مكتبة تحكم وأتمتة للمتصفحات الحديثة (Chromium, Firefox, WebKit).
* **لماذا استخدمناها في Studivo**: لكشط وتجميع البيانات (Web Scraping) من مواقع الجامعات أو المنصات التعليمية لجلب المواد الدراسية، المواعيد، والتفاصيل الأكاديمية للمستخدمين تلقائياً.
* **كيف تشرحها بالإنجليزية**:
  > *"We used Playwright for headless browser automation to scrape academic schedules and course details from university websites and store them in our database."*

---

### 2. الاتصال الفوري والمهام الخلفية (Real-time & Background Workers)

#### ⚡ `socket.io`
* **الوظيفة العامة**: تمكين الاتصال ثنائي الاتجاه واللحظي بين المتصفح والخادم (WebSockets).
* **لماذا استخدمناها في Studivo**: لبناء نظام المحادثات الفورية (Real-time Chat) للطلاب، وإرسال الإشعارات والتحذيرات الفورية بمجرد صدورها.
* **كيف تشرحها بالإنجليزية**:
  > *"We used Socket.io to establish a bidirectional, real-time communication channel for our chat system and push notifications."*

#### 🔀 `@socket.io/redis-adapter`
* **الوظيفة العامة**: وسيط يربط غرف ومراسلات Socket.io بقاعدة بيانات Redis.
* **لماذا استخدمناها في Studivo**: لضمان عمل نظام الـ Real-time بشكل صحيح عند توزيع السيرفر على عدة حاويات أو خوادم (Horizontal scaling / Node clustering).
* **كيف تشرحها بالإنجليزية**:
  > *"We utilized the Redis Adapter for Socket.io to share states across multiple server instances, ensuring seamless scalability."*

#### 📥 `bullmq`
* **الوظيفة العامة**: نظام إدارة طوابير المهام القائم على Redis (Message Queue & Background Jobs).
* **لماذا استخدمناها في Studivo**: لمعالجة المهام الثقيلة (مثل عمليات الكشط المكثفة بالـ Playwright، أو إرسال الإيميلات الكثيفة) في عمليات خلفية منفصلة (Background worker processes) حتى لا يتعطل السيرفر الرئيسي للمستخدمين.
* **كيف تشرحها بالإنجليزية**:
  > *"We use BullMQ to handle background job processing and queues asynchronously, preventing heavy operations from blocking the main event loop."*

#### 🏎️ `ioredis`
* **الوظيفة العامة**: مكتبة برمجية متقدمة للاتصال بخادم Redis السريع.
* **لماذا استخدمناها في Studivo**: لتكون محرك الاتصال الأساسي بـ Redis، والذي تعتمد عليه حزم أخرى مثل `bullmq` والـ `redis-adapter` لتخزين البيانات المؤقتة.
* **كيف تشرحها بالإنجليزية**:
  > *"We chose `ioredis` as our high-performance Redis client to power our background queues and pub/sub adapters."*

---

### 3. الحماية والمصادقة (Security & Authentication)

#### 🔑 `bcryptjs`
* **الوظيفة العامة**: تشفير كلمات المرور باستخدام خوارزميات التجزئة المعقدة (Password Hashing).
* **لماذا استخدمناها في Studivo**: لتأمين كلمات مرور المستخدمين؛ حيث لا يتم حفظ كلمة المرور نصاً صريحاً في MongoDB، بل تُشفّر بأسلوب الـ Salt لضمان حمايتها.
* **كيف تشرحها بالإنجليزية**:
  > *"We use bcrypt for secure password hashing and salting to ensure that user credentials are protected against security leaks."*

#### 🎫 `jsonwebtoken` (JWT)
* **الوظيفة العامة**: إنشاء وإدارة رموز الوصول الآمنة (JSON Web Tokens).
* **لماذا استخدمناها في Studivo**: لإدارة جلسات المستخدمين بطريقة لا تعتمد على السيرفر (Stateless Authentication) وحماية مسارات الـ API الحساسة عبر الـ Middleware.
* **كيف تشرحها بالإنجليزية**:
  > *"We implemented stateless session management using JSON Web Tokens (JWT) for authentication and securing API endpoints."*

#### 🛡️ `passport` & `passport-google-oauth20`
* **الوظيفة العامة**: نظام مصادقة مرن يدعم استراتيجيات متعددة، وفي هذه الحالة الاتصال بحسابات Google.
* **لماذا استخدمناها في Studivo**: لتمكين الطلاب من تسجيل الدخول السريع وبلمسة واحدة باستخدام حسابات Google الخاصة بهم (Single Sign-On).
* **كيف تشرحها بالإنجليزية**:
  > *"We integrated Passport with the Google OAuth 2.0 strategy to offer social login functionality (Single Sign-On) for users."*

#### 🧱 `helmet`
* **الوظيفة العامة**: تأمين ترويسات الاستجابة الـ HTTP (HTTP Headers).
* **لماذا استخدمناها في Studivo**: لرفع مستوى أمان التطبيق وحمايته من الثغرات الأمنية المعروفة (مثل Clickjacking و XSS).
* **كيف تشرحها بالإنجليزية**:
  > *"We use Helmet middleware to secure HTTP headers and protect our application from common web vulnerabilities."*

#### 🛑 `express-rate-limit`
* **الوظيفة العامة**: تحديد عدد الطلبات المسموح بها لكل مستخدم/جهاز في فترة زمنية محددة.
* **لماذا استخدمناها في Studivo**: لمنع الهجمات التي تحاول إغراق الخادم بالطلبات (DDoS attacks) وحماية مسارات تسجيل الدخول من التخمين المتكرر (Brute-force attacks).
* **كيف تشرحها بالإنجليزية**:
  > *"We applied rate limiting to prevent abuse, protect our APIs from DDoS attacks, and block brute-force attempts."*

#### 🧼 `express-mongo-sanitize`
* **الوظيفة العامة**: تطهير مدخلات المستخدمين من الرموز البرمجية الخاصة بـ MongoDB.
* **لماذا استخدمناها في Studivo**: لحظر محاولات الاختراق التي تحاول إرسال مدخلات تحتوي على مشغلات مثل (`$` أو `.`) بهدف تخريب أو قراءة قاعدة البيانات دون تصريح.
* **كيف تشرحها بالإنجليزية**:
  > *"We use this package to sanitize user input and prevent NoSQL Query Injection attacks on our MongoDB database."*

---

### 4. خادم الويب الأساسي وقواعد البيانات (Core Server & Database)

#### 🌐 `express`
* **الوظيفة العامة**: إطار عمل خادم الويب السريع والخفيف لبناء تطبيقات Node.js.
* **لماذا استخدمناها في Studivo**: لتهيئة مسارات الـ API (Routing)، واستقبال الطلبات وإرسال الاستجابات، وربط الـ Middlewares ببعضها.
* **كيف تشرحها بالإنجليزية**:
  > *"Express is the core backend framework we use to build our RESTful API and handle routing and request parsing."*

#### 💾 `mongoose`
* **الوظيفة العامة**: وسيط برمجي للتعامل مع قاعدة بيانات MongoDB (Object Document Mapper - ODM).
* **لماذا استخدمناها في Studivo**: لتحديد هياكل البيانات (Schemas) للمستخدمين، الطلبات، والمواد الدراسية، وتسهيل إجراء الاستعلامات والعمليات على قاعدة البيانات.
* **كيف تشرحها بالإنجليزية**:
  > *"We use Mongoose as our MongoDB ODM to define data schemas, enforce validation, and handle database queries."*

#### 🛠️ `zod`
* **الوظيفة العامة**: مكتبة قوية للتحقق الصارم من هيكل وصحة البيانات (Data Validation).
* **لماذا استخدمناها في Studivo**: للتأكد من أن البيانات القادمة من الواجهة الأمامية (مثل البريد الإلكتروني، الهواتف، النصوص) صحيحة تماماً ومطابقة للشروط قبل إدخالها إلى المنطق البرمجي للسيرفر أو قاعدة البيانات.
* **كيف تشرحها بالإنجليزية**:
  > *"We utilize Zod for runtime schema validation on all incoming request payloads to ensure data integrity."*

#### 📁 `multer`
* **الوظيفة العامة**: برمجية وسيطة للتعامل مع ملفات `multipart/form-data` المستخدمة في رفع الملفات.
* **لماذا استخدمناها في Studivo**: لمعالجة ورفع الملفات التي يقوم الطلاب بتحميلها (مثل صور الحسابات الشخصية، مستندات المواد، ملفات الشرح).
* **كيف تشرحها بالإنجليزية**:
  > *"We use Multer as middleware to handle file uploads and multipart/form-data requests."*

#### ☁️ `cloudinary`
* **الوظيفة العامة**: مكتبة برمجية لرفع وتخزين وإدارة الصور والملفات سحابياً.
* **لماذا استخدمناها في Studivo**: لحفظ وتخزين صور الحسابات الشخصية وملفات الطلاب في مساحة تخزين سحابية آمنة ومحسنة الأداء دون تحميل خادم الاستضافة أوزاناً إضافية.
* **كيف تشرحها بالإنجليزية**:
  > *"We integrated Cloudinary SDK to upload, optimize, and serve user media assets from cloud storage."*

#### 📧 `@sendgrid/mail`
* **الوظيفة العامة**: حزمة إرسال رسائل البريد الإلكتروني عبر خدمة SendGrid الشهيرة.
* **لماذا استخدمناها في Studivo**: لإرسال رسائل البريد التلقائية الهامة (Transactional Emails) مثل ترحيب بالطلاب الجدد، كود التحقق من الحساب، وروابط استرجاع الحسابات.
* **كيف تشرحها بالإنجليزية**:
  > *"We use SendGrid to dispatch transactional emails like account verifications and password resets."*

#### ⚙️ `dotenv`
* **الوظيفة العامة**: تحميل متغيرات البيئة من ملف خارجي باسم `.env` إلى الكود.
* **لماذا استخدمناها في Studivo**: لإبعاد المعلومات السرية للربط (مثل رابط قاعدة البيانات، مفاتيح API لجوجل وكلاوديناري) عن الكود البرمجي لضمان عدم تسريبها.
* **كيف تشرحها بالإنجليزية**:
  > *"We use `dotenv` to load environment variables and secure sensitive API keys and database credentials."*

#### 🔗 `cors`
* **الوظيفة العامة**: تفعيل ومشاركة الموارد بين نطاقات مختلفة (Cross-Origin Resource Sharing).
* **لماذا استخدمناها في Studivo**: للسماح لتطبيق الـ Frontend (الموجود على نطاق أو بورت مختلف) بالتخاطب وإرسال طلبات الـ HTTP إلى خادم الـ API بسلاسة ودون حجب من المتصفح.
* **كيف تشرحها بالإنجليزية**:
  > *"We configured CORS middleware to allow resource sharing and request handling between the frontend app and the backend API."*

#### 🍪 `cookie-parser`
* **الوظيفة العامة**: تحليل وقراءة ملفات الكوكيز المرفقة مع الطلب.
* **لماذا استخدمناها في Studivo**: لقراءة ملفات الكوكيز والـ Tokens المخزنة في متصفح المستخدم للتحقق من هويته وجلسته الحالية.
* **كيف تشرحها بالإنجليزية**:
  > *"We use `cookie-parser` to parse credentials and tokens sent via client cookies."*

#### 🪵 `morgan`
* **الوظيفة العامة**: تسجيل عمليات وطلبات الـ HTTP وتفاصيلها على الكونسول (Request Logger).
* **لماذا استخدمناها في Studivo**: لمراقبة وتتبع الطلبات والأخطاء وحالة الاستجابة (Status code) أثناء التطوير المحلي لجعل عملية التنقيح أسهل.
* **كيف تشرحها بالإنجليزية**:
  > *"We use Morgan as our HTTP request logger to debug routes and analyze API response times during development."*

---

### 5. أدوات الاختبار والتطوير المحلي (Testing & DevTools)

#### 🧪 `jest` & `@jest/globals`
* **الوظيفة العامة**: بيئة اختبار برمجية لتشغيل وفحص الكود آلياً.
* **لماذا استخدمناها في Studivo**: لكتابة واختبار الوحدات البرمجية للتأكد من خلو المسارات والعمليات المعقدة من الأخطاء المنطقية قبل رفعها للإنتاج.
* **كيف تشرحها بالإنجليزية**:
  > *"We use Jest as our main testing framework to write and execute unit and integration tests."*

#### 📡 `supertest`
* **الوظيفة العامة**: مكتبة لاختبار طلبات ومسارات الـ HTTP.
* **لماذا استخدمناها في Studivo**: للقيام باختبارات تكاملية على الروابط والـ Endpoints والتأكد من أنها ترسل الاستجابة المناسبة عند تلقيها لطلبات وهمية.
* **كيف تشرحها بالإنجليزية**:
  > *"We coupled Supertest with Jest to perform integration tests on our REST API endpoints without running the server manually."*
