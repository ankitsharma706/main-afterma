export const COLORS = {
  PINK: { primary: '#EC4899', bg: '#FFF5F7', border: '#F9A8D4', text: '#831843', ring: 'ring-pink-200', light: '#FFF5F7' },
  GREEN: { primary: '#10B981', bg: '#F0FDF4', border: '#A7F3D0', text: '#064E3B', ring: 'ring-emerald-200', light: '#F0FDF4' },
  BLUE: { primary: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD', text: '#0C4A6E', ring: 'ring-sky-200', light: '#F0F9FF' },
  PURPLE: { primary: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', text: '#4C1D95', ring: 'ring-purple-200', light: '#F5F3FF' },
  YELLOW: { primary: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', text: '#78350F', ring: 'ring-amber-200', light: '#FFFBEB' }
};

export const PRICING = { plus: 399 };
export const SLOGAN = "Safe Healing Journey";

export const HELPLINES = {
  india: { name: "Kiran Mental Health", number: "1800-599-0019", label: "24/7 National Helpline" },
  emergency: "112"
};

export const PHASES = [
  'Pre-conception', 'Trimester 1', 'Trimester 2', 'Trimester 3',
  'Month 1', 'Month 2', 'Month 3', 'Month 4+'
];

export const RECOVERY_DATABASE = [
  // Nurture Phase (Prenatal)
  { id: 't1-1', phase: 'Trimester 1', category: 'Prenatal Care', title: 'Nausea Management', description: 'Gentle hydration and dry ginger tracking to soothe morning sickness.', duration: 5, frequency: 'Daily', points: 15, intensityScale: 1 },
  { id: 't1-2', phase: 'Trimester 1', category: 'Prenatal Care', title: 'Pelvic Floor Intro', description: 'Visualizing engagement and diaphragmatic breathing for stability.', duration: 8, frequency: 'Daily', points: 20, intensityScale: 2 },
  { id: 't2-1', phase: 'Trimester 2', category: 'Physical Recovery', title: 'Round Ligament Mobility', description: 'Stretches to alleviate hip and groin discomfort.', duration: 12, frequency: 'Daily', points: 25, intensityScale: 3 },
  { id: 't2-2', phase: 'Trimester 2', category: 'Prenatal Care', title: 'Iron-Rich Snacking', description: 'Tracking spinach, dates, and beetroot intake.', duration: 2, frequency: 'Daily', points: 10, intensityScale: 1 },

  // Birth Transition Phase (Trimester 3 / Immediate Post)
  { id: 't3-1', phase: 'Trimester 3', category: 'Birth Prep', title: 'Perineal Preparation', description: 'Techniques for tissue elasticity and labor readiness.', duration: 10, frequency: 'Daily', points: 30, intensityScale: 2 },
  { id: 't3-2', phase: 'Trimester 3', category: 'Birth Prep', title: 'Labor Breathing Drills', description: 'Controlled exhalation techniques for contractions.', duration: 15, frequency: 'Daily', points: 35, intensityScale: 3 },
  { id: 'm1-p1', phase: 'Month 1', category: 'Physical Recovery', title: 'First Week Triage', description: 'Monitoring lochia and incision healing signs.', duration: 5, frequency: 'Daily', points: 50, intensityScale: 1 },

  // Healing Phase (Postpartum Recovery)
  { id: 'm1-e1', phase: 'Month 1', category: 'Emotional Stabilization', title: 'Hormonal Reset Breath', description: 'Calming the nervous system during the baby blues window.', duration: 10, frequency: 'Daily', points: 20, intensityScale: 1 },
  { id: 'm1-s1', phase: 'Month 1', category: 'Strength Building', title: 'Pelvic Power 1.0', description: 'Low intensity kegel sets for initial restoration.', duration: 5, frequency: 'Daily', points: 25, intensityScale: 2 },
  { id: 'm2-p1', phase: 'Month 2', category: 'Physical Recovery', title: 'Diastasis Check', description: 'Self-assessment and initial core alignment drills.', duration: 10, frequency: '3x week', points: 40, intensityScale: 3 },
  { id: 'm3-s1', phase: 'Month 3', category: 'Strength Building', title: 'Postpartum Core Restore', description: 'Safe transverse abdominis activation.', duration: 15, frequency: '3x week', points: 45, intensityScale: 5 }
];
export const INSURANCE_PLANS = [
  { bank: 'SBI', logo: 'S', plan: 'Janani Raksha Health Cover', range: '₹5L - ₹10L', highlights: ['Full Hospitalization', 'Mental Health Support', 'In-Home Nursing'], approval: '88%', processing: '5 Days', count: '12k+', eligibility: 'Moms 18+', theme: 'BLUE' },
  { bank: 'HDFC Bank', logo: 'H', plan: 'Maternity Extension Plan', range: '₹3L - ₹15L', highlights: ['Cashless Recovery Assist', 'Expert Consultations', 'Medication Coverage'], approval: '92%', processing: '3 Days', count: '18k+', eligibility: 'Moms 21+', theme: 'BLUE' },
  { bank: 'ICICI Bank', logo: 'I', plan: 'New Mother Essential', range: '₹2L - ₹8L', highlights: ['Postpartum Physio Inclusion', 'Safe Shield Protection', 'Lactation Specialist Access'], approval: '78%', processing: '4 Days', count: '8k+', eligibility: 'Moms 18+', theme: 'YELLOW' },
  { bank: 'Axis Bank', logo: 'A', plan: 'AfterMa Wellness Plan', range: '₹5L - ₹20L', highlights: ['Priority Triage Assist', 'Holistic Wellness Rider', 'Emergency Red Flag Cover'], approval: '85%', processing: '6 Days', count: '10k+', eligibility: 'Moms 25+', theme: 'PURPLE' },
];
export const STABILIZATION_TASKS = [
  "Safe Space: Light a lavender candle and breathe for 2 mins.",
  "Connection: Place hands on bump or hold baby skin-to-skin.",
  "Hydration: One full glass of warm mineralized water.",
  "Gratitude: One thing your body did well today."
];

export const NUTRITION_GUIDE = [
  { title: 'Warming Foods', items: ['Ginger Tea', 'Turmeric Milk', 'Warm Porridge'], benefit: 'Aids digestion and reduces inflammation.' },
  { title: 'Iron & Energy', items: ['Spinach', 'Lentils', 'Dates'], benefit: 'Replenishes blood loss and boosts stamina.' },
  { title: 'Lactation Support', items: ['Fenugreek', 'Fennel Seeds', 'Oats'], benefit: 'Supports healthy milk supply naturally.' }
];

export const EPDS_QUESTIONS = [
  { id: 1, question: "I have been able to laugh and see the funny side of things", options: ["As much as I always could", "Not quite so much now", "Definitely not so much now", "Not at all"] },
  { id: 2, question: "I have looked forward with enjoyment to things", options: ["As much as I ever did", "Rather less than I used to", "Definitely less than I used to", "Hardly at all"] },
  { id: 3, question: "I have blamed myself unnecessarily when things went wrong", options: ["Yes, most of the time", "Yes, some of the time", "Not very often", "No, never"] },
  { id: 4, question: "I have been anxious or worried for no good reason", options: ["No, not at all", "Hardly ever", "Yes, sometimes", "Yes, very often"] },
  { id: 5, question: "I have felt scared or panicky for no very good reason", options: ["Yes, quite a lot", "Yes, sometimes", "No, not much", "No, not at all"] }
];

export const STORE_ITEMS = [
  // Recovery (6)
  { id: 'p1', name: 'Organic Nipple Balm', brand: 'Mamaearth', category: 'Recovery', price: 450, image: '/MomKartProduct/OrganicNippleBalm.jpg', description: 'Soothes and protects sensitive skin.', rating: 4.8 },
  { id: 'p2', name: 'Cotton Belly Wrap', brand: 'FirstCry', category: 'Recovery', price: 1200, image: './MomKartProduct/CottonBellyWrap.jpg', description: 'Comfortable support for postpartum core.', rating: 4.9 },
  { id: 'p3', name: 'Witch Hazel Pads', brand: 'FridaMom', category: 'Recovery', price: 899, image: '/MomKartProduct/WitchHazelPads.jpg', description: 'Instant cooling relief for perineal healing.', rating: 4.7 },
  { id: 'p4', name: 'Peri Bottle', brand: 'Upside Down', category: 'Recovery', price: 499, image: '/MomKartProduct/PeriBottle.jpg', description: 'Ergonomic cleansing during recovery.', rating: 4.6 },
  { id: 'p5', name: 'Sitz Bath Soak', brand: 'The Moms Co', category: 'Recovery', price: 350, image: '/MomKartProduct/sithzbathsoap.jpg', description: 'Epsom salts with essential oils.', rating: 4.8 },
  { id: 'p6', name: 'Scar Silicone Tape', brand: 'Mederma', category: 'Recovery', price: 1500, image: '/MomKartProduct/Scarsilicontape.jpg', description: 'Advanced C-Section scar management.', rating: 4.5 },

  // Pregnancy Essentials (4)
  { id: 'mat1', name: 'Support Belt Pro', brand: 'Tynor', category: 'Maternity Care', price: 1450, image: '/MomKartProduct/Supportbeltpro.jpg', description: 'Trimester 3 pelvic and back relief.', rating: 4.7 },
  { id: 'mat2', name: 'Pregnancy Leggings', brand: 'Zivame', category: 'Maternity Care', price: 999, image: '/MomKartProduct/PregnencyLeggings.jpg', description: 'High-waisted over-the-bump stretch.', rating: 4.8 },
  { id: 'mat3', name: 'Maternity Nursing Bra', brand: 'Enamor', category: 'Maternity Care', price: 850, image: '/MomKartProduct/MAternityNUrsingBra.jpg', description: 'Seamless comfort for sensitive skin.', rating: 4.9 },
  { id: 'mat4', name: 'Compression Socks', brand: 'HealthShakti', category: 'Maternity Care', price: 650, image: '/MomKartProduct/CompressionSocks.jpg', description: 'Reduces leg swelling in T3.', rating: 4.4 },

  // Nutrition (4)
  { id: 'n1', name: 'Prenatal Multivitamin', brand: 'HealthKart', category: 'Nutrition', price: 850, image: '/MomKartProduct/PrenentalMultiVitamins.jpg', description: 'DHA and Folic acid optimized.', rating: 4.9 },
  { id: 'n2', name: 'Lactation Cookies', brand: 'MamaFix', category: 'Nutrition', price: 550, image: '/MomKartProduct/LactationCookies.jpg', description: 'Oats, flaxseed and fenugreek blend.', rating: 4.6 },
  { id: 'n3', name: 'Herbal Infusion Tea', brand: 'TeaCurry', category: 'Nutrition', price: 399, image: '/MomKartProduct/HerbalInfusionTea.jpg', description: 'Morning sickness relief blend.', rating: 4.5 },
  { id: 'n4', name: 'Organic Ghee', brand: 'Amul', category: 'Nutrition', price: 650, image: '/MomKartProduct/OrganicGhee.jpg', description: 'Traditional healthy fats for healing.', rating: 4.9 },

  // Baby Care (3)
  { id: 'b1', name: 'Bamboo Diapers', brand: 'SuperBottoms', category: 'Baby Care', price: 999, image: '/MomKartProduct/BambooDiapers.jpg', description: 'Eco-friendly and chemical-free.', rating: 4.8 },
  { id: 'b2', name: 'Safe-Touch Lotion', brand: 'Sebamed', category: 'Baby Care', price: 750, image: '/MomKartProduct/SafeTouchLotion.jpg', description: 'pH 5.5 clinically tested for newborns.', rating: 4.7 },
  { id: 'b3', name: 'Swaddle Wrap Set', brand: 'LuvLap', category: 'Baby Care', price: 1100, image: '/MomKartProduct/SwaddleWrapset.jpg', description: 'Soft breathable organic cotton.', rating: 4.9 },

  // Devices (3)
  { id: 'd1', name: 'Electric Breast Pump', brand: 'Philips Avent', category: 'Devices', price: 8500, image: '/MomKartProduct/BreastPump.jpg', description: 'Quiet and efficient multi-speed.', rating: 4.8 },
  { id: 'd2', name: 'Smart Baby Monitor', brand: 'Motorola', category: 'Devices', price: 4500, image: '/MomKartProduct/SmartBabyMonitor.jpg', description: 'Full HD video with night vision.', rating: 4.5 },
  { id: 'd3', name: 'Infrared Thermometer', brand: 'Omron', category: 'Devices', price: 1800, image: '/MomKartProduct/thermometer.jpg', description: 'Non-contact instant reading.', rating: 4.6 }
];

export const EXPERT_DATA = [
  // Physiotherapy (4)
  { category: 'Physiotherapy', name: 'Dr. Shweta Singh', role: 'Pelvic Specialist', credentials: 'MPT, W-Health Expert', insight: 'Restoring core stability is a journey of layers, not speed.', price: '₹1200' },
  { category: 'Physiotherapy', name: 'Dr. Rohan Mehra', role: 'Manual Therapist', credentials: 'BPT, Sports Med (Postpartum Focus)', insight: 'Movement is medicine for the healing abdomen.', price: '₹1000' },
  { category: 'Physiotherapy', name: 'Dr. Ananya Roy', role: 'Movement Therapist', credentials: 'MPT, Pilates Certified', insight: 'Align your breath before you align your spine.', price: '₹1500' },
  { category: 'Physiotherapy', name: 'Dr. Kabir Das', role: 'Geriatric & Maternal Physio', credentials: 'MPT (Obstetrics)', insight: 'Safety first in every postpartum stretch.', price: '₹1100' },

  // OB-GYN (4)
  { category: 'OB-GYN', name: 'Dr. Meena Iyer', role: 'Sr. Obstetrician', credentials: 'MD, DNB (OB-GYN)', insight: 'Your 6-week checkup is just the beginning of healing.', price: '₹1500' },
  { category: 'OB-GYN', name: 'Dr. Priya Varma', role: 'Maternal Fetal Expert', credentials: 'MD, Apollo Specialist', insight: 'Trust your intuition as much as your clinical data.', price: '₹2000' },
  { category: 'OB-GYN', name: 'Dr. Sameer Gupta', role: 'Gynaecological Surgeon', credentials: 'MD, FRCOG', insight: 'Advanced care for C-section and complex recoveries.', price: '₹1800' },
  { category: 'OB-GYN', name: 'Dr. Neha Sharma', role: 'Reproductive Health Lead', credentials: 'DGO, MD', insight: 'Empowered birth begins with empowered knowledge.', price: '₹1600' },

  // Lactation (4)
  { category: 'Lactation', name: 'Dr. Kavita Reddy', role: 'IBCLC Consultant', credentials: 'Certified Specialist', insight: 'Every latch is a lesson in patience and bonding.', price: '₹1000' },
  { category: 'Lactation', name: 'Sister Mary John', role: 'Breastfeeding Educator', credentials: 'RN, Certified Educator', insight: 'The right support makes all the difference in milk supply.', price: '₹800' },
  { category: 'Lactation', name: 'Dr. Aisha Khan', role: 'Pediatric Lactation Expert', credentials: 'MBBS, IBCLC', insight: 'Feeding is a dialogue between you and your baby.', price: '₹1200' },
  { category: 'Lactation', name: 'Dr. Pooja Balan', role: 'Holistic Feeding Coach', credentials: 'Certified Consultant', insight: 'Nutrition and rest are the pillars of lactation.', price: '₹950' }
];

export const NGO_DATA = [
  { name: 'White Swan Foundation', area: 'Mental Health Awareness', contact: '080-2555-5555', website: 'whiteswanfoundation.org' },
  { name: 'Sangath', area: 'Maternal Mental Health', contact: '011-4050-6666', website: 'sangath.in' },
  { name: 'SNEHA', area: 'Women & Newborn Care', contact: '022-2404-2627', website: 'snehamumbai.org' },
  { name: 'ARTH', area: 'Reproductive Rights & Care', contact: '029-4248-3561', website: 'arthindia.org' }
];

export const GOVT_SCHEMES = [
  { title: 'PMMVY', fullName: 'Pradhan Mantri Matru Vandana Yojana', benefit: '₹5,000 for nutritional support', eligibility: 'Pregnant & Lactating' },
  { title: 'JSY', fullName: 'Janani Suraksha Yojana', benefit: 'Cash assistance for institutional delivery', eligibility: 'Rural/Urban low income' },
  { title: 'JSSK', fullName: 'Janani Shishu Suraksha Karyakram', benefit: 'Free diagnostics and delivery care', eligibility: 'Pregnant Women' },
  { title: 'PMSMA', fullName: 'Pradhan Mantri Surakshit Matritva Abhiyan', benefit: 'Free checkups on 9th of every month', eligibility: 'Pregnant Women T2/T3' },
  { title: 'LaQshya', fullName: 'Labour Room Quality Improvement', benefit: 'Assurance of safe dignified birth', eligibility: 'All public facilities' }
];
export const MOCK_CENTERS = [{ id: 1, name: 'IMS SUM Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28348, lng: 85.76966 },
{ id: 2, name: 'Institute of Dental Sciences', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28285, lng: 85.76737 },
{ id: 3, name: 'Usthi Hospital And Research Centre', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29353, lng: 85.81129 },
{ id: 4, name: "Lion's Eye Hospital", type: 'hospital', distance: '', address: 'Nayapalli, Bhubaneswar', phone: 'N/A', lat: 20.29323, lng: 85.81142 },
{ id: 5, name: 'kids hospital ground', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24428, lng: 85.78514 },
{ id: 6, name: 'Zenith Clinic', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26100, lng: 85.78631 },
{ id: 7, name: 'Apollo Hospitals', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.30564, lng: 85.83164 },
{ id: 8, name: 'Shree Hospitals', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24837, lng: 85.84152 },
{ id: 9, name: 'Care hospital unit 2', type: 'hospital', distance: '', address: 'Prachi Enclave, Bhubaneswar', phone: 'N/A', lat: 20.32143, lng: 85.81286 },
{ id: 10, name: 'Jagannath Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28995, lng: 85.84486 },
{ id: 11, name: 'Jagannath Seva Sadan', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26058, lng: 85.83729 },
{ id: 12, name: 'Millenium Hospitals Private Limited', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28597, lng: 85.80732 },
{ id: 13, name: 'Lions Eye Hospital, Khordha', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29328, lng: 85.81172 },
{ id: 14, name: 'Sanjeevani Medicare', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23223, lng: 85.84141 },
{ id: 15, name: 'Matrenity Care Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29433, lng: 85.84415 },
{ id: 16, name: 'Sneha Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24538, lng: 85.83891 },
{ id: 17, name: 'Utkal Polyclinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24661, lng: 85.82431 },
{ id: 18, name: 'Utkal Ayurveda Pratisthan', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26545, lng: 85.83309 },
{ id: 19, name: 'Satayu Hospital and Diabetic Research Centre', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26360, lng: 85.84679 },
{ id: 20, name: 'Satabdi Gynaec Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28292, lng: 85.83356 },
{ id: 21, name: 'Saswat Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25525, lng: 85.82947 },
{ id: 22, name: 'Pradyumna Bal Memorial Hospital (Kalinga Inst Of Medical Sciences)', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.35347, lng: 85.81549 },
{ id: 23, name: 'Sun Flower Nursing Home', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26106, lng: 85.84271 },
{ id: 24, name: 'Sparsh Hospital & Critical Care Pvt. Ltd.', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29540, lng: 85.84332 },
{ id: 25, name: 'Panda Nursing Home Pvt Ltd', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27471, lng: 85.84736 },
{ id: 26, name: 'Hi Tech Medical College, Bhubaneswar', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.30391, lng: 85.87846 },
{ id: 27, name: 'Hemlata Hospitals and Research Centre', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31594, lng: 85.81688 },
{ id: 28, name: 'Padma Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27182, lng: 85.84931 },
{ id: 29, name: 'Ayush Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29614, lng: 85.83412 },
{ id: 30, name: 'Auro Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27526, lng: 85.79316 },
{ id: 31, name: 'Lv Prasad Eye Institute', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.34641, lng: 85.81617 },
{ id: 32, name: 'Deepak Clinic And Nursing Home', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29223, lng: 85.84472 },
{ id: 33, name: 'Neelachal Hospital Pvt Ltd - Bhubaneshwar', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: '+ 1235 2355 98', lat: 20.27079, lng: 85.84543 },
{ id: 34, name: 'Annapurna Memorial Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24646, lng: 85.83661 },
{ id: 35, name: 'Life Line Clinic and Nursing Home, Khordha', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29712, lng: 85.81643 },
{ id: 36, name: 'Kar Vision Eye Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27978, lng: 85.84423 },
{ id: 37, name: 'Aditya Ashwini Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.33021, lng: 85.82248 },
{ id: 38, name: 'Kanungo Insitute Of Diabetes Specialities', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24505, lng: 85.78513 },
{ id: 39, name: 'Vision Care Eye Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28468, lng: 85.84962 },
{ id: 40, name: 'Ananta Jyot Eye Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31491, lng: 85.82162 },
{ id: 41, name: 'Bhubaneswar Medical Research Institute and Nursing Home', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32191, lng: 85.81986 },
{ id: 42, name: 'Krishna Nursing Home, Khordha', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28837, lng: 85.81443 },
{ id: 43, name: 'Secretariate Zonal Dispensary', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27394, lng: 85.83846 },
{ id: 44, name: "Dr. Ajoy Mishra's Residence", type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23219, lng: 85.84166 },
{ id: 45, name: 'Janani Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.21690, lng: 85.85243 },
{ id: 46, name: 'Health Cure Physiotherapy Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.22592, lng: 85.84371 },
{ id: 47, name: 'Prava Life Care', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.22394, lng: 85.84462 },
{ id: 48, name: 'Muncipal Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23095, lng: 85.84204 },
{ id: 49, name: 'Sara Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23493, lng: 85.84294 },
{ id: 50, name: 'Maa Sakti Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.22223, lng: 85.84378 },
{ id: 51, name: 'Dr. R.N Rath', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.22986, lng: 85.84474 },
{ id: 52, name: 'Sara Gastro & Laparoscopic Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23750, lng: 85.84036 },
{ id: 53, name: 'Sri Khetra Poly Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23145, lng: 85.84371 },
{ id: 54, name: 'Sunshine Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.21837, lng: 85.85085 },
{ id: 55, name: 'Dr. S.N Das', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25237, lng: 85.78330 },
{ id: 56, name: 'Shrushti Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26249, lng: 85.79554 },
{ id: 57, name: 'Government Ayurvedic Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26084, lng: 85.78702 },
{ id: 58, name: "Dr. Sahoo's Unique Ayur Clinic", type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27821, lng: 85.79582 },
{ id: 59, name: 'OM Healthcare Centre', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31511, lng: 85.82206 },
{ id: 60, name: 'Shreema Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32497, lng: 85.81951 },
{ id: 61, name: 'Taj Homeo Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27812, lng: 85.79622 },
{ id: 62, name: 'Dr. Ranjit Panigrahi Cabin', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31440, lng: 85.81833 },
{ id: 63, name: 'Eye Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.35196, lng: 85.82654 },
{ id: 64, name: "Dr. Moharana's Homeopathy Clinic", type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24017, lng: 85.78856 },
{ id: 65, name: 'Grand Vision and Eye Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27210, lng: 85.80050 },
{ id: 66, name: 'Advanced Eye Care Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27854, lng: 85.79482 },
{ id: 67, name: 'Dr. S.K Tripati', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.35484, lng: 85.82680 },
{ id: 68, name: 'A1Care Poly Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31489, lng: 85.82249 },
{ id: 69, name: 'Netra Jyoti Eye Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.34312, lng: 85.81956 },
{ id: 70, name: 'Hillside Nursing Home', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25397, lng: 85.78790 },
{ id: 71, name: 'Bhubaneshwar Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.33396, lng: 85.80974 },
{ id: 72, name: 'Baidyanath Memorial Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.34235, lng: 85.82337 },
{ id: 73, name: 'Life Care Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.35421, lng: 85.82738 },
{ id: 74, name: 'Bhubaneshwar Multispeciality Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26983, lng: 85.80544 },
{ id: 75, name: 'Pen Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.34745, lng: 85.82401 },
{ id: 76, name: 'Multicare Homeopathy Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32811, lng: 85.82044 },
{ id: 77, name: 'ECOS Rotary Royal Eye Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.35841, lng: 85.83193 },
{ id: 78, name: 'L V Prasad Eye Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.35109, lng: 85.82530 },
{ id: 79, name: "Dr. Dalal's Clinic", type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27593, lng: 85.79503 },
{ id: 80, name: 'Chandrasekharpur Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32942, lng: 85.81777 },
{ id: 81, name: 'Dr. Abhipsa Mishra', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.33973, lng: 85.82109 },
{ id: 82, name: 'Gastro and Kidney Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32496, lng: 85.82026 },
{ id: 83, name: 'Baramunda Eye & ENT Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27795, lng: 85.79557 },
{ id: 84, name: 'Dr. Ranadhir Mitra', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32190, lng: 85.81544 },
{ id: 85, name: 'Netralaya Eye Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31495, lng: 85.82144 },
{ id: 86, name: 'Health Point Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32575, lng: 85.81914 },
{ id: 87, name: 'Apex Hospital and Maternity Centre', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27309, lng: 85.79863 },
{ id: 88, name: 'Kamilini Homeo Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26089, lng: 85.78707 },
{ id: 89, name: 'Nurture Mother and Child Healthcare', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.34150, lng: 85.82222 },
{ id: 90, name: 'Dr. Laxmidhar Subudhi', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27760, lng: 85.79481 },
{ id: 91, name: 'Sree Sai Ayurveda Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31515, lng: 85.82123 },
{ id: 92, name: 'Utkal Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32277, lng: 85.80049 },
{ id: 93, name: 'Dr. Ashis Acharya', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31515, lng: 85.82088 },
{ id: 94, name: 'Bhubaneshwar Superspeciality Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31005, lng: 85.83445 },
{ id: 95, name: 'Ek Dantaya Dental Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.34682, lng: 85.82336 },
{ id: 96, name: 'Central Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32118, lng: 85.83556 },
{ id: 97, name: 'Government Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32867, lng: 85.81804 },
{ id: 98, name: 'Patholab and Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26955, lng: 85.80039 },
{ id: 99, name: 'Maxfort Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.33978, lng: 85.82107 },
{ id: 100, name: 'Baramunda Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27217, lng: 85.80273 },
{ id: 101, name: 'Care and Cure Physiotherapy Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27969, lng: 85.79742 },
{ id: 102, name: 'Dr. Pushpa Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27531, lng: 85.79431 },
{ id: 103, name: 'City Primary Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32859, lng: 85.83856 },
{ id: 104, name: "Dr. S S Patra's Clinic", type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28713, lng: 85.79114 },
{ id: 105, name: "Dr. B B Karan's Brain Clinic", type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26904, lng: 85.80283 },
{ id: 106, name: 'Government Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.33026, lng: 85.81422 },
{ id: 107, name: 'Dr. Samir Sahu', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.35491, lng: 85.82653 },
{ id: 108, name: 'Dr. G B Nanda', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32940, lng: 85.82056 },
{ id: 109, name: 'Baramunda Homeopathy Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26709, lng: 85.79940 },
{ id: 110, name: 'Rotary Eye Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.35779, lng: 85.83293 },
{ id: 111, name: 'Mamata Clinic & Lab', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.35490, lng: 85.83004 },
{ id: 112, name: 'Sun Hospital Information Centre', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.33206, lng: 85.81854 },
{ id: 113, name: 'Ever Healthy Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24900, lng: 85.78597 },
{ id: 114, name: 'Varsha Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31512, lng: 85.82124 },
{ id: 115, name: 'Oro Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26926, lng: 85.80460 },
{ id: 116, name: 'Ayurprakruthi Ayurveda Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26014, lng: 85.78575 },
{ id: 117, name: 'Mamata Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32163, lng: 85.81750 },
{ id: 118, name: 'Dr. Sharimili Sinha', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31554, lng: 85.83517 },
{ id: 119, name: 'Dr. Satyabrata Das', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.32143, lng: 85.81467 },
{ id: 120, name: 'Dr. Bijoy Kumar Sahoo', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.35539, lng: 85.82524 },
{ id: 121, name: 'Srujana Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31554, lng: 85.82136 },
{ id: 122, name: 'Satyam Health Centre', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28657, lng: 85.85939 },
{ id: 123, name: 'Dr. Abhay Sahoo', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29625, lng: 85.82521 },
{ id: 124, name: 'Jeevan Rekha Nursing Home', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29217, lng: 85.81098 },
{ id: 125, name: 'Trinity Neuro Hospital and Trauma Centre', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29504, lng: 85.83974 },
{ id: 126, name: 'Sabita Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24129, lng: 85.82503 },
{ id: 127, name: "Dr. Mohan's Diabetes Specialities Centre", type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28635, lng: 85.85723 },
{ id: 128, name: 'Dr. B.P Satpathy', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25035, lng: 85.84183 },
{ id: 129, name: "Dr. Agarwal's Eye Hospital", type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28703, lng: 85.84658 },
{ id: 130, name: 'Vandana Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25804, lng: 85.83489 },
{ id: 131, name: 'Satyam Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25904, lng: 85.83664 },
{ id: 132, name: 'Dr. Naresh Chandra Acharya', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23729, lng: 85.81465 },
{ id: 133, name: 'Gastro and Kidney Care Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28783, lng: 85.81065 },
{ id: 134, name: 'Dr. Niranjan Sahu', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26140, lng: 85.84918 },
{ id: 135, name: 'Aum Ambe Ayurvedic Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28513, lng: 85.85587 },
{ id: 136, name: 'Dr. S.K Kabi', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23416, lng: 85.81535 },
{ id: 137, name: 'Dr. Anita Lenka', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29673, lng: 85.85866 },
{ id: 138, name: 'Lath ENT Centre', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28147, lng: 85.85541 },
{ id: 139, name: 'Dr. Bharat Panigrahi', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29669, lng: 85.80518 },
{ id: 140, name: 'Laxmi Brain Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23620, lng: 85.81299 },
{ id: 141, name: 'Dr. Dibiya Singh', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29658, lng: 85.83278 },
{ id: 142, name: 'Sunshine Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26906, lng: 85.84837 },
{ id: 143, name: 'Winika Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28690, lng: 85.84706 },
{ id: 144, name: 'Dr. Ashish Patnaik Med Spl', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29576, lng: 85.80913 },
{ id: 145, name: 'Astang Ayurvedic Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24158, lng: 85.80608 },
{ id: 146, name: 'Global Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27275, lng: 85.83578 },
{ id: 147, name: 'Dr. PK Pradhan', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28758, lng: 85.85002 },
{ id: 148, name: 'ASG Eye Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27465, lng: 85.84560 },
{ id: 149, name: 'Sai Kids Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24511, lng: 85.84407 },
{ id: 150, name: 'Global Health Care', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26093, lng: 85.83882 },
{ id: 151, name: 'Maya Health Care', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28348, lng: 85.85633 },
{ id: 152, name: 'Dr. Chitta Ranjan Kar', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23696, lng: 85.83138 },
{ id: 153, name: 'National City Medical', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28132, lng: 85.84810 },
{ id: 154, name: 'Sanjeevani Panchakarma Center and Piles Clinic', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28732, lng: 85.85938 },
{ id: 155, name: 'Mamata Chikitsalaya', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25412, lng: 85.83013 },
{ id: 156, name: 'Sri Krishna Poly Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24372, lng: 85.85095 },
{ id: 157, name: 'Ghana Shyam Health Care', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28654, lng: 85.85030 },
{ id: 158, name: 'Aspire Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25570, lng: 85.83886 },
{ id: 159, name: 'Santosh Memorial Hospital and Rehabilitation Centre', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29839, lng: 85.82018 },
{ id: 160, name: 'Mohan Prava Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23482, lng: 85.81906 },
{ id: 161, name: 'Power Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29409, lng: 85.83659 },
{ id: 162, name: 'Vikash Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25812, lng: 85.84618 },
{ id: 163, name: 'Amri Hospitals', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28809, lng: 85.84665 },
{ id: 164, name: 'Unique Ayur Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29750, lng: 85.80530 },
{ id: 165, name: 'Dr. P C Rath', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29485, lng: 85.82930 },
{ id: 166, name: 'Government Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24620, lng: 85.80812 },
{ id: 167, name: 'Anvi ENT & Head, Neck Centre', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29134, lng: 85.85772 },
{ id: 168, name: 'Tripathi Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29502, lng: 85.81277 },
{ id: 169, name: 'Shharc Homeopathy Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28253, lng: 85.85750 },
{ id: 170, name: 'Chakadola Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24456, lng: 85.84126 },
{ id: 171, name: 'Dr. Sanjukta Mohapatra', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25998, lng: 85.81772 },
{ id: 172, name: 'Riva Child and Skin Care', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23728, lng: 85.82119 },
{ id: 173, name: 'Carex Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23421, lng: 85.81550 },
{ id: 174, name: 'Sundarpada Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23198, lng: 85.81569 },
{ id: 175, name: 'Dr. Debabrata Padhy Bone and Joint Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26531, lng: 85.84882 },
{ id: 176, name: 'Laxmi Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23648, lng: 85.81308 },
{ id: 177, name: 'Healthline Multi Speciality Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28798, lng: 85.86102 },
{ id: 178, name: 'Niki Skin Care', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29572, lng: 85.83153 },
{ id: 179, name: 'Laggicare Surgical Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25470, lng: 85.83438 },
{ id: 180, name: 'Nicky Home Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28667, lng: 85.83914 },
{ id: 181, name: 'Ananya Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26101, lng: 85.85136 },
{ id: 182, name: 'Dr. Paresh Patnaik', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26094, lng: 85.84283 },
{ id: 183, name: 'Dr. S. N. Mohanty', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26075, lng: 85.84295 },
{ id: 184, name: 'Pedi Skin Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29656, lng: 85.82970 },
{ id: 185, name: 'Police Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29374, lng: 85.82591 },
{ id: 186, name: 'Shishu Bhavan Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25460, lng: 85.83204 },
{ id: 187, name: 'Prachi Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29608, lng: 85.81218 },
{ id: 188, name: 'Government Ayurvedic Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25253, lng: 85.83802 },
{ id: 189, name: 'Saraswat Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.28895, lng: 85.85383 },
{ id: 190, name: 'Pradhan Homeo Clinic', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.24830, lng: 85.85221 },
{ id: 191, name: 'Dr. Amitav Mohanty', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29225, lng: 85.81593 },
{ id: 192, name: 'Dr. S B Mohanty', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29228, lng: 85.81093 },
{ id: 193, name: 'Dr. Suvendu Narayan Mishra', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29637, lng: 85.83184 },
{ id: 194, name: 'Neev Child Care', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29154, lng: 85.81463 },
{ id: 195, name: 'Prayas Health Care', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25536, lng: 85.82888 },
{ id: 196, name: 'Government Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29431, lng: 85.81368 },
{ id: 197, name: 'Satyam Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29734, lng: 85.81654 },
{ id: 198, name: 'SimpleeKare Clinic', type: 'clinic', distance: '', address: 'Nayapalli, IRC Village, Bhubaneswar', phone: 'N/A', lat: 20.29165, lng: 85.80851 },
{ id: 199, name: 'Vivekananda Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27930, lng: 85.80023 },
{ id: 200, name: 'Dewdrops Aesthetic Center', type: 'doctors', distance: '', address: 'Forest Park, Bhubaneswar', phone: 'N/A', lat: 20.25633, lng: 85.82405 },
{ id: 201, name: 'Kar Clinic And Hospital Pvt Ltd', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27726, lng: 85.83332 },
{ id: 202, name: 'CGHS', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27943, lng: 85.82935 },
{ id: 203, name: 'Shree Narayana Speech And Hearing Centre', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.31799, lng: 85.88144 },
{ id: 204, name: 'IGKC Multispecialty Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27434, lng: 85.76403 },
{ id: 205, name: 'Manipal Hospital Bhubaneswar', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.26017, lng: 85.77753 },
{ id: 206, name: 'SWARNA HOSPITAL', type: 'hospital', distance: '', address: 'Jayadev Vihar, Bhubaneswar', phone: 'N/A', lat: 20.29946, lng: 85.82068 },
{ id: 207, name: 'Kalinga Hospital', type: 'hospital', distance: '', address: 'Chandrasekharpur, Bhubaneswar', phone: 'N/A', lat: 20.31330, lng: 85.81860 },
{ id: 208, name: 'Capital Hospital (Bhubaneswar)', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: '0674-2391983', lat: 20.26013, lng: 85.82272 },
{ id: 209, name: 'ESI Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.30030, lng: 85.82086 },
{ id: 210, name: 'Unit-4 Govt. Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27992, lng: 85.82719 },
{ id: 211, name: 'CGHS', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27938, lng: 85.82935 },
{ id: 212, name: 'Kar Clinic And Hospital Pvt Ltd', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.27725, lng: 85.83332 },
{ id: 213, name: 'Hillside Nursing Home', type: 'clinic', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25397, lng: 85.78788 },
{ id: 214, name: 'Sara Gastro & Laparoscopic Hospital', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.25398, lng: 85.84584 },
{ id: 215, name: 'Dr. Abhay Sahoo', type: 'doctors', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.29623, lng: 85.82521 },
{ id: 216, name: 'Munna medicine store', type: 'hospital', distance: '', address: 'Bhubaneswar', phone: 'N/A', lat: 20.23996, lng: 85.83329 }
];
export const AUDIO_LIBRARY = [
  { type: 'audio', title: "Dear Zindagi", duration: "12m", mood: "Calm", src: "/music/DearZindagi.mp3", img: "/music/DearZindagi.jpeg" },
  { type: 'audio', title: "EdSheeran Perfect ", duration: "15m", mood: "Grounded", src: "/music/EdSheeranPerfect.mp3", img: "/music/EdSheeranPerfect.jpeg" },
  { type: 'audio', title: "Laadki ", duration: "8m", mood: "Fresh", src: "/music/Laadki.mp3", img: "/music/Laadki.jpeg" }
  , { type: 'audio', title: "Meri Duniya Tuhi Re  ", duration: "12m", mood: "Calm", src: "/music/MeriDuniyaTuhiRe.mp3", img: "/music/MeriDuniyaTuhiRe.webp" },
  { type: 'audio', title: "Until I Found You  ", duration: "15m", mood: "Grounded", src: "/music/UntilIFoundYou.mp3", img: "/music/UntilIFoundYou.jpg" },
  { type: 'audio', title: "ColdPlay Yellow", duration: "8m", mood: "Fresh", src: "/music/ColdPlayYellow.mp3", img: "/music/ColdPlayYellow.jpeg" }
]
export const RECIPES = [
  {
    id: 'r1',
    title: 'Golden Ginger Congee',
    duration: '20 min',
    intensity: 'Gentle',
    mood: 'Soothing',
    tags: ['Digestion', 'Warming'],
    description: 'A traditional rice porridge infused with fresh ginger and turmeric to soothe the digestive system.',
    image: '/SafeRecipies/GoldenGingerCongee.jpg'
  },
  {
    id: 'r2',
    title: 'Iron-Boost Beetroot Hummus',
    duration: '10 min',
    intensity: 'Fresh',
    mood: 'Energizing',
    tags: ['Iron', 'Blood Health'],
    description: 'Vibrant beetroot and chickpea blend to help replenish iron levels naturally.',
    image: '/SafeRecipies/IronBeetRootHumus.jpg'
  },
  {
    id: 'r3',
    title: 'Fenugreek Lactation Broth',
    duration: '45 min',
    intensity: 'Deep',
    mood: 'Nurturing',
    tags: ['Lactation', 'Recovery'],
    description: 'Slow-simmered vegetable broth with fenugreek seeds and fennel to support healthy milk supply.',
    image: '/SafeRecipies/FenugreekLactationBroath.jpg'
  },
  {
    id: 'r4',
    title: 'Warm Spinach & Date Salad',
    duration: '15 min',
    intensity: 'Light',
    mood: 'Balanced',
    tags: ['Fiber', 'Energy'],
    description: 'Sautéed baby spinach with sweet dates and toasted sesame for a quick energy boost.',
    image: '/SafeRecipies/SpinachDateSalad.jpg'
  },
  {
    id: 'r5',
    title: 'Turmeric Golden Milk',
    duration: '5 min',
    intensity: 'Gentle',
    mood: 'Restorative',
    tags: ['Anti-inflammatory', 'Sleep'],
    description: 'The classic healing drink with black pepper for maximum turmeric absorption.',
    image: '/SafeRecipies/TurmericGolldenMilk.jpg'
  },
  {
    id: 'r6',
    title: 'Oat & Flaxseed Energy Bites',
    duration: '15 min',
    intensity: 'Easy',
    mood: 'Joyful',
    tags: ['Snack', 'Omega-3'],
    description: 'No-bake bites with oats, flax, and honey for sustained energy throughout the day.',
    image: '/SafeRecipies/OAtFlaxSeedBites.jpg'
  },
  {
    id: 'r7',
    title: 'Mung Dal Healing Soup',
    duration: '30 min',
    intensity: 'Moderate',
    mood: 'Grounding',
    tags: ['Protein', 'Easy Digest'],
    description: 'Lightly spiced yellow lentils, perfect for the first few weeks of postpartum recovery.',
    image: '/SafeRecipies/MoongDalSoup.jpg'
  },
  {
    id: 'r8',
    title: 'Sesame & Jaggery Ladoo',
    duration: '20 min',
    intensity: 'Traditional',
    mood: 'Comforting',
    tags: ['Calcium', 'Sweet'],
    description: 'A traditional Indian treat rich in calcium and iron for bone health.',
    image: '/SafeRecipies/SesameJAggeryLaddo.jpg'
  },
  {
    id: 'r9',
    title: 'Papaya & Mint Smoothie',
    duration: '5 min',
    intensity: 'Cooling',
    mood: 'Refreshing',
    tags: ['Enzymes', 'Hydration'],
    description: 'Ripe papaya with fresh mint to aid digestion and provide a cooling effect.',
    image: '/SafeRecipies/PapayaMintSmoothie.jpg'
  },
  {
    id: 'r10',
    title: 'Roasted Cumin Buttermilk',
    duration: '2 min',
    intensity: 'Light',
    mood: 'Digestive',
    tags: ['Probiotic', 'Cooling'],
    description: 'A refreshing probiotic drink with roasted cumin to prevent bloating.',
    image: '/SafeRecipies/RoastedCuminButterMilk.jpg'
  }
];
export const VIDEO_LIBRARY = [
  {
    id: 'v1',
    title: 'Understanding the Fourth Trimester',
    duration: '8:24',
    category: 'Mental Health',
    youtubeId: 'kAUBBwj2GxA',
    thumbnail: '/VIDEOS/MaaMummyAurAchaar.jpg',
  },
  {

    id: 'v2',
    title: 'Postpartum Physical Recovery Guide',
    duration: '11:02',
    category: 'Physical Recovery',
    youtubeId: '7gL5xH1Fh9Q',
    thumbnail: '/VIDEOS/MomViddseecom.jpg',
  },
  {
    id: 'v3',
    title: 'Nutrition & Iron Recovery After Birth',
    duration: '6:15',
    category: 'Nutrition',
    youtubeId: '2NnN9N3kK1A',
    thumbnail: '/VIDEOS/TheChoice.jpg',
  },
  {
    id: 'v4',
    title: 'Safe Exercises: Diastasis Recti Recovery',
    duration: '14:30',
    category: 'Physical Recovery',
    youtubeId: 'kAUBBwj2GxA',
    thumbnail: '/VIDEOS/TheChoice.jpg',
  },
  {
    id: 'v5',
    title: 'Breastfeeding Basics & Latching Tips',
    duration: '9:47',
    category: 'Newborn Care',
    youtubeId: 'kAUBBwj2GxA',
    thumbnail: 'https://picsum.photos/seed/postpartum5/600/400',
  },
  {
    id: 'v6',
    title: 'Managing Postpartum Anxiety & Mood',
    duration: '12:18',
    category: 'Mental Health',
    youtubeId: 'kAUBBwj2GxA',
    thumbnail: 'https://picsum.photos/seed/postpartum6/600/400',
  },
];
export const TRUSTED_PICKS = [
  { brand: "Mamaearth", product: "Plant-Based Baby Wipes", reason: "Toxin-free & Biodegradable", tag: "Editor's Choice" },
  { brand: "FirstCry", product: "Organic Nursing Pads", reason: "Super absorbent, naturally breathable", tag: "Best Seller" },
  { brand: "Himalaya", product: "Ayurvedic Diaper Cream", reason: "Gentle healing since 1930", tag: "Trusted Heritage" }
];
export const ARTICLES = [
  { title: "Understanding the 'Fourth Trimester'", category: "Mental Health", readTime: "5 min", summary: "The transition from pregnancy to motherhood requires a different kind of clinical grace and internal patience." },
  { title: "C-Section Incision Care 101", category: "Physical Recovery", readTime: "8 min", summary: "Gentle techniques to ensure a smooth scar healing process and identifying early warning signs of infection." },
  { title: "Nutrients for Iron Recovery", category: "Nutrition", readTime: "4 min", summary: "Traditional Indian superfoods to rebuild your vitality after blood loss, optimized for modern lifestyles." },
  { title: "Diastasis Recti Self-Check", category: "Physical Recovery", readTime: "6 min", summary: "A step-by-step clinical guide to assessing abdominal separation and safe restorative exercises." },
];
export const COMMUNITY_INSIGHTS = [
  {
    category: "Emotional Resilience",
    stat: "78%",
    insight: "of mothers in our community found that daily 5-minute grounding loops significantly reduced evening anxiety.",
    tag: "Mental Wellness"
  },
  {
    category: "Physical Recovery",
    stat: "92%",
    insight: "of postpartum users reported feeling more empowered after their first guided pelvic floor session.",
    tag: "Care Journey"
  },
  {
    category: "Peer Support",
    stat: "1,200+",
    insight: "Sisters Circles formed this month, connecting women across diverse motherhood paths.",
    tag: "Care Connect"
  },
  {
    category: "Nutrition",
    stat: "Top Choice",
    insight: "Warm Ginger & Turmeric tea remains the most logged comfort food during the first month postpartum.",
    tag: "Nutrition"
  }
];