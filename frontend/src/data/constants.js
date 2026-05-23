export const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Services', href: '#services' },
  { label: 'Subsidies', href: '#subsidy' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Contact', href: '#contact' },
];

export const HERO_STATS = [
  { num: '₹78K', lbl: 'Max Subsidy' },
  { num: '300', lbl: 'Free Units/Month' },
  { num: '25yr', lbl: 'Panel Lifespan' },
  { num: '4–6', lbl: 'Years ROI' },
];

export const MARKET_STATS = [
  { big: '500 GW', small: "India's 2030 Solar Target" },
  { big: '40%', small: 'Tax Depreciation for Businesses' },
  { big: '300+', small: 'Districts Covered' },
  { big: '20 yrs', small: 'Average Panel Warranty' },
  { big: '0%', small: 'Collateral EMI Options' },
];

export const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Submit Your Request',
    desc: 'Fill in your address, property type, and monthly electricity bill. We\'ll assess your solar potential instantly.',
  },
  {
    num: '02',
    title: 'Free Site Survey',
    desc: 'Our certified engineers visit your property, evaluate rooftop space, orientation, and shadow analysis.',
  },
  {
    num: '03',
    title: 'Subsidy & Financing',
    desc: 'We handle all PM Surya Ghar subsidy paperwork on your behalf via Direct Benefit Transfer (DBT).',
  },
  {
    num: '04',
    title: 'Installation & Grid Connect',
    desc: 'Professional installation in 2–3 days. Net metering setup so you earn credits for surplus power exported to the grid.',
  },
];

export const SERVICES = [
  { icon: '🏠', bg: '#FDF3E0', title: 'Residential Installation', desc: 'Tailored rooftop systems for individual homes and apartments. Sizes from 1 kW to 10 kW.' },
  { icon: '🏭', bg: '#D6F0E4', title: 'Commercial & Industrial', desc: 'Large-scale systems for factories, warehouses, and SMEs with accelerated 40% depreciation benefits.' },
  { icon: '🔧', bg: '#DDE9F8', title: 'Maintenance & Repairs', desc: 'Quarterly cleaning, performance monitoring, inverter servicing, and emergency repair support.' },
  { icon: '📊', bg: '#FDF3E0', title: 'Energy Audit', desc: 'Detailed analysis of your energy consumption patterns with personalised solar recommendations.' },
  { icon: '🔋', bg: '#D6F0E4', title: 'Battery Storage', desc: 'Add lithium-ion battery backup to go completely off-grid or protect against power cuts.' },
  { icon: '🤝', bg: '#DDE9F8', title: 'Subsidy Assistance', desc: 'End-to-end help with PM Surya Ghar applications, DISCOM empanelment, and DBT processing.' },
  { icon: '💡', bg: '#FDF3E0', title: 'Solar Products', desc: 'Sales of panels, inverters, charge controllers, and solar water heaters from certified brands.' },
  { icon: '🌾', bg: '#D6F0E4', title: 'Rural Off-Grid', desc: 'Solar microgrids for villages and farms lacking reliable electricity access.' },
];

export const SUBSIDY_TIERS = [
  { variant: 'tier1', capacity: 'Up to 1 kW System', amount: '₹30,000', desc: 'Central subsidy + free electricity up to 100 units/month', color: 'var(--sun-dark)', bg: 'var(--sun-light)', border: 'rgba(244,162,40,0.35)' },
  { variant: 'tier2', capacity: 'Up to 2 kW System', amount: '₹60,000', desc: 'Central subsidy + free electricity up to 200 units/month', color: 'var(--leaf-dark)', bg: 'var(--leaf-light)', border: 'rgba(26,122,74,0.3)' },
  { variant: 'tier3', capacity: '3 kW and Above', amount: '₹78,000', desc: 'Capped central subsidy + 300 free units/month + state top-up', color: 'var(--sky-dark)', bg: 'var(--sky-light)', border: 'rgba(27,92,158,0.3)' },
];

export const TESTIMONIALS = [
  { stars: 5, text: 'Solar Solutions handled everything — subsidy forms, DISCOM approval, installation. Saving ₹4,200 every month. Best investment I\'ve made.', name: 'Ramesh Patel', loc: 'Surat, Gujarat', initials: 'RP', avatarBg: '#1A7A4A' },
  { stars: 5, text: 'Our factory\'s electricity cost dropped by 60%. The 40% depreciation benefit made the ROI incredible. Their commercial team is top-class.', name: 'Priya Krishnamurthy', loc: 'Chennai, Tamil Nadu', initials: 'PK', avatarBg: '#1B5C9E' },
  { stars: 5, text: 'Got ₹78,000 subsidy directly in my bank account within 45 days of installation. The process was completely transparent and hassle-free.', name: 'Anjali Sharma', loc: 'Jaipur, Rajasthan', initials: 'AS', avatarBg: '#F4A228' },
];

export const FAQS = [
  { q: 'What is PM Surya Ghar Muft Bijli Yojana?', a: 'It is the Government of India\'s flagship scheme offering subsidies up to ₹78,000 for rooftop solar installation. Beneficiaries also receive up to 300 free electricity units per month under this scheme.' },
  { q: 'How long does installation take?', a: 'Typically 2–3 working days from the date of order confirmation. DISCOM net metering approval may take an additional 15–30 days depending on your state utility.' },
  { q: 'What size system do I need?', a: 'A rough guide: 1 kW per ₹1,500–₹2,000 of your monthly bill. Our calculator above gives a precise recommendation based on your bill and location.' },
  { q: 'Is financing available?', a: 'Yes — we partner with leading banks and NBFCs for 0% collateral solar loans. EMIs typically start at ₹1,200/month for a 3 kW system after subsidy.' },
  { q: 'What happens during a power cut?', a: 'Standard grid-tied systems shut off during cuts for safety. Hybrid systems with battery backup keep your essential loads running. Ask us about battery add-ons.' },
  { q: 'Do you cover rural areas?', a: 'Yes. We provide off-grid and hybrid solar solutions for villages, farms, and areas with unreliable grid connectivity across 300+ districts.' },
];

export const INITIAL_ADMIN_REQUESTS = [
  { id: 'SR-0841', name: 'Amit Verma', loc: 'Surat, GJ', sys: '3 kW', sub: '₹78,000', status: 'pending' },
  { id: 'SR-0840', name: 'Meena Pillai', loc: 'Chennai, TN', sys: '2 kW', sub: '₹60,000', status: 'approved' },
  { id: 'SR-0839', name: 'Sundar Rajan', loc: 'Coimbatore, TN', sys: '5 kW', sub: '₹78,000', status: 'approved' },
  { id: 'SR-0838', name: 'TechFab Pvt Ltd', loc: 'Pune, MH', sys: '10 kW', sub: 'N/A', status: 'approved' },
  { id: 'SR-0837', name: 'Kavita Nair', loc: 'Kochi, KL', sys: '1 kW', sub: '₹30,000', status: 'rejected' },
  { id: 'SR-0836', name: 'Manish Gupta', loc: 'Jaipur, RJ', sys: '3 kW', sub: '₹78,000', status: 'pending' },
];

export const STATES = [
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'up', label: 'Uttar Pradesh' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'tn', label: 'Tamil Nadu' },
  { value: 'other', label: 'Other' },
];
