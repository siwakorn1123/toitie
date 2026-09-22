import React, { useState } from 'react';

export const SalesAnalytics: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [hoveredHour, setHoveredHour] = useState<{ hour: string; sales: number; cups: number; rush?: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const hourlyData = [
    { hour: '07:00', sales: 1200, cups: 15 },
    { hour: '08:00', sales: 4800, cups: 56, rush: 'Morning Rush' },
    { hour: '09:00', sales: 5200, cups: 62, rush: 'Morning Rush' },
    { hour: '10:00', sales: 2600, cups: 30 },
    { hour: '11:00', sales: 2900, cups: 33 },
    { hour: '12:00', sales: 4600, cups: 52, rush: 'Lunch Rush' },
    { hour: '13:00', sales: 5100, cups: 58, rush: 'Lunch Rush' },
    { hour: '14:00', sales: 3400, cups: 38 },
    { hour: '15:00', sales: 2800, cups: 31 },
    { hour: '16:00', sales: 2100, cups: 23 },
    { hour: '17:00', sales: 1800, cups: 20 },
    { hour: '18:00', sales: 1250, cups: 14 },
    { hour: '19:00', sales: 600, cups: 7 },
  ];

  const maxSales = 6000;

  // Chart coordinates mapping (Width: 600, Height: 180)
  const chartPoints = hourlyData.map((d, index) => {
    const x = 30 + (index / (hourlyData.length - 1)) * 540;
    const y = 160 - (d.sales / maxSales) * 130;
    return { ...d, x, y };
  });

  const svgPathD = chartPoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const svgAreaD = `${svgPathD} L ${chartPoints[chartPoints.length - 1].x},160 L ${chartPoints[0].x},160 Z`;

  return (
    <div className="flex flex-col w-full p-space-md sm:p-space-lg gap-space-md">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-secondary text-sm animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-secondary-fixed text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Filter and Command Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        <div>
          <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
            <span>รายงานวิเคราะห์</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-on-surface font-semibold">สรุปยอดขาย & ความเร็วบริการ</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">
            รายงานยอดขาย (Sales Analytics)
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            ข้อมูลอัปเดตแบบเรียลไทม์ • ประจำวันพุธที่ 14 พฤษภาคม 2025
          </p>
        </div>

        {/* Date presets & Sync / Export */}
        <div className="flex items-center gap-space-xs flex-wrap">
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-surface-container">
            {[
              { id: 'today', label: 'วันนี้' },
              { id: 'yesterday', label: 'เมื่อวาน' },
              { id: 'week', label: '7 วันล่าสุด' },
              { id: 'month', label: 'เดือนนี้' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setDateFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                  dateFilter === f.id
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => showToast('ซิงค์ข้อมูลยอดขายล่าสุดจากคลาวด์เสร็จสิ้น')}
            className="flex items-center gap-1 px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span>ซิงค์ข้อมูลสด</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('ส่งออกเอกสารสรุปยอดขายประจำวัน (PDF & Excel) เรียบร้อย')}
            className="flex items-center gap-1 px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>ดาวน์โหลดรายงาน</span>
          </button>
        </div>
      </div>

      {/* Executive KPI Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md">ยอดขายรวมสุทธิ (Total Sales)</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display-lg text-display-lg text-primary tracking-tight font-mono">
              ฿38,650
            </div>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +14.8% เทียบกับสัปดาห์ที่แล้ว
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md">จำนวนแก้วที่ขายได้ (Cups Sold)</span>
            <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">local_cafe</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display-lg text-display-lg text-on-surface tracking-tight font-mono">
              412 <span className="text-xl font-normal font-sans">แก้ว</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +32 แก้ว จากเป้าหมายประจำวัน
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md">ราคาเฉลี่ยต่อบิล (Avg. Ticket)</span>
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display-lg text-display-lg text-on-surface tracking-tight font-mono">
              ฿124.50
            </div>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +฿8.20 จากการสั่งท็อปปิ้งเพิ่ม
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-md text-label-md">กำไรขั้นต้น (Gross Margin)</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container/30 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">pie_chart</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display-lg text-display-lg text-secondary tracking-tight font-mono">
              68.4%
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5 mt-0.5">
              ต้นทุนวัตถุดิบ (COGS) 31.6%
            </span>
          </div>
        </div>
      </div>

      {/* Main Analytics Row: 65% Hourly Sales Velocity SVG Chart, 35% Category Donut */}
      <div className="flex flex-col xl:flex-row gap-space-md items-stretch">
        {/* Hourly Rush Chart (65%) */}
        <div className="w-full xl:w-[65%] bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">show_chart</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  ยอดขายและปริมาณออเดอร์ตามช่วงเวลา (Hourly Sales Velocity)
                </span>
              </div>
              <span className="text-xs text-on-surface-variant">
                ตรวจพบช่วงเวลาเร่งด่วน 2 รอบ: Morning Rush (08:00 - 09:30) และ Lunch Rush (12:30 - 14:00)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> ยอดขาย (฿)
              </span>
              <span className="flex items-center gap-1 text-tertiary-container">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span> ช่วงเร่งด่วน (Rush)
              </span>
            </div>
          </div>

          {/* Interactive Scalable SVG Chart */}
          <div className="relative w-full h-[220px] mt-4 flex items-center justify-center">
            <svg
              viewBox="0 0 600 180"
              className="w-full h-full overflow-visible select-none"
            >
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#712c00" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#712c00" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="30" y1="30" x2="570" y2="30" stroke="#eaedff" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="30" y1="80" x2="570" y2="80" stroke="#eaedff" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="30" y1="130" x2="570" y2="130" stroke="#eaedff" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="30" y1="160" x2="570" y2="160" stroke="#dcc1b6" strokeWidth="1.5" />

              {/* Shaded Area */}
              <path d={svgAreaD} fill="url(#salesGrad)" />

              {/* Line Curve */}
              <path d={svgPathD} fill="none" stroke="#712c00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data Points */}
              {chartPoints.map((pt, idx) => (
                <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredHour(pt)}>
                  {pt.rush && (
                    <circle cx={pt.x} cy={pt.y} r="8" fill="#ffc2a5" opacity="0.6" className="animate-ping" />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredHour?.hour === pt.hour ? 6 : 4}
                    fill={pt.rush ? '#92400e' : '#712c00'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y="175"
                    textAnchor="middle"
                    className="text-[9px] fill-[#55433a] font-mono"
                  >
                    {pt.hour}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredHour && (
              <div className="absolute top-2 right-4 bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-lg text-xs shadow-lg border border-primary flex items-center gap-3">
                <span className="font-bold">{hoveredHour.hour} น.</span>
                <span>ยอดขาย: ฿{hoveredHour.sales.toLocaleString()}</span>
                <span>จำนวน: {hoveredHour.cups} แก้ว</span>
                {hoveredHour.rush && <span className="text-secondary-fixed">({hoveredHour.rush})</span>}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-container">
            <span>ช่วงเวลาขายดีสูงสุด: 08:30 น. (62 แก้ว / ฿5,200)</span>
            <span className="text-secondary font-semibold">อัตราการรอเฉลี่ย 3.8 นาที/ออเดอร์</span>
          </div>
        </div>

        {/* Category Sales Breakdown (35%) */}
        <div className="w-full xl:w-[35%] bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">donut_large</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">
                สัดส่วนยอดขายตามหมวดหมู่ (Sales Share)
              </span>
            </div>
          </div>

          {/* Donut Chart representation */}
          <div className="flex items-center justify-center py-4">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {/* Coffee 46% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#712c00" strokeWidth="5" strokeDasharray="46 100" strokeDashoffset="0" />
                {/* Tea & Matcha 28% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#006c4a" strokeWidth="5" strokeDasharray="28 100" strokeDashoffset="-46" />
                {/* Smoothie 14% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#92400e" strokeWidth="5" strokeDasharray="14 100" strokeDashoffset="-74" />
                {/* Bakery 12% */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#887269" strokeWidth="5" strokeDasharray="12 100" strokeDashoffset="-88" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-on-surface-variant">ยอดรวม</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-mono">฿38,650</span>
              </div>
            </div>
          </div>

          {/* Category Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-low">
              <span className="w-3 h-3 rounded-full bg-primary shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-medium text-on-surface">Specialty Coffee</span>
                <span className="text-on-surface-variant font-mono">46% (฿17,779)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-low">
              <span className="w-3 h-3 rounded-full bg-secondary shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-medium text-on-surface">ชา & มัทฉะ</span>
                <span className="text-on-surface-variant font-mono">28% (฿10,822)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-low">
              <span className="w-3 h-3 rounded-full bg-primary-container shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-medium text-on-surface">สมูทตี้ & ผลไม้</span>
                <span className="text-on-surface-variant font-mono">14% (฿5,411)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-low">
              <span className="w-3 h-3 rounded-full bg-outline shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-medium text-on-surface">เบเกอรี่ & ครัวซองต์</span>
                <span className="text-on-surface-variant font-mono">12% (฿4,638)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Triple Column Section: Top Sellers, Payment Tenders, Staff Prep Velocity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md items-start">
        {/* Col 1: 5 อันดับเมนูขายดีที่สุด */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col gap-space-sm">
          <div className="flex items-center justify-between border-b border-surface-container pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">military_tech</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">5 อันดับเมนูขายดีที่สุด</span>
            </div>
            <span className="text-xs text-secondary font-bold">Best Sellers</span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { rank: 1, name: 'Iced Americano (House Blend)', sold: 124, revenue: 9300, pct: 95 },
              { rank: 2, name: 'Dirty Coffee Signature', sold: 68, revenue: 6460, pct: 70 },
              { rank: 3, name: 'Uji Matcha Latte', sold: 54, revenue: 4590, pct: 55 },
              { rank: 4, name: 'Thai Milk Tea สูตรเข้มข้น', sold: 48, revenue: 3120, pct: 45 },
              { rank: 5, name: 'Yuzu Sparkling Espresso', sold: 36, revenue: 3960, pct: 35 },
            ].map((item) => (
              <div key={item.rank} className="flex flex-col gap-1 p-2 rounded-xl bg-surface-container-low/70">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        item.rank === 1
                          ? 'bg-primary text-on-primary'
                          : item.rank === 2
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span className="font-medium text-on-surface">{item.name}</span>
                  </div>
                  <span className="font-mono text-primary font-bold">฿{item.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pl-7">
                  <span>ขายได้ {item.sold} แก้ว</span>
                  <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: ช่องทางชำระเงิน (Payment Tender Breakdown) */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col gap-space-sm">
          <div className="flex items-center justify-between border-b border-surface-container pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">credit_card</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">ช่องทางชำระเงิน (Tender)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
              Cashless 86%
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* PromptPay */}
            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                  PromptPay QR (Thai QR Payment)
                </span>
                <span className="font-bold font-mono text-secondary">62.0%</span>
              </div>
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xl font-bold text-on-surface">฿23,963.00</span>
                <span className="text-xs text-on-surface-variant">255 ธุรกรรม</span>
              </div>
            </div>

            {/* Credit Card / EDC */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">credit_card</span>
                  บัตรเครดิต / แตะ EDC
                </span>
                <span className="font-bold font-mono text-on-surface">24.0%</span>
              </div>
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xl font-bold text-on-surface">฿9,276.00</span>
                <span className="text-xs text-on-surface-variant">98 ธุรกรรม</span>
              </div>
            </div>

            {/* Cash */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">payments</span>
                  เงินสด (Cash in Drawer)
                </span>
                <span className="font-bold font-mono text-on-surface">14.0%</span>
              </div>
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xl font-bold text-on-surface">฿5,411.00</span>
                <span className="text-xs text-on-surface-variant">59 ธุรกรรม</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: ผลงานบาริสต้า (Staff Prep Speed) */}
        <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-surface-container shadow-xs flex flex-col gap-space-sm">
          <div className="flex items-center justify-between border-b border-surface-container pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">ผลงานบาริสต้า & ความเร็ว</span>
            </div>
            <span className="text-xs text-secondary font-bold">เป้าหมาย &lt; 4.0 น.</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { name: 'คุณภาสกร', role: 'บาริสต้า 1 (เอสเพรสโซ่หลัก)', cups: 184, avgTime: '3.1 น./แก้ว', status: 'ยอดเยี่ยม' },
              { name: 'คุณวราภรณ์', role: 'บาริสต้า 2 (มัทฉะ & ชาเย็น)', cups: 142, avgTime: '3.5 น./แก้ว', status: 'ดีมาก' },
              { name: 'คุณณัฐพร', role: 'บาริสต้า 3 (สมูทตี้ & เบเกอรี่)', cups: 86, avgTime: '3.8 น./แก้ว', status: 'ตามเกณฑ์' },
            ].map((staff, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-on-surface">{staff.name}</span>
                  <span className="text-[11px] text-on-surface-variant">{staff.role}</span>
                  <span className="text-xs font-mono text-primary font-bold mt-0.5">{staff.cups} แก้ว</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-secondary/15 text-secondary">
                    {staff.avgTime}
                  </span>
                  <span className="text-[10px] text-on-surface-variant block mt-1">{staff.status}</span>
                </div>
              </div>
            ))}

            <div className="p-2.5 rounded-xl bg-secondary-fixed/20 border border-secondary/30 flex items-center justify-between text-xs">
              <span className="text-on-secondary-fixed font-semibold">เวลารอคอยเฉลี่ยลูกค้าหน้าร้าน:</span>
              <span className="text-secondary font-bold font-mono text-sm">5.2 นาที (เกรด A+)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
