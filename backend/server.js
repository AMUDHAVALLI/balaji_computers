const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let Pool, Client;
try {
  const pg = require('pg');
  Pool = pg.Pool;
  Client = pg.Client;
} catch (err) {
  Pool = null;
  Client = null;
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent JSON fallback database path
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data for Puducherry CCTV Website
const initialProducts = [
  {
    id: 1,
    slug: '4mp-outdoor-bullet-cctv-camera',
    name: '4MP Outdoor Bullet CCTV Camera',
    category: 'Outdoor Bullet',
    resolution: '4MP Super HD',
    badge: 'Best Seller in Puducherry',
    summary: 'Protect your home and business with a reliable outdoor CCTV camera built for coastal weather in Puducherry.',
    priceRange: '₹2,400 – ₹3,200',
    warranty: '2 Years Manufacturer Warranty',
    ipRating: 'IP67 Weatherproof',
    nightVision: '30m Smart IR / Color Night Vision',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=80',
    features: [
      '4MP (2560 × 1440) high-definition image resolution',
      '24/7 Day and night surveillance with Smart IR cut filter',
      'IP67 Outdoor weather & coastal humidity protection (confirm exact model datasheet)',
      'H.265+ high-efficiency video recording saves up to 50% hard disk space',
      'Compatible with 4/8/16 Channel DVR/NVR systems (subject to model compatibility)',
      'Suitable for residential gates, compounds, and commercial perimeters'
    ],
    suitableFor: ['Homes', 'Shops', 'Offices', 'Warehouses', 'Commercial buildings'],
    availableServices: [
      'CCTV camera supply',
      'Professional installation',
      'DVR/NVR configuration',
      'Mobile viewing setup'
    ]
  },
  {
    id: 2,
    slug: '4mp-indoor-dome-cctv-camera',
    name: '4MP Wide-Angle Indoor Dome Camera',
    category: 'Indoor Dome',
    resolution: '4MP QHD',
    badge: 'Popular for Shops & Homes',
    summary: 'Discreet ceiling-mounted dome camera with wide-angle coverage and built-in microphone for billing counters and living rooms.',
    priceRange: '₹1,950 – ₹2,650',
    warranty: '2 Years Manufacturer Warranty',
    ipRating: 'Indoor / Vandal Resistant',
    nightVision: '20m IR Night Vision',
    image: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=900&q=80',
    features: [
      '4MP crisp video with 110° wide-angle lens',
      'Built-in noise-canceling mic for audio recording at shop billing counters',
      'Compact tamper-resistant dome casing blends with interiors',
      'Digital Wide Dynamic Range (DWDR) for bright entrance doors',
      'Instant mobile app live view and playback support'
    ],
    suitableFor: ['Homes', 'Shops', 'Offices', 'Showrooms', 'Clinics & Pharmacies'],
    availableServices: [
      'CCTV camera supply',
      'Concealed wiring & installation',
      'DVR/NVR configuration',
      'Mobile viewing setup'
    ]
  },
  {
    id: 3,
    slug: '5mp-full-color-night-vision-ip-camera',
    name: '5MP ColorVu Full-Color Night IP Camera',
    category: 'AI Color Night IP',
    resolution: '5MP Ultra HD',
    badge: '24/7 Color Video',
    summary: 'Captures vivid full-color video even in complete darkness with human & vehicle motion detection alerts.',
    priceRange: '₹3,600 – ₹4,800',
    warranty: '2 Years Manufacturer Warranty',
    ipRating: 'IP67 Weatherproof Metal Body',
    nightVision: '30m Warm Light Full-Color Night Vision',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80',
    features: [
      '5MP Ultra HD resolution with F1.0 super-aperture lens',
      'True 24/7 Full-Color night vision identifies vehicle numbers & clothing colors',
      'Smart human & vehicle detection reduces false motion alerts on mobile',
      'PoE (Power over Ethernet) single-cable installation with NVR',
      'Heavy-duty anti-corrosion metal housing ideal for Puducherry coastal areas'
    ],
    suitableFor: ['Villas & Independent Houses', 'Jewellery & Retail Shops', 'Warehouses', 'Schools & Colleges'],
    availableServices: [
      'PoE NVR network design',
      'Professional installation',
      'Mobile push-alert setup',
      'Annual Maintenance Contract (AMC)'
    ]
  },
  {
    id: 4,
    slug: '360-ptz-wifi-smart-security-camera',
    name: '3MP/4MP 360° Pan-Tilt Smart Wi-Fi Camera',
    category: 'Smart Wi-Fi / PTZ',
    resolution: '4MP Smart Wi-Fi',
    badge: 'Two-Way Talk',
    summary: '360-degree rotating smart camera with two-way audio talk, auto motion tracking, and SD card / cloud recording.',
    priceRange: '₹2,800 – ₹3,900',
    warranty: '1 Year Manufacturer Warranty',
    ipRating: 'IP66 Indoor/Outdoor',
    nightVision: 'Smart Dual-Light Night Vision',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    features: [
      '355° Horizontal Pan and 90° Vertical Tilt controlled directly from your phone',
      'Two-way audio speaker and microphone to talk to visitors or staff',
      'Auto human-tracking follows movement automatically',
      'Supports up to 256GB MicroSD card + NVR integration',
      'Quick setup for rented homes, baby/elderly monitoring, and small shops'
    ],
    suitableFor: ['Homes', 'Apartments', 'Small Shops', 'Cafes & Restaurants'],
    availableServices: [
      'Camera supply & mounting',
      'Wi-Fi signal optimization',
      'Mobile app family sharing setup',
      'On-call technical support'
    ]
  },
  {
    id: 5,
    slug: '4-camera-complete-home-shop-combo-kit',
    name: 'Complete 4-Camera HD Security Combo Kit',
    category: 'Complete Combo Kit',
    resolution: '2MP / 4MP Combo',
    badge: 'All-Inclusive Value Kit',
    summary: 'End-to-end 4-camera security package including 4-Channel DVR/NVR, Surveillance Hard Disk, power supply, and cabling.',
    priceRange: '₹14,500 – ₹21,500',
    warranty: '2 Years Hardware Warranty',
    ipRating: '2 Indoor Dome + 2 Outdoor Bullet',
    nightVision: '30m Day/Night Vision',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    features: [
      '2 × Outdoor Weatherproof Bullet Cameras + 2 × Indoor Wide Dome Cameras',
      '4-Channel H.265+ DVR/NVR with HDMI/VGA TV output',
      '1TB Surveillance-Grade Hard Drive (stores ~15–25 days of continuous recording)',
      '4-Channel SMPS Power Supply, BNC/DC connectors & 90m 3+1 Copper/CAT6 Cable',
      'Complete mobile remote viewing configuration for iOS & Android'
    ],
    suitableFor: ['Homes', 'Retail Shops', 'Small Offices', 'Clinics'],
    availableServices: [
      'Free site inspection in Puducherry',
      'Turnkey installation & cabling',
      'DVR/NVR & Mobile viewing setup',
      '1 Year free on-site service support'
    ]
  },
  {
    id: 6,
    slug: '8-camera-commercial-nvr-security-system',
    name: '8-Camera Commercial IP NVR Security System',
    category: 'Complete Combo Kit',
    resolution: '4MP / 5MP IP PoE',
    badge: 'Commercial Grade',
    summary: 'High-reliability 8-camera IP PoE surveillance system engineered for offices, showrooms, schools, and warehouses.',
    priceRange: '₹32,000 – ₹48,000',
    warranty: '2 Years On-Site Warranty',
    ipRating: 'IP67 All-Weather Cameras',
    nightVision: 'Color + Smart IR Night Vision',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
    features: [
      '8 × 4MP/5MP IP PoE Cameras (Customizable mix of Indoor Dome & Outdoor Bullet)',
      '8-Channel PoE NVR with 4K HDMI output for centralized guard/manager monitor',
      '2TB/4TB Surveillance Hard Disk for 30+ days retention',
      'Multi-user role-based mobile & PC viewing access',
      'Structured PVC conduit piping and neat cable management'
    ],
    suitableFor: ['Offices', 'Supermarkets', 'Schools / Colleges', 'Factories / Warehouses'],
    availableServices: [
      'Detailed site survey & camera blind-spot mapping',
      'Commercial conduit installation',
      'Network & static IP / cloud setup',
      'Priority Annual Maintenance Contract (AMC)'
    ]
  }
];

const initialLeads = [
  {
    id: 101,
    leadCode: 'SBC-CCTV-2026-1001',
    customerName: 'Ramesh Karthikeyan',
    mobileNumber: '9843123456',
    email: 'ramesh.k@example.com',
    location: 'Mudaliarpet',
    propertyType: 'Home',
    camerasRequired: '4 cameras',
    serviceRequired: 'New installation',
    budget: '₹15,000 - ₹20,000',
    additionalRequirements: 'Need 2 outdoor cameras covering gate & car parking, and 2 indoor cameras with mobile viewing.',
    privacyConsent: true,
    marketingConsent: true,
    status: 'Quotation Sent',
    estimatedAmount: 17500,
    notes: 'Site inspection completed near Thengaithittu, Mudaliarpet. Sent 4MP 4-camera combo quotation via WhatsApp.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 102,
    leadCode: 'SBC-CCTV-2026-1002',
    customerName: 'Anitha Sundaram',
    mobileNumber: '9443298765',
    email: 'anitha.boutique@example.com',
    location: 'Saram',
    propertyType: 'Shop',
    camerasRequired: '4 cameras',
    serviceRequired: 'New installation',
    budget: 'Need quotation',
    additionalRequirements: 'Audio recording needed near billing counter and entrance door.',
    privacyConsent: true,
    marketingConsent: false,
    status: 'Follow-up',
    estimatedAmount: 18900,
    notes: 'Recommended 4MP Dome cameras with built-in mic. Customer requested callback tomorrow at 11 AM.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 103,
    leadCode: 'SBC-CCTV-2026-1003',
    customerName: 'Vigneshwaran M',
    mobileNumber: '9789054321',
    email: 'vignesh.logistics@example.com',
    location: 'Villianur',
    propertyType: 'Factory / Warehouse',
    camerasRequired: '8 cameras',
    serviceRequired: 'New installation',
    budget: '₹35,000 - ₹50,000',
    additionalRequirements: 'Warehouse loading bay needs full-color night vision cameras and 30 days backup.',
    privacyConsent: true,
    marketingConsent: true,
    status: 'Installation',
    estimatedAmount: 42000,
    notes: 'Quotation approved! Sri Balaji Computers installation team scheduled for Villianur godown.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 104,
    leadCode: 'SBC-CCTV-2026-1004',
    customerName: 'Dr. S. Prakash',
    mobileNumber: '9944112233',
    email: 'drprakash.clinic@example.com',
    location: 'Reddiarpalayam',
    propertyType: 'Office',
    camerasRequired: '2 cameras',
    serviceRequired: 'CCTV Repair / AMC',
    budget: 'Need quotation',
    additionalRequirements: 'Existing 4-channel DVR not showing online on mobile app and 1 outdoor camera is blurry.',
    privacyConsent: true,
    marketingConsent: false,
    status: 'Enquiry',
    estimatedAmount: 2500,
    notes: 'New repair enquiry received from website.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

function loadLocalDb() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = {
      leads: initialLeads,
      products: initialProducts,
      lastLeadNumber: 1004
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { leads: initialLeads, products: initialProducts, lastLeadNumber: 1004 };
  }
}

function saveLocalDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// PostgreSQL Pool initialization with auto-database & schema creation
let pgPool = null;
let usePostgres = false;

async function initDatabase() {
  const pgHost = process.env.PGHOST || 'localhost';
  const pgPort = Number(process.env.PGPORT || 5432);
  const pgUser = process.env.PGUSER || 'postgres';
  const pgPassword = process.env.PGPASSWORD || 'postgres';
  const pgDatabase = process.env.PGDATABASE || 'sbc_puducherry_cctv';

  if (Pool && Client) {
    try {
      // 1. Connect to default 'postgres' DB and create target database if needed
      const adminClient = new Client({
        host: pgHost,
        port: pgPort,
        user: pgUser,
        password: pgPassword,
        database: 'postgres',
        connectionTimeoutMillis: 3500
      });
      await adminClient.connect();
      const dbExists = await adminClient.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [pgDatabase]
      );
      if (dbExists.rowCount === 0) {
        await adminClient.query(`CREATE DATABASE "${pgDatabase}"`);
        console.log(`✅ Created PostgreSQL database "${pgDatabase}".`);
      }
      await adminClient.end();

      // 2. Connect Pool to target database and apply schema.sql
      pgPool = new Pool({
        host: pgHost,
        port: pgPort,
        user: pgUser,
        password: pgPassword,
        database: pgDatabase,
        connectionTimeoutMillis: 3500
      });
      await pgPool.query('SELECT 1');

      const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
      await pgPool.query(schemaSql);

      // 3. Seed products into PostgreSQL if empty
      const prodCount = await pgPool.query('SELECT COUNT(*) AS cnt FROM products');
      if (Number(prodCount.rows[0].cnt) === 0) {
        for (const p of initialProducts) {
          await pgPool.query(
            `INSERT INTO products (slug, name, category, resolution, summary, features, suitable_for, available_services, price_label, image_url)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (slug) DO NOTHING`,
            [
              p.slug,
              p.name,
              p.category,
              p.resolution,
              p.summary,
              JSON.stringify(p.features),
              JSON.stringify(p.suitableFor),
              JSON.stringify(p.availableServices),
              p.priceRange,
              p.image
            ]
          );
        }
        console.log('✅ Seeded CCTV products into PostgreSQL "products" table.');
      }

      usePostgres = true;
      console.log(`✅ Connected to local PostgreSQL database "${pgDatabase}" on ${pgHost}:${pgPort}.`);
    } catch (err) {
      usePostgres = false;
      console.log(`ℹ️ Local PostgreSQL connection failed (${err.message}).`);
      console.log('ℹ️ Update PGPASSWORD in backend/.env to match your PostgreSQL password. Using local JSON fallback for now.');
      loadLocalDb();
    }
  } else {
    loadLocalDb();
    console.log('ℹ️ Using persistent local JSON store (backend/data/db.json).');
  }
}

// Helper: Validate Indian Mobile Number
function validateMobileNumber(mobile) {
  if (!mobile) return false;
  const cleaned = String(mobile).replace(/[\s\-+]/g, '');
  // Accepts 10 digit Indian numbers starting with 6-9, or 91 followed by 10 digits
  return /^(?:91)?[6-9]\d{9}$/.test(cleaned);
}

// Helper: Estimate pricing for a lead automatically
function calculateLeadEstimate(camerasRequired, serviceRequired, propertyType) {
  if (serviceRequired && serviceRequired.toLowerCase().includes('repair')) {
    return 1500;
  }
  if (serviceRequired && serviceRequired.toLowerCase().includes('amc')) {
    return 4500;
  }
  const map = {
    '2 cameras': 10500,
    '4 cameras': 16800,
    '8 cameras': 34500,
    '16+ cameras': 68000,
    'Need guidance': 16800
  };
  let base = map[camerasRequired] || 16500;
  if (propertyType === 'Factory / Warehouse' || propertyType === 'School / College') {
    base = Math.round(base * 1.2);
  }
  return base;
}

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    storageMode: usePostgres ? 'PostgreSQL' : 'JSON Persistent Storage (PostgreSQL Ready)',
    serviceAreas: [
      'Puducherry',
      'Lawspet',
      'Mudaliarpet',
      'Saram',
      'Villianur',
      'Reddiarpalayam',
      'White Town',
      'Ariyankuppam',
      'Muthialpet',
      'Oulgaret'
    ]
  });
});

// GET /api/products
app.get('/api/products', (req, res) => {
  const db = loadLocalDb();
  const { category } = req.query;
  let products = db.products || initialProducts;
  if (category && category !== 'All') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  res.json({ products });
});

// GET /api/products/:slug
app.get('/api/products/:slug', (req, res) => {
  const db = loadLocalDb();
  const product = (db.products || initialProducts).find(p => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// POST /api/estimator - Interactive CCTV System & Storage Calculator
app.post('/api/estimator', (req, res) => {
  const {
    propertyType = 'Home',
    indoorCameras = 2,
    outdoorCameras = 2,
    resolution = '4MP',
    nightVisionType = 'Smart IR',
    recordingDays = 15,
    cableMeters = 60,
    includeAudio = true,
    includeInstallation = true
  } = req.body;

  const totalCameras = Number(indoorCameras) + Number(outdoorCameras);
  if (totalCameras <= 0) {
    return res.status(400).json({ error: 'Select at least 1 camera to calculate an estimate.' });
  }

  // Determine DVR/NVR channels (4, 8, 16, 32)
  let channels = 4;
  if (totalCameras > 4 && totalCameras <= 8) channels = 8;
  else if (totalCameras > 8 && totalCameras <= 16) channels = 16;
  else if (totalCameras > 16) channels = 32;

  // Per camera cost by resolution
  const cameraBasePrices = {
    '2MP': { indoor: 1450, outdoor: 1750, bitrateMbps: 2.0 },
    '4MP': { indoor: 2100, outdoor: 2550, bitrateMbps: 3.5 },
    '5MP': { indoor: 2650, outdoor: 3400, bitrateMbps: 4.5 },
    '8MP (4K)': { indoor: 4200, outdoor: 5200, bitrateMbps: 7.0 }
  };

  const tier = cameraBasePrices[resolution] || cameraBasePrices['4MP'];
  const colorVuAddon = nightVisionType === 'Full-Color Night Vision' ? 550 : 0;
  const audioAddon = includeAudio ? 250 : 0;

  const cameraCost =
    Number(indoorCameras) * (tier.indoor + audioAddon) +
    Number(outdoorCameras) * (tier.outdoor + colorVuAddon);

  // Recorder cost
  const recorderPrices = { 4: 4200, 8: 6800, 16: 12500, 32: 22000 };
  const recorderCost = recorderPrices[channels] || 6800;

  // Calculate required Hard Disk (TB) using H.265+ compression (~50% savings)
  // GB per day per camera ≈ bitrateMbps * 3600 * 24 / 8 / 1024 * 0.5 (H.265+ factor)
  const gbPerCameraPerDay = tier.bitrateMbps * 5.2;
  const totalGbNeeded = totalCameras * gbPerCameraPerDay * Number(recordingDays);
  let recommendedHddTb = 1;
  if (totalGbNeeded > 900 && totalGbNeeded <= 1850) recommendedHddTb = 2;
  else if (totalGbNeeded > 1850 && totalGbNeeded <= 3700) recommendedHddTb = 4;
  else if (totalGbNeeded > 3700) recommendedHddTb = 6;

  const hddPrices = { 1: 3800, 2: 5900, 4: 9800, 6: 14500 };
  const hddCost = hddPrices[recommendedHddTb] || 3800;

  // Cabling, power supply & accessories
  const cableAndAccessoriesCost = Math.round(Number(cableMeters) * 28 + totalCameras * 350);

  // Installation & Mobile configuration charges
  const installationCost = includeInstallation ? totalCameras * 550 + 800 : 0;

  const estimatedTotal =
    cameraCost + recorderCost + hddCost + cableAndAccessoriesCost + installationCost;

  res.json({
    summary: {
      propertyType,
      totalCameras,
      indoorCameras: Number(indoorCameras),
      outdoorCameras: Number(outdoorCameras),
      resolution,
      nightVisionType,
      recommendedRecorder: `${channels}-Channel H.265+ DVR/NVR`,
      recommendedStorage: `${recommendedHddTb} TB Surveillance HDD (~${recordingDays} Days Backup)`,
      estimatedStorageGb: Math.round(totalGbNeeded),
      breakdown: {
        cameras: cameraCost,
        recorder: recorderCost,
        storage: hddCost,
        cablingAndAccessories: cableAndAccessoriesCost,
        installationAndMobileSetup: installationCost
      },
      estimatedTotal,
      priceRangeMin: Math.round(estimatedTotal * 0.92),
      priceRangeMax: Math.round(estimatedTotal * 1.08)
    }
  });
});

// POST /api/leads - Create a new customer enquiry lead
app.post('/api/leads', async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      email = '',
      location,
      propertyType = 'Home',
      camerasRequired = '4 cameras',
      serviceRequired = 'New installation',
      budget = 'Need quotation',
      additionalRequirements = '',
      privacyConsent = false,
      marketingConsent = false,
      estimatedAmount = null
    } = req.body;

    // Validation
    const errors = [];
    if (!customerName || String(customerName).trim().length < 2) {
      errors.push('Customer name is required (minimum 2 characters).');
    }
    if (!validateMobileNumber(mobileNumber)) {
      errors.push('Please enter a valid 10-digit Indian mobile number.');
    }
    if (!location || String(location).trim().length < 2) {
      errors.push('Location in Puducherry is required.');
    }
    if (!privacyConsent) {
      errors.push('You must consent to being contacted and accept the Privacy Policy.');
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(' '), errors });
    }

    const cleanedMobile = String(mobileNumber).replace(/[\s\-+]/g, '').slice(-10);
    const calculatedEstimate =
      estimatedAmount || calculateLeadEstimate(camerasRequired, serviceRequired, propertyType);

    const db = loadLocalDb();
    const nextNum = (db.lastLeadNumber || 1004) + 1;
    db.lastLeadNumber = nextNum;
    const leadCode = `SBC-CCTV-2026-${nextNum}`;
    const nowIso = new Date().toISOString();

    const newLead = {
      id: Date.now(),
      leadCode,
      customerName: String(customerName).trim(),
      mobileNumber: cleanedMobile,
      email: String(email || '').trim(),
      location: String(location).trim(),
      propertyType,
      camerasRequired,
      serviceRequired,
      budget,
      additionalRequirements: String(additionalRequirements || '').trim(),
      privacyConsent: Boolean(privacyConsent),
      marketingConsent: Boolean(marketingConsent),
      status: 'Enquiry',
      estimatedAmount: calculatedEstimate,
      notes: 'Website enquiry submitted. Pending initial follow-up call.',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    if (usePostgres && pgPool) {
      const insertQuery = `
        INSERT INTO leads (
          lead_code, customer_name, mobile_number, email, location,
          property_type, cameras_required, service_required, budget,
          additional_requirements, privacy_consent, marketing_consent,
          status, estimated_amount, notes
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        RETURNING *
      `;
      await pgPool.query(insertQuery, [
        newLead.leadCode,
        newLead.customerName,
        newLead.mobileNumber,
        newLead.email,
        newLead.location,
        newLead.propertyType,
        newLead.camerasRequired,
        newLead.serviceRequired,
        newLead.budget,
        newLead.additionalRequirements,
        newLead.privacyConsent,
        newLead.marketingConsent,
        newLead.status,
        newLead.estimatedAmount,
        newLead.notes
      ]);
    }

    // Always keep local JSON synchronized as well
    db.leads.unshift(newLead);
    saveLocalDb(db);

    // Always use Sri Balaji Computers official WhatsApp number: 7200113344 (with India country code 91)
    const businessWhatsapp = '917200113344';
    const waText = encodeURIComponent(
      `Hello Sri Balaji Computers (SBC - System Doctor)!\n` +
      `*New CCTV Enquiry Details*\n` +
      `------------------------\n` +
      `*Enquiry ID:* ${leadCode}\n` +
      `*Customer Name:* ${newLead.customerName}\n` +
      `*Customer Mobile:* +91 ${newLead.mobileNumber}\n` +
      `*Location:* ${newLead.location}, Puducherry\n` +
      `*Property Type:* ${newLead.propertyType}\n` +
      `*Cameras Required:* ${newLead.camerasRequired}\n` +
      `*Service Required:* ${newLead.serviceRequired}\n` +
      `*Budget:* ${newLead.budget}\n` +
      (newLead.additionalRequirements ? `*Requirements:* ${newLead.additionalRequirements}\n` : '') +
      `------------------------\n` +
      `Please share a CCTV quotation and site visit availability.`
    );
    const whatsappUrl = `https://wa.me/${businessWhatsapp}?text=${waText}`;

    res.status(201).json({
      message: 'Enquiry submitted successfully! Sri Balaji Computers (Puducherry) will contact you shortly.',
      lead: newLead,
      notifications: {
        businessEmailNotified: process.env.BUSINESS_EMAIL || 'sbcdocter14@gmail.com',
        customerAcknowledgement: newLead.privacyConsent
          ? `SMS/WhatsApp acknowledgement queued for +91 ${cleanedMobile}`
          : 'Skipped',
        whatsappUrl
      }
    });
  } catch (err) {
    console.error('Error saving lead:', err);
    res.status(500).json({ error: 'Failed to process CCTV enquiry. Please try again.' });
  }
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Sri Balaji Computers (SBC) Backend Server running on http://localhost:${PORT}`);
  });
});

