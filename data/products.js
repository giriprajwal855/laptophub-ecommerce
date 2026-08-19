const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'products.json');

const brands = [
  {
    slug: 'apple',
    name: 'Apple',
    tagline: 'Power. Beautifully designed.',
    color: '#1d1d1f'
  },
  {
    slug: 'dell',
    name: 'Dell',
    tagline: 'The power to do more.',
    color: '#007db8'
  },
  {
    slug: 'msi',
    name: 'MSI',
    tagline: 'True Gaming. Beyond Gaming.',
    color: '#e60012'
  },
  {
    slug: 'acer',
    name: 'Acer',
    tagline: 'Explore beyond limits.',
    color: '#5a7f26'
  },
  {
    slug: 'lenovo',
    name: 'Lenovo',
    tagline: 'Smarter technology for all.',
    color: '#e2231a'
  }
];

const seedProducts = [
  // ---------------- APPLE (8) ----------------
  {
    id: 'apple-01',
    brand: 'Apple',
    name: 'MacBook Air 13-inch (M3)',
    price: 147500,
    oldPrice: 160500,
    image: '/images/official/apple-01.jpg',
    category: 'Ultrabook',
    badge: 'New',
    rating: 4.8,
    specs: {
      display: '13.6" Liquid Retina (2560 × 1664)',
      cpu: 'Apple M3 8-core',
      gpu: '10-core GPU',
      ram: '8GB unified memory',
      storage: '256GB SSD',
      battery: 'Up to 18 hours',
      weight: '1.24 kg'
    },
    description: 'The MacBook Air with M3 is a superportable laptop that soars through work and play.'
  },
  {
    id: 'apple-02',
    brand: 'Apple',
    name: 'MacBook Air 15-inch (M3)',
    price: 174000,
    oldPrice: 187500,
    image: '/images/official/apple-02.jpg',
    category: 'Ultrabook',
    badge: 'Best Seller',
    rating: 4.9,
    specs: {
      display: '15.3" Liquid Retina (2880 × 1864)',
      cpu: 'Apple M3 8-core',
      gpu: '10-core GPU',
      ram: '8GB unified memory',
      storage: '256GB SSD',
      battery: 'Up to 18 hours',
      weight: '1.51 kg'
    },
    description: 'Impossibly thin, incredibly capable. The 15-inch MacBook Air with all-day battery life.'
  },
  {
    id: 'apple-03',
    brand: 'Apple',
    name: 'MacBook Air 13-inch (M2)',
    price: 134000,
    image: '/images/official/apple-03.jpg',
    category: 'Ultrabook',
    rating: 4.7,
    specs: {
      display: '13.6" Liquid Retina (2560 × 1664)',
      cpu: 'Apple M2 8-core',
      gpu: '8-core GPU',
      ram: '8GB unified memory',
      storage: '256GB SSD',
      battery: 'Up to 18 hours',
      weight: '1.24 kg'
    },
    description: 'Strikingly thin and fast. The M2 MacBook Air is built to go anywhere and do everything.'
  },
  {
    id: 'apple-04',
    brand: 'Apple',
    name: 'MacBook Pro 14-inch (M3)',
    price: 214500,
    image: '/images/official/apple-04.jpg',
    category: 'Pro',
    badge: 'Best Seller',
    rating: 4.9,
    specs: {
      display: '14.2" Liquid Retina XDR (3024 × 1964)',
      cpu: 'Apple M3 8-core',
      gpu: '10-core GPU',
      ram: '8GB unified memory',
      storage: '512GB SSD',
      battery: 'Up to 22 hours',
      weight: '1.55 kg'
    },
    description: 'Supercharged by M3 — and up to 22 hours of battery life. A mobile powerhouse.'
  },
  {
    id: 'apple-05',
    brand: 'Apple',
    name: 'MacBook Pro 14-inch (M3 Pro)',
    price: 268000,
    oldPrice: 281500,
    image: '/images/official/apple-05.jpg',
    category: 'Pro',
    badge: 'Popular',
    rating: 5.0,
    specs: {
      display: '14.2" Liquid Retina XDR (3024 × 1964)',
      cpu: 'Apple M3 Pro 11-core',
      gpu: '14-core GPU',
      ram: '18GB unified memory',
      storage: '512GB SSD',
      battery: 'Up to 18 hours',
      weight: '1.61 kg'
    },
    description: 'The M3 Pro chip brings blazing performance and game-changing graphics.'
  },
  {
    id: 'apple-06',
    brand: 'Apple',
    name: 'MacBook Pro 16-inch (M3 Max)',
    price: 469000,
    image: '/images/official/apple-06.jpg',
    category: 'Pro',
    rating: 5.0,
    specs: {
      display: '16.2" Liquid Retina XDR (3456 × 2234)',
      cpu: 'Apple M3 Max 16-core',
      gpu: '40-core GPU',
      ram: '48GB unified memory',
      storage: '1TB SSD',
      battery: 'Up to 22 hours',
      weight: '2.14 kg'
    },
    description: 'A desktop-class chip in a laptop. M3 Max for the most demanding workflows.'
  },
  {
    id: 'apple-07',
    brand: 'Apple',
    name: 'MacBook Pro 13-inch (M2)',
    price: 174000,
    image: '/images/official/apple-07.jpg',
    category: 'Pro',
    rating: 4.6,
    specs: {
      display: '13.3" Retina (2560 × 1600)',
      cpu: 'Apple M2 8-core',
      gpu: '10-core GPU',
      ram: '8GB unified memory',
      storage: '256GB SSD',
      battery: 'Up to 20 hours',
      weight: '1.38 kg'
    },
    description: 'Featuring the next-generation M2 chip, the 13-inch MacBook Pro is ready for your toughest projects.'
  },
  {
    id: 'apple-08',
    brand: 'Apple',
    name: 'MacBook Pro 16-inch (M2 Pro)',
    price: 335000,
    image: '/images/official/apple-08.jpg',
    category: 'Pro',
    rating: 4.8,
    specs: {
      display: '16.2" Liquid Retina XDR (3456 × 2234)',
      cpu: 'Apple M2 Pro 12-core',
      gpu: '19-core GPU',
      ram: '16GB unified memory',
      storage: '512GB SSD',
      battery: 'Up to 22 hours',
      weight: '2.16 kg'
    },
    description: 'Unleash your next great idea with the M2 Pro-powered 16-inch MacBook Pro.'
  },

  // ---------------- DELL (8) ----------------
  {
    id: 'dell-01',
    brand: 'Dell',
    name: 'Dell XPS 13 (9340)',
    price: 147500,
    image: '/images/official/dell-01.jpg',
    category: 'Ultrabook',
    badge: "Editor's Choice",
    rating: 4.8,
    specs: {
      display: '13.4" FHD+ InfinityEdge (1920 × 1200)',
      cpu: 'Intel Core Ultra 7 155H',
      gpu: 'Intel Arc Graphics',
      ram: '16GB LPDDR5x',
      storage: '512GB SSD',
      battery: 'Up to 19 hours',
      weight: '1.17 kg'
    },
    description: 'The benchmark for premium ultraportables, wrapped in CNC-machined aluminum.'
  },
  {
    id: 'dell-02',
    brand: 'Dell',
    name: 'Dell XPS 15 (9530)',
    price: 201000,
    oldPrice: 214500,
    image: '/images/official/dell-02.jpg',
    category: 'Creator',
    badge: 'Popular',
    rating: 4.7,
    specs: {
      display: '15.6" 3.5K OLED (3456 × 2160)',
      cpu: 'Intel Core i7-13700H',
      gpu: 'NVIDIA RTX 4060 8GB',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      battery: 'Up to 13 hours',
      weight: '1.92 kg'
    },
    description: 'A 15-inch powerhouse for creators, with a gorgeous OLED display and RTX graphics.'
  },
  {
    id: 'dell-03',
    brand: 'Dell',
    name: 'Dell XPS 17 (9730)',
    price: 227500,
    image: '/images/official/dell-03.jpg',
    category: 'Creator',
    rating: 4.8,
    specs: {
      display: '17" 4K UHD+ Touch (3840 × 2400)',
      cpu: 'Intel Core i7-13700H',
      gpu: 'NVIDIA RTX 4070 8GB',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      battery: 'Up to 11 hours',
      weight: '2.47 kg'
    },
    description: 'Desktop-level power with a 17-inch 4K display — the ultimate creative workstation.'
  },
  {
    id: 'dell-04',
    brand: 'Dell',
    name: 'Alienware m16 R2',
    price: 227500,
    oldPrice: 248000,
    image: '/images/official/dell-04.jpg',
    category: 'Gaming',
    badge: 'Gaming',
    rating: 4.6,
    specs: {
      display: '16" QHD+ 240Hz (2560 × 1600)',
      cpu: 'Intel Core i7-14650HX',
      gpu: 'NVIDIA RTX 4060 8GB',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      battery: 'Up to 7 hours',
      weight: '2.66 kg'
    },
    description: 'Alienware m16 unleashes high-refresh gaming with Cryo-tech cooling and legendary design.'
  },
  {
    id: 'dell-05',
    brand: 'Dell',
    name: 'Alienware x16 R2',
    price: 294500,
    image: '/images/official/dell-05.jpg',
    category: 'Gaming',
    rating: 4.7,
    specs: {
      display: '16" QHD+ 240Hz (2560 × 1600)',
      cpu: 'Intel Core i9-14900HX',
      gpu: 'NVIDIA RTX 4080 12GB',
      ram: '32GB LPDDR5x',
      storage: '2TB SSD',
      battery: 'Up to 6 hours',
      weight: '2.62 kg'
    },
    description: 'The thinnest 16-inch Alienware ever, with immersive AlienFX lighting.'
  },
  {
    id: 'dell-06',
    brand: 'Dell',
    name: 'Dell Inspiron 15 (3530)',
    price: 60000,
    image: '/images/official/dell-06.jpg',
    category: 'Everyday',
    rating: 4.3,
    specs: {
      display: '15.6" FHD (1920 × 1080)',
      cpu: 'Intel Core i5-1334U',
      gpu: 'Intel Iris Xe',
      ram: '8GB DDR4',
      storage: '512GB SSD',
      battery: 'Up to 8 hours',
      weight: '1.78 kg'
    },
    description: 'Affordable everyday performance with a modern design, built for school and work.'
  },
  {
    id: 'dell-07',
    brand: 'Dell',
    name: 'Dell Latitude 7440',
    price: 191500,
    image: '/images/official/dell-07.jpg',
    category: 'Business',
    rating: 4.5,
    specs: {
      display: '14" FHD+ (1920 × 1200)',
      cpu: 'Intel Core Ultra 7 165U',
      gpu: 'Intel Arc Graphics',
      ram: '16GB LPDDR5x',
      storage: '512GB SSD',
      battery: 'Up to 18 hours',
      weight: '1.31 kg'
    },
    description: 'The premier business laptop with AI-enhanced security and enterprise-grade durability.'
  },
  {
    id: 'dell-08',
    brand: 'Dell',
    name: 'Dell G15 5530 Gaming',
    price: 134000,
    oldPrice: 147500,
    image: '/images/official/dell-08.jpg',
    category: 'Gaming',
    rating: 4.4,
    specs: {
      display: '15.6" FHD 165Hz (1920 × 1080)',
      cpu: 'Intel Core i7-13650HX',
      gpu: 'NVIDIA RTX 4050 6GB',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      battery: 'Up to 6 hours',
      weight: '2.81 kg'
    },
    description: 'Serious gaming performance at an accessible price — the G15 punches above its class.'
  },

  // ---------------- MSI (8) ----------------
  {
    id: 'msi-01',
    brand: 'MSI',
    name: 'MSI Katana 15 (B13VGK)',
    price: 174000,
    image: '/images/official/msi-01.jpg',
    category: 'Gaming',
    badge: 'Gaming',
    rating: 4.5,
    specs: {
      display: '15.6" FHD 144Hz (1920 × 1080)',
      cpu: 'Intel Core i7-13620H',
      gpu: 'NVIDIA RTX 4070 8GB',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      battery: 'Up to 6 hours',
      weight: '2.25 kg'
    },
    description: 'Unleash your gaming potential with the Katana 15, engineered for pure performance.'
  },
  {
    id: 'msi-02',
    brand: 'MSI',
    name: 'MSI Raider GE78 HX',
    price: 335000,
    oldPrice: 361500,
    image: '/images/official/msi-02.jpg',
    category: 'Gaming',
    badge: 'Flagship',
    rating: 4.8,
    specs: {
      display: '17" QHD+ 240Hz (2560 × 1600)',
      cpu: 'Intel Core i9-14900HX',
      gpu: 'NVIDIA RTX 4080 12GB',
      ram: '32GB DDR5',
      storage: '2TB SSD',
      battery: 'Up to 7 hours',
      weight: '3.10 kg'
    },
    description: 'The Raider is a performance monster with a 240Hz Mini LED display and vapor chamber cooling.'
  },
  {
    id: 'msi-03',
    brand: 'MSI',
    name: 'MSI Stealth 16 Studio',
    price: 241000,
    image: '/images/official/msi-03.jpg',
    category: 'Creator',
    badge: 'Creator',
    rating: 4.7,
    specs: {
      display: '16" QHD+ 240Hz (2560 × 1600)',
      cpu: 'Intel Core Ultra 7 155H',
      gpu: 'NVIDIA RTX 4070 8GB',
      ram: '32GB LPDDR5',
      storage: '1TB SSD',
      battery: 'Up to 10 hours',
      weight: '1.99 kg'
    },
    description: 'Where gaming and creation meet. Impossibly slim yet unbelievably powerful.'
  },
  {
    id: 'msi-04',
    brand: 'MSI',
    name: 'MSI Titan 18 HX',
    price: 603000,
    image: '/images/official/msi-04.jpg',
    category: 'Gaming',
    rating: 4.9,
    specs: {
      display: '18" 4K Mini LED 120Hz (3840 × 2400)',
      cpu: 'Intel Core i9-14900HX',
      gpu: 'NVIDIA RTX 4090 16GB',
      ram: '128GB DDR5',
      storage: '4TB SSD',
      battery: 'Up to 5 hours',
      weight: '3.60 kg'
    },
    description: 'The most powerful laptop MSI has ever created. 18 inches of uncompromised power.'
  },
  {
    id: 'msi-05',
    brand: 'MSI',
    name: 'MSI Cyborg 15 (A12VF)',
    price: 134000,
    image: '/images/official/msi-05.jpg',
    category: 'Gaming',
    rating: 4.3,
    specs: {
      display: '15.6" FHD 144Hz (1920 × 1080)',
      cpu: 'Intel Core i7-12650H',
      gpu: 'NVIDIA RTX 4060 8GB',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      battery: 'Up to 6 hours',
      weight: '1.98 kg'
    },
    description: 'Cyberpunk-inspired translucent design with the muscle to back it up.'
  },
  {
    id: 'msi-06',
    brand: 'MSI',
    name: 'MSI Pulse 17 (B13VGK)',
    price: 187500,
    oldPrice: 201000,
    image: '/images/official/msi-06.jpg',
    category: 'Gaming',
    rating: 4.4,
    specs: {
      display: '17.3" FHD 144Hz (1920 × 1080)',
      cpu: 'Intel Core i7-13700H',
      gpu: 'NVIDIA RTX 4070 8GB',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      battery: 'Up to 6 hours',
      weight: '2.70 kg'
    },
    description: 'A big-screen gaming machine with the performance and cooling to dominate every match.'
  },
  {
    id: 'msi-07',
    brand: 'MSI',
    name: 'MSI Prestige 14 AI Evo',
    price: 147500,
    image: '/images/official/msi-07.jpg',
    category: 'Ultrabook',
    rating: 4.6,
    specs: {
      display: '14" QHD+ 60Hz (2560 × 1600)',
      cpu: 'Intel Core Ultra 7 155H',
      gpu: 'Intel Arc Graphics',
      ram: '32GB LPDDR5x',
      storage: '1TB SSD',
      battery: 'Up to 16 hours',
      weight: '1.59 kg'
    },
    description: 'Built for creators who refuse to compromise — AI-powered performance in a featherlight chassis.'
  },
  {
    id: 'msi-08',
    brand: 'MSI',
    name: 'MSI Sword 16 HX (B14V)',
    price: 201000,
    image: '/images/official/msi-08.jpg',
    category: 'Gaming',
    rating: 4.5,
    specs: {
      display: '16" QHD+ 165Hz (2560 × 1600)',
      cpu: 'Intel Core i7-14700HX',
      gpu: 'NVIDIA RTX 4070 8GB',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      battery: 'Up to 7 hours',
      weight: '2.30 kg'
    },
    description: 'A blade forged for battle — the Sword 16 HX pairs cutting-edge CPU with serious RTX graphics.'
  },

  // ---------------- ACER (8) ----------------
  {
    id: 'acer-01',
    brand: 'Acer',
    name: 'Acer Swift Go 14 (SFG14-71)',
    price: 80500,
    image: '/images/official/acer-01.jpg',
    category: 'Ultrabook',
    badge: 'New',
    rating: 4.5,
    specs: {
      display: '14" FHD IPS (1920 × 1200)',
      cpu: 'Intel Core i5-1335U',
      gpu: 'Intel Iris Xe',
      ram: '8GB LPDDR5',
      storage: '512GB SSD',
      battery: 'Up to 12 hours',
      weight: '1.32 kg'
    },
    description: 'A slim, light everyday companion that keeps up with your busy life.'
  },
  {
    id: 'acer-02',
    brand: 'Acer',
    name: 'Acer Aspire 5 (A515-57)',
    price: 60000,
    oldPrice: 73500,
    image: '/images/official/acer-02.jpg',
    category: 'Everyday',
    rating: 4.3,
    specs: {
      display: '15.6" FHD IPS (1920 × 1080)',
      cpu: 'Intel Core i5-1235U',
      gpu: 'Intel Iris Xe',
      ram: '8GB DDR4',
      storage: '512GB SSD',
      battery: 'Up to 8 hours',
      weight: '1.76 kg'
    },
    description: 'Big-screen productivity and entertainment that fits any budget.'
  },
  {
    id: 'acer-03',
    brand: 'Acer',
    name: 'Acer Nitro V 15 (ANV15-51)',
    price: 120500,
    image: '/images/official/acer-03.jpg',
    category: 'Gaming',
    badge: 'Gaming',
    rating: 4.4,
    specs: {
      display: '15.6" FHD 144Hz (1920 × 1080)',
      cpu: 'Intel Core i7-13620H',
      gpu: 'NVIDIA RTX 4050 6GB',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      battery: 'Up to 6 hours',
      weight: '2.10 kg'
    },
    description: 'Level up your game with Nitro V 15 — performance, style and value in one package.'
  },
  {
    id: 'acer-04',
    brand: 'Acer',
    name: 'Acer Predator Helios 16 (PH16-71)',
    price: 214500,
    oldPrice: 241000,
    image: '/images/official/acer-04.jpg',
    category: 'Gaming',
    badge: 'Flagship',
    rating: 4.7,
    specs: {
      display: '16" WQXGA 240Hz (2560 × 1600)',
      cpu: 'Intel Core i9-13900HX',
      gpu: 'NVIDIA RTX 4070 8GB',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      battery: 'Up to 7 hours',
      weight: '2.70 kg'
    },
    description: 'Predator Helios 16 brings the fight with a blazing 240Hz display and AeroBlade cooling.'
  },
  {
    id: 'acer-05',
    brand: 'Acer',
    name: 'Acer Predator Triton 16 (PT16-51)',
    price: 241000,
    image: '/images/official/acer-05.jpg',
    category: 'Gaming',
    rating: 4.6,
    specs: {
      display: '16" WQXGA 240Hz (2560 × 1600)',
      cpu: 'Intel Core i9-13900HX',
      gpu: 'NVIDIA RTX 4080 12GB',
      ram: '32GB DDR5',
      storage: '2TB SSD',
      battery: 'Up to 6 hours',
      weight: '2.60 kg'
    },
    description: 'Metal-bodied, liquid-metal-cooled and viciously fast — gaming elegance unleashed.'
  },
  {
    id: 'acer-06',
    brand: 'Acer',
    name: 'Acer Swift X 14 (SFX14-71G)',
    price: 147500,
    image: '/images/official/acer-06.jpg',
    category: 'Creator',
    rating: 4.5,
    specs: {
      display: '14.5" 2.8K OLED (2880 × 1800)',
      cpu: 'Intel Core i7-13700H',
      gpu: 'NVIDIA RTX 4050 6GB',
      ram: '16GB LPDDR5',
      storage: '1TB SSD',
      battery: 'Up to 10 hours',
      weight: '1.55 kg'
    },
    description: 'An OLED-powered creator laptop that blends portability with dedicated RTX graphics.'
  },
  {
    id: 'acer-07',
    brand: 'Acer',
    name: 'Acer Aspire Vero (AV15-51)',
    price: 67000,
    image: '/images/official/acer-07.jpg',
    category: 'Everyday',
    rating: 4.2,
    specs: {
      display: '15.6" FHD IPS (1920 × 1080)',
      cpu: 'Intel Core i5-1235U',
      gpu: 'Intel Iris Xe',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      battery: 'Up to 8 hours',
      weight: '1.80 kg'
    },
    description: 'The eco-conscious choice. Built from recycled materials without sacrificing performance.'
  },
  {
    id: 'acer-08',
    brand: 'Acer',
    name: 'Acer Chromebook Plus 514 (CB514-3H)',
    price: 53500,
    image: '/images/official/acer-08.jpg',
    category: 'Chromebook',
    rating: 4.1,
    specs: {
      display: '14" FHD IPS (1920 × 1080)',
      cpu: 'Intel Core i3-1315U',
      gpu: 'Intel UHD Graphics',
      ram: '8GB LPDDR4x',
      storage: '128GB SSD',
      battery: 'Up to 10 hours',
      weight: '1.43 kg'
    },
    description: 'Fast, secure and simple — the Chromebook Plus for everything you do every day.'
  },

  // ---------------- LENOVO (8) ----------------
  {
    id: 'lenovo-01',
    brand: 'Lenovo',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    price: 227500,
    oldPrice: 254500,
    image: '/images/official/lenovo-01.jpg',
    category: 'Business',
    badge: 'Business',
    rating: 4.8,
    specs: {
      display: '14" 2.8K OLED (2880 × 1800)',
      cpu: 'Intel Core Ultra 7 155H',
      gpu: 'Intel Arc Graphics',
      ram: '32GB LPDDR5x',
      storage: '1TB SSD',
      battery: 'Up to 16 hours',
      weight: '1.09 kg'
    },
    description: 'The legendary ThinkPad, reinvented. Ultra-light carbon fiber with AI-enhanced security.'
  },
  {
    id: 'lenovo-02',
    brand: 'Lenovo',
    name: 'Lenovo ThinkPad T14s Gen 5',
    price: 167500,
    image: '/images/official/lenovo-02.jpg',
    category: 'Business',
    rating: 4.6,
    specs: {
      display: '14" WUXGA IPS (1920 × 1200)',
      cpu: 'Intel Core Ultra 5 125U',
      gpu: 'Intel Graphics',
      ram: '16GB LPDDR5x',
      storage: '512GB SSD',
      battery: 'Up to 15 hours',
      weight: '1.24 kg'
    },
    description: 'Enterprise-grade security and legendary ThinkPad keyboard in a slim chassis.'
  },
  {
    id: 'lenovo-03',
    brand: 'Lenovo',
    name: 'Lenovo Legion Pro 5i (Gen 9)',
    price: 201000,
    oldPrice: 227500,
    image: '/images/official/lenovo-03.jpg',
    category: 'Gaming',
    badge: 'Gaming',
    rating: 4.7,
    specs: {
      display: '16" WQXGA 240Hz (2560 × 1600)',
      cpu: 'Intel Core i7-14650HX',
      gpu: 'NVIDIA RTX 4070 8GB',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      battery: 'Up to 8 hours',
      weight: '2.50 kg'
    },
    description: 'ColdFront cooling, 240Hz display and desktop-grade power — gaming perfection.'
  },
  {
    id: 'lenovo-04',
    brand: 'Lenovo',
    name: 'Lenovo Legion 9i (Gen 9)',
    price: 341500,
    image: '/images/official/lenovo-04.jpg',
    category: 'Gaming',
    badge: 'Flagship',
    rating: 4.8,
    specs: {
      display: '16" 3.2K Mini LED 165Hz (3200 × 2000)',
      cpu: 'Intel Core i9-14900HX',
      gpu: 'NVIDIA RTX 4090 16GB',
      ram: '64GB DDR5',
      storage: '2TB SSD',
      battery: 'Up to 7 hours',
      weight: '2.56 kg'
    },
    description: "The world's first 16-inch laptop with liquid cooling. Born to dominate."
  },
  {
    id: 'lenovo-05',
    brand: 'Lenovo',
    name: 'Lenovo IdeaPad Slim 3 (15IRU9)',
    price: 53500,
    image: '/images/official/lenovo-05.jpg',
    category: 'Everyday',
    rating: 4.2,
    specs: {
      display: '15.6" FHD IPS (1920 × 1080)',
      cpu: 'Intel Core i3-1315U',
      gpu: 'Intel UHD Graphics',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      battery: 'Up to 9 hours',
      weight: '1.62 kg'
    },
    description: 'Slim, light and surprisingly powerful — everyday computing without compromise.'
  },
  {
    id: 'lenovo-06',
    brand: 'Lenovo',
    name: 'Lenovo ThinkPad X1 Yoga Gen 8',
    price: 207500,
    image: '/images/official/lenovo-06.jpg',
    category: 'Business',
    rating: 4.7,
    specs: {
      display: '14" 2.8K OLED Touch (2880 × 1800)',
      cpu: 'Intel Core i7-1355U',
      gpu: 'Intel Iris Xe',
      ram: '16GB LPDDR5',
      storage: '1TB SSD',
      battery: 'Up to 14 hours',
      weight: '1.38 kg'
    },
    description: 'A premium 2-in-1 with a vivid OLED touch display, engineered for flexibility and security.'
  },
  {
    id: 'lenovo-07',
    brand: 'Lenovo',
    name: 'Lenovo IdeaPad Gaming 3 (15IAH7)',
    price: 107000,
    oldPrice: 120500,
    image: '/images/official/lenovo-07.jpg',
    category: 'Gaming',
    rating: 4.4,
    specs: {
      display: '15.6" FHD 120Hz (1920 × 1080)',
      cpu: 'Intel Core i5-12500H',
      gpu: 'NVIDIA RTX 3050 6GB',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      battery: 'Up to 7 hours',
      weight: '2.40 kg'
    },
    description: 'The entry point to serious gaming. Real RTX graphics at a price that makes sense.'
  },
  {
    id: 'lenovo-08',
    brand: 'Lenovo',
    name: 'Lenovo Yoga 9i (14IRP9)',
    price: 194000,
    image: '/images/official/lenovo-08.jpg',
    category: 'Ultrabook',
    badge: 'Best Seller',
    rating: 4.6,
    specs: {
      display: '14" 2.8K OLED Touch (2880 × 1800)',
      cpu: 'Intel Core Ultra 7 155H',
      gpu: 'Intel Arc Graphics',
      ram: '16GB LPDDR5x',
      storage: '1TB SSD',
      battery: 'Up to 17 hours',
      weight: '1.36 kg'
    },
    description: 'An elegant 2-in-1 with 4-in-1 rotating sound bar and stunning OLED visuals.'
  }
];

let products;
try {
  if (fs.existsSync(FILE)) {
    products = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  }
} catch (err) {
  products = null;
}
if (!Array.isArray(products) || products.length === 0) {
  products = seedProducts;
  save();
}

function save() {
  fs.writeFileSync(FILE, JSON.stringify(products, null, 2));
}

function getProduct(id) {
  return products.find((p) => p.id === id);
}

function getBrand(slug) {
  return brands.find((b) => b.slug === slug);
}

function getByBrand(brandName) {
  return products.filter((p) => p.brand.toLowerCase() === brandName.toLowerCase());
}

function addProduct(data) {
  const slug = data.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const nextNum = products.length + 1;
  const product = {
    id: `${slug}-${String(nextNum).padStart(2, '0')}`,
    brand: data.brand,
    name: data.name,
    price: Number(data.price) || 0,
    oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
    image: data.image || '/images/official/apple-01.jpg',
    category: data.category || 'Everyday',
    badge: data.badge || null,
    rating: Number(data.rating) || 4.0,
    specs: data.specs || {},
    description: data.description || ''
  };
  products.push(product);
  save();
  return product;
}

function updateProduct(id, data) {
  const product = getProduct(id);
  if (!product) return null;
  if (data.brand !== undefined) product.brand = data.brand;
  if (data.name !== undefined) product.name = data.name;
  if (data.price !== undefined) product.price = Number(data.price) || 0;
  if (data.oldPrice !== undefined) product.oldPrice = data.oldPrice ? Number(data.oldPrice) : null;
  if (data.image !== undefined) product.image = data.image;
  if (data.category !== undefined) product.category = data.category;
  if (data.badge !== undefined) product.badge = data.badge || null;
  if (data.rating !== undefined) product.rating = Number(data.rating) || 0;
  if (data.specs !== undefined) product.specs = data.specs;
  if (data.description !== undefined) product.description = data.description;
  save();
  return product;
}

function deleteProduct(id) {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products.splice(idx, 1);
  save();
  return true;
}

module.exports = {
  brands,
  products,
  getProduct,
  getBrand,
  getByBrand,
  addProduct,
  updateProduct,
  deleteProduct
};