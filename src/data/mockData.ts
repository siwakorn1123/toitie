import { MenuItem, KdsOrder, InventoryItem, BomIngredient } from '../types';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1XivYjtBxCmQZ7r59N7jTXK1RoyJxnhl-dF2gWjEm2PM9fMTovuVkidHMi2G-ibTDB2FDvF1ntp8UBHkMQ866wb_F5vY9-yaREJDt1Jos7oo0XSpftj8XahQHyJgM1Yel8CBy3kWW6CCOeZFdndacVkSnwLCfwmiv7sQ2YSAZMeB0F2pgdktUUv5nlmtd-PoqsMLVaNTYa38J_0YL716FGC9K8ZaPBr7Gv75237FefQ_WUwit9rj8xHCN0',
  profile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhKBN5P8LrDaI8p0i3NkTJyAt32LmVDoeHVfo32HLBT6M4WwMy893LNXN7Oxh9i_vqtYFsaL57CTiOxRdrW5z50WrfKXIgQ7L0M--rpmAYh3ZmZESPmNB9_V6_6gms-ABXFsEQTjYpopKAf0oTHtzNljyTuuRujJtImhDcinXjcB4z4nDBgtba9zq3_wGzUu_Yfn0uYQbQgwgWf4FlAznu8OwuM9QZPZN0FeZO7CSLhRQJg9820ria',
  drinks: {
    americano: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApSJeNlJmZ5jdtcCCJ2xAqmwxN3M1PxFG_p3hAxh8qBbzhi6_dgY-0AoASjqKiJIPHwd34_MtFD4Qqlx2W5UWhRxnXiYJQNt8WSXZZyQf70ty86mo6FU0C_9zlvkEKMiVWHAzgDfPX0YjfbM2cfZ9AmIDJI2tG0DtdLBTyznHxT5TQnzcmoYB457M9E0CtqYstIsz10gfhw-cwC_x3VsuABMr6j0hvOvCflKnOTm4H3nZ0e0bcN12T',
    dirty: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD62F6fKRe8IRu3z7nAD260V244MAme7qOj6SyeuKxWKxw948ZtugakaF2sbEjZvJySqzkBtR2_0G8c5mFY0rS1LvID9lQNU1ue6v3DgzXHJbcd9WWJ6JYN97N3f9_zWT4aBvXsSM6koBNQgtw_844BjKEbSqSXyh6P_G4-9G9hSGmgps944HLK-KlFayix4e5FQENTv3GH4F7lE0O6dz-16vR0qfxGdfHvknd1ZZlSh12d0TEJOuS',
    matcha: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDKEdXuZbEaoyGoOz96_wKrjivBKCGjXCWnDg5EJU74_e8HOGEBofywy5VylcnSSpRcAv22qSZH53yOlLsHNN7KCReB3aP0fbKC3XmtrJ2QuCGc5JUuVeAbIW-lqbVJ8qhpaXvq8O8IYqvU24stu8YdUaGMx82fvP4G0dXRpNlkUwYfGgT4_r1069tfmEU6G6HQ6enql89MOMuRCcqXhWNaBQm94rJ_PDBKGQFSo1YAMzzk0gc61Rj',
    hojicha: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjMVe8iTerZQ85UZpRrFgVWzUHosWzbjMeOdOc0ITG1ggnk49uhyoRRsRJCNGOZds0FWwrtLOtKJZejqSB2_D-klM93cs9wtTfgal7S7gTu2omxGIm58RJ9OPAff1CE4_FDAwU64YwgDUh2Lb041NEG6fpr_iTPlUod0bwLL5w1lu8fWYYyd9zjci7WdTt20XJ3lz44IQZaeTkdaNokbtUBdJGf87kaHYCfrcT8-8PM_A4mvd23Cpo',
    yuzu: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1ltuNdKNB8TuJivEifnhDc1Cytn0R3oxPiWNhK__rzoh368g9ARSNCBdlosedK4PNCHbAP4Z2BPwYhrAt63y3JJgRp3O_MeRCPSohMbnP1kTy5_iZ4IXQpTAycV4uHAdN7lkWkWaFS-H60l555BlB-oTXVPCB33avYwPeaolE-_BGUe-aErMEz9qc0RSXtIzFMR1PEVywN_FZhKuzsczUARA1neAp5qAK3wdkMNgfFFE29qyogrgs',
    thaiTea: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7frPjrVpO1QZ1SNB2gKwChyCVycGmgarp5V8jlnzw6HJtviyLEv-3UI6EtAkzyaiDFbJpM3-pKxNkYbnxj_YpaOig-O4tJpBKu1wEIizjmIqHp4kUrQmfk9mecPnY8VEXGKvckNtJkpGt2_Fcs6i7Sl0KFHvau9m8pbGfRF_jHWMi6A1ZXVZXSQqU4PRR5pcCAUNv1LrGNd6YIpqDEmk3VAGOdTR0AfDA4OA0dbJPlKHG8_MEe8FI',
    slushy: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2_DVpiMKN-YgA7kocnElK_nbR7mpU_0lRQKsYY9aSNHKar3piJZvqnupD_buzmsxeWACOiS4JjvdbpYeS6qc49mHpW8pgBn72sIvhH4k1JONIZ7APnN_4_AoV3zOIi6tCHRc0DK8N1Fr0t4-ZKUmntOd1MeJWc7hedwJF0Ka-uuDLTGt_oKoZe5PxAi5oEl45bbYKwrtX_zx7hpSEztL3UFS4FsMHbQGwJEg8X-smFd0PIUoQuBII',
    croissant: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY6od4uR1y6llmZi0m9XrR3zu_xh8h3igUVAYJmNr0rMwl4J-hb8Fd_ErHTiG8fNK_cnaANf5GFszYbVSjbuW74Eia72CyU6NNWjjm78Bmjsgc7wJu633idZ0gS1KUoPqxF2bkJqlJwHk36SXngiIV4io09GUPTcpZ7BpPDrxHJS_je6tLNBOW864Gebwj2iEZMu4bo-Taiu0SYZ6l5Jl_5pnxgEo0icewkmLnEcRwTGHGqgW_50K0',
    matchaBom: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJOKJ5n8pfGVktH4HltP_f_HA--9zjwXkge6SNxnbF-9ObTH3Py6pU4xe46sK0wH0pABUrR1nrU-1XeNyyoup71rRQ52wzSHpK4fpj-XYQdzWrhGYthfD4XkP744AmUZ28W2I2S9C5D1-jcEEsgTs5emhvaqyJBgHZ7hWBTXiXxvMljOTUAFD46wj8A-Eprx0HZDytumyNV_Poei361-sF8En7Q9H091ooA0gsf4JLZfSV-g5CXIDV',
  }
};

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Iced Americano',
    thName: 'อเมริกาโน่เย็น',
    category: 'coffee',
    price: 75,
    image: ASSETS.drinks.americano,
    badge: 'Best Seller',
    subBadge: 'คั่วกลาง / เข้ม',
    statusText: 'พร้อมเสิร์ฟ',
    statusColor: 'text-secondary',
    description: 'Special House Blend คั่วสด',
    roastLevel: 'ดอยช้าง คั่วกลาง-เข้ม',
  },
  {
    id: 'menu-2',
    name: 'Dirty Coffee',
    thName: 'เดอร์ตี้คอฟฟี่ ซิกเนเจอร์',
    category: 'signature',
    price: 95,
    image: ASSETS.drinks.dirty,
    badge: 'Signature',
    subBadge: 'จำกัด 30 แก้ว/วัน',
    statusText: 'เหลือ 12 แก้ว',
    statusColor: 'text-secondary',
    description: 'นมเย็นจัดสูตรลับ + ดับเบิ้ลริสเตรตโต้',
  },
  {
    id: 'menu-3',
    name: 'Uji Matcha Latte',
    thName: 'อูจิมัทฉะลาเต้',
    category: 'tea',
    price: 85,
    image: ASSETS.drinks.matcha,
    badge: 'เกรดพิธีการ',
    statusText: 'สต็อกพร้อม',
    statusColor: 'text-secondary',
    description: 'มัทฉะอุจิแท้ 100% ตีสดถ้วยต่อถ้วย',
  },
  {
    id: 'menu-4',
    name: 'Hojicha Brown Sugar',
    thName: 'โฮจิฉะ บราวน์ชูการ์',
    category: 'tea',
    price: 90,
    image: ASSETS.drinks.hojicha,
    statusText: 'ไข่มุกพร้อม',
    statusColor: 'text-secondary',
    description: 'ชาคั่วหอมกรุ่น + ไข่มุกทองเคี่ยว',
  },
  {
    id: 'menu-5',
    name: 'Yuzu Sparkling Americano',
    thName: 'ยูซุสปาร์คกลิ้ง อเมริกาโน่',
    category: 'coffee',
    price: 110,
    image: ASSETS.drinks.yuzu,
    badge: 'สดชื่น ซ่า',
    statusText: 'วัตถุดิบสด',
    statusColor: 'text-secondary',
    description: 'ส้มยูซุคั้นสดแท้ + โซดาพรีเมียม',
  },
  {
    id: 'menu-6',
    name: 'Thai Tea สยามคลาสสิก',
    thName: 'ชาไทยสยามคลาสสิก',
    category: 'tea',
    price: 65,
    image: ASSETS.drinks.thaiTea,
    statusText: 'สูตรเข้ม',
    statusColor: 'text-secondary',
    description: 'ใบชา 4 แหล่งบ่มเข้มข้น ไม่แต่งกลิ่น',
  },
  {
    id: 'menu-7',
    name: 'Strawberry Slushy',
    thName: 'สตรอว์เบอร์รี่ สลัชชี่',
    category: 'smoothie',
    price: 105,
    image: ASSETS.drinks.slushy,
    badge: 'ผลไม้สด',
    statusText: 'ปั่นละเอียด',
    statusColor: 'text-secondary',
    description: 'สตรอว์เบอร์รี่สดปั่นนมฮอกไกโด',
  },
  {
    id: 'menu-8',
    name: 'Croissant เนยสด',
    thName: 'ครัวซองต์เนยสด AOP',
    category: 'bakery',
    price: 75,
    image: ASSETS.drinks.croissant,
    badge: 'อบร้อนทุก 2 ชม.',
    statusText: 'เหลือ 4 ชิ้น',
    statusColor: 'text-tertiary-container',
    description: 'เนยแท้ฝรั่งเศส AOP กรอบนอกนุ่มใน',
  },
];

export const INITIAL_KDS_ORDERS: KdsOrder[] = [
  {
    id: 'kds-1',
    orderNumber: '#A-079',
    type: 'Takeaway',
    elapsedSeconds: 492, // 08:12
    targetSeconds: 300,
    status: 'pending',
    isOverdue: true,
    urgentNote: 'โทรสั่งล่วงหน้า (รับด่วน) • เกินกำหนด 3 นาที',
    station: 'espresso',
    items: [
      {
        id: 'k1-1',
        name: '1x Dirty Coffee',
        note: 'เสิร์ฟแก้วเย็นทันที / ดับเบิ้ลริสเตรตโต้',
        completed: false,
        statusTag: 'แก้วเย็นจัด',
        tagColor: 'bg-error text-on-error',
        icon: 'ac_unit'
      },
      {
        id: 'k1-2',
        name: '2x Iced Latte',
        note: 'แก้ว 16 oz • หวาน 50% (ไซรัปปกติ 1 ปั๊ม) • นมสดเต็มมันเนย',
        completed: false,
      }
    ]
  },
  {
    id: 'kds-2',
    orderNumber: '#A-081',
    type: 'Dine-in',
    tableOrChannel: 'โต๊ะ 03',
    elapsedSeconds: 225, // 03:45
    targetSeconds: 360,
    status: 'in-progress',
    baristaName: 'บาริสต้าตูน',
    station: 'slowbar',
    items: [
      {
        id: 'k2-1',
        name: '1x Matcha Latte ร้อน',
        note: 'Uji First Harvest / ลาเต้อาร์ตทิวลิป',
        completed: true,
      },
      {
        id: 'k2-2',
        name: '1x Yuzu Sparkling Amer.',
        note: 'ยูซุธรรมชาติแท้ / แยกช็อตเสิร์ฟ',
        completed: true,
      },
      {
        id: 'k2-3',
        name: '1x Almond Croissant',
        note: 'อบร้อนเตาติ๊ง 2 นาที (กำลังอบ)',
        completed: false,
        icon: 'local_fire_department'
      }
    ]
  },
  {
    id: 'kds-3',
    orderNumber: '#A-084',
    type: 'Takeaway',
    tableOrChannel: 'เคาน์เตอร์ POS #01',
    elapsedSeconds: 70, // 01:10
    targetSeconds: 300,
    status: 'pending',
    station: 'espresso',
    items: [
      {
        id: 'k3-1',
        name: '1x Iced Americano',
        note: 'เมล็ด Ethiopia Yirgacheffe • ไม่หวาน (Sweetness 0%)',
        completed: false,
        statusTag: 'Single Origin',
        tagColor: 'bg-primary-fixed text-on-primary-fixed',
        icon: 'local_florist'
      },
      {
        id: 'k3-2',
        name: '2x Iced Matcha Latte',
        note: 'แก้ว 16 oz • นมโอ๊ต (Oat Milk) ทั้งสองแก้ว • หวาน 25% (Mild Sweet)',
        completed: false,
        icon: 'eco'
      }
    ]
  },
  {
    id: 'kds-4',
    orderNumber: '#A-078',
    type: 'GrabFood',
    elapsedSeconds: 320,
    targetSeconds: 400,
    status: 'ready',
    station: 'slowbar',
    riderInfo: {
      code: '#GF-9921',
      name: 'สุทธิชัย ร.',
      status: 'คนขับมาถึงแล้ว ณ จุดรับหน้าร้าน'
    },
    items: [
      {
        id: 'k4-1',
        name: '4 แก้ว Thai Tea โบราณเย็น',
        note: 'หวานปกติ + ไข่มุกบราวน์ชูการ์ทุกแก้ว • บรรจุถุงคู่ + แยกน้ำแข็งพร้อมแล้ว',
        completed: true,
      }
    ]
  }
];

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'SKU-CF-001',
    name: 'House Blend Espresso',
    category: 'beans',
    categoryLabel: 'เมล็ดกาแฟ',
    supplier: 'Pacamara Coffee Roasters',
    currentStock: 3.50,
    maxParStock: 15.0,
    unit: 'กก.',
    unitCost: 620.00,
    usedToday: 2.16,
    parPercentage: 23,
    status: 'low',
    bomFormula: '18g / Double Shot'
  },
  {
    id: 'inv-2',
    sku: 'SKU-MK-014',
    name: 'Oatly Barista Edition',
    category: 'dairy',
    categoryLabel: 'นม & ทางเลือก',
    supplier: 'Oatly Thailand Dist.',
    currentStock: 8,
    maxParStock: 24,
    unit: 'กล่อง',
    unitCost: 115.00,
    usedToday: 6,
    parPercentage: 33,
    status: 'low',
    bomFormula: '180ml / แก้ว 16oz'
  },
  {
    id: 'inv-3',
    sku: 'SKU-TC-003',
    name: 'Ceremonial Uji Matcha',
    category: 'tea',
    categoryLabel: 'ชา & ผงชง',
    supplier: 'Peace Oriental Matcha Supply',
    currentStock: 400,
    maxParStock: 2000,
    unit: 'กรัม',
    unitCost: 2.80,
    usedToday: 224,
    parPercentage: 20,
    status: 'low',
    bomFormula: '8g / Latte • 5g / Usucha'
  },
  {
    id: 'inv-4',
    sku: 'SKU-MK-002',
    name: 'Meiji Pasteurized Milk 2L',
    category: 'dairy',
    categoryLabel: 'นม & ทางเลือก',
    supplier: 'CP-Meiji',
    currentStock: 28,
    maxParStock: 30,
    unit: 'ขวด',
    unitCost: 92.00,
    usedToday: 14,
    parPercentage: 93,
    status: 'normal',
    bomFormula: '150-180ml / แก้ว'
  },
  {
    id: 'inv-5',
    sku: 'SKU-PKG-016',
    name: 'แก้วใส PET 16oz สกรีนโลโก้',
    category: 'packaging',
    categoryLabel: 'บรรจุภัณฑ์',
    supplier: 'EcoPack TH',
    currentStock: 1450,
    maxParStock: 2000,
    unit: 'ใบ',
    unitCost: 2.15,
    usedToday: 98,
    parPercentage: 72,
    status: 'normal',
    bomFormula: '1 ชิ้น / เมนูเย็น 16oz'
  },
  {
    id: 'inv-6',
    sku: 'SKU-SY-005',
    name: 'Monin Vanilla Syrup 700ml',
    category: 'syrup',
    categoryLabel: 'ไซรัป',
    supplier: 'Monin Beverage House',
    currentStock: 5.2,
    maxParStock: 8,
    unit: 'ขวด',
    unitCost: 310.00,
    usedToday: 0.36,
    parPercentage: 65,
    status: 'normal',
    bomFormula: '15ml / ปั๊ม (Sweet 100%)'
  }
];

export const BOM_MATCHA_INGREDIENTS: BomIngredient[] = [
  {
    id: 'bom-1',
    name: 'ผงมัทฉะเกรด Uji',
    amount: '- 8.00 กรัม',
    cost: 22.40,
    icon: 'eco',
    iconColor: 'text-secondary'
  },
  {
    id: 'bom-2',
    name: 'นมสดพาสเจอร์ไรส์',
    amount: '- 180 มล.',
    cost: 8.28,
    icon: 'water_bottle',
    iconColor: 'text-primary'
  },
  {
    id: 'bom-3',
    name: 'ไซรัปน้ำตาลอ้อย',
    amount: '- 15 มล.',
    cost: 0.90,
    icon: 'liquor',
    iconColor: 'text-tertiary'
  },
  {
    id: 'bom-4',
    name: 'แก้วเย็น 16oz + ฝาฮาฟโดม',
    amount: '- 1 ชุด',
    cost: 2.65,
    icon: 'takeout_dining',
    iconColor: 'text-on-surface-variant'
  },
  {
    id: 'bom-5',
    name: 'หลอดกระดาษหุ้มซอง',
    amount: '- 1 ชิ้น',
    cost: 0.45,
    icon: 'horizontal_rule',
    iconColor: 'text-on-surface-variant'
  }
];
