import React, { useState, useEffect, useRef } from 'react';

const IconMess = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
);

const IconMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
);

const IconBreakfast = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/><path d="m15 15 6 6"/><path d="M11 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
  </svg>
);

const IconLunch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
  </svg>
);

const IconSnacks = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>
  </svg>
);

const IconDinner = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><path d="M12 9v6"/><path d="M9 12h6"/>
  </svg>
);

const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

type MealCategories = { [key: string]: string; };
type MealPlan = { breakfast: MealCategories; lunch: MealCategories; snacks: MealCategories; dinner: MealCategories; };
type DayMenu = { day: string; meals: MealPlan; };
type WeeklyMenu = DayMenu[];

const MESS_DATA: { week1: WeeklyMenu; week2: WeeklyMenu } = {
  week1: [
    { day: 'Sunday', meals: { breakfast: { "North Indian": "Aloo Parantha, Pickle", "South Indian": "Mysore Bonda, Peanut Chutney", "Continental/Special": "Cold Sandwich, Tomato Ketchup", "Essentials": "White Bread, Jam, Butter, Tea, Coffee, Plain Milk" }, lunch: { "South Indian": "Kara Kuzhambu, Carrot Poriyal, Puliogare", "North Indian": "Pindi Chole, Khatta Meetha Petha", "Breads & Rice": "Bhatura, Roti, Plain Rice", "Accompaniments": "Onion Raita, Green Salad" }, snacks: { "Snack": "Kulcha, Nutri Gravy", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Mysore Sambhar, Cauliflower Poriyal", "North Indian": "Dal Dhaba, Aloo Baigan Tamatar ka Chokha", "Breads & Rice": "Roti, Bhuna Onion Pulao, Plain Rice", "Dessert": "Gulab Jamun", "Accompaniments": "Fryums, Green Salad" } } },
    { day: 'Monday', meals: { breakfast: { "North Indian": "Stuffed Mix Prantha, Packed Curd", "South Indian": "Vegetable Rawa Upma, Coconut Chutney", "Continental/Special": "Red Sauce Pasta, Tomato Ketchup", "Healthy Option": "Masala Barnyard (Bajra) Millet", "Essentials": "White Bread, Jam, Butter, Tea, Coffee" }, lunch: { "South Indian": "Sambhar, Cabbage Dal Kootu", "North Indian": "Dal MiliJuli, Manchurian", "Breads & Rice": "Roti, Fried Rice, Plain Rice", "Accompaniments": "Boondi Raita, Fryums" }, snacks: { "Snack": "Hakka Noodles, Tomato Ketchup", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Mudha Pappu, Aloo Green Peas Poriyal, Thakkali Sadam", "North Indian": "Yellow Dal Fry, Kadai Paneer", "Breads & Rice": "Roti, Plain Rice", "Dessert": "Semiya Kheer", "Accompaniments": "Green Salad" } } },
    { day: 'Tuesday', meals: { breakfast: { "North Indian": "Poori, Aloo Curry", "South Indian": "Idli, Sambhar, Coconut Chutney", "Continental/Special": "Vermicelli Upma, Tomato Ketchup", "Essentials": "White Bread, Jam, Butter, Tea, Coffee, Plain Milk, Banana" }, lunch: { "South Indian": "Chettinad Rasam, Beetroot Kadala Thoran, Chitranna Rice", "North Indian": "Rajma, Mix Veg", "Breads & Rice": "Roti, Plain Rice", "Accompaniments": "Mix-Veg Raita, Green Salad" }, snacks: { "Snack": "Vada Pav, Tomato Ketchup", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Beerakaya Pappu, Chikkudukaya Curry", "North Indian": "Palak Corn Masala, Aloo Matar Gravy", "Breads & Rice": "Roti, Veg Dum Biryani, Plain Rice, Makai Roti/Poori", "Dessert": "Suji Halwa", "Accompaniments": "Appalam" } } },
    { day: 'Wednesday', meals: { breakfast: { "North Indian": "Kulcha (Toasted), Chana Gravy", "South Indian": "Mix Veg Uthappam, Sambhar, Coconut Chutney", "Continental/Special": "Vegetable Pasta, Tomato Ketchup", "Essentials": "Brown Bread, Jam, Butter, Tea, Coffee, Plain Milk" }, lunch: { "South Indian": "Mysore Sambar, Veg Chettinad", "North Indian": "Ghia Kofta Curry, Aloo Gajar Matar", "Breads & Rice": "Roti, Jeera Onion Pulao, Plain Rice", "Accompaniments": "Lauki Mint Raita, Fryums" }, snacks: { "Snack": "Bombay Sandwich, Tomato Ketchup", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Parippu Sambar, Gutti Vankaya, Puliogare", "North Indian": "Maah Ki Dal, Aloo Gobhi Matar", "Breads & Rice": "Roti, Plain Rice", "Dessert": "Rasgulla", "Accompaniments": "Fryums" } } },
    { day: 'Thursday', meals: { breakfast: { "North Indian": "Plain Paratha, Matar Gravy (Dry Matar)", "South Indian": "Medu Vada, Sambhar", "Continental/Special": "Veg. Stuffed Toast, Tomato Ketchup", "Essentials": "White Bread, Jam, Butter, Tea, Coffee, Plain Milk" }, lunch: { "South Indian": "Sorakkai Kootu, Chettinad Rasam", "North Indian": "Punjabi Kadhi Pakoda, Aloo Cabbage Matar", "Breads & Rice": "Roti, Khuska, Plain Rice", "Accompaniments": "Majjiga Pulusu, Green Salad" }, snacks: { "Snack": "Besan Aloo Tikki, Green Chutney", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Pudina Rasam, Beans Foogath", "North Indian": "Dal Palak, Paneer Do Pyaza/Shahi Paneer", "Breads & Rice": "Roti, Matar Pulao, Plain Rice", "Dessert": "Gajar Ka Halwa", "Accompaniments": "Green Salad" } } },
    { day: 'Friday', meals: { breakfast: { "North Indian": "Stuffed Mooli Parantha, Packed Curd", "South Indian": "Rava Kesari, Sambhar, Peanut Chutney", "Continental/Special": "Aloo Bonda, Tomato Chutney", "Healthy Option": "Moong Sprouts", "Essentials": "White Bread, Jam, Butter, Tea, Coffee" }, lunch: { "South Indian": "Mulangi Sambhar, Bagara Baingan", "North Indian": "Black Channa, Nutri Chilly", "Breads & Rice": "Roti, Veg Pulao, Plain Rice", "Accompaniments": "Beetroot Raita, Fryums" }, snacks: { "Snack": "Bread Roll, Tomato Ketchup", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Senaga Pappu, Mix Veg Palya", "North Indian": "Channa Dal, Manchurian", "Breads & Rice": "Roti, Fried Rice, Plain Rice", "Dessert": "Balushahi", "Accompaniments": "Green Salad" } } },
    { day: 'Saturday', meals: { breakfast: { "North Indian": "Soya Paneer Parantha, Pickle", "South Indian": "Minapa Punugullu, Peanut Chutney", "Continental/Special": "Indori Poha, Tomato Ketchup", "Essentials": "White Bread, Jam, Butter, Tea, Coffee, Plain Milk, Seasonal Fruit" }, lunch: { "South Indian": "Paruppu Urundai Kulambu, Potato Podimas, Thakkali Sadam", "North Indian": "Matar Paneer/Mushroom, Aloo Gobhi Adraki", "Breads & Rice": "Roti, Plain Rice", "Accompaniments": "Dahi Bhalla, Green Salad, Imly Chutney" }, snacks: { "Snack": "Samosa, Imly Chutney, Aloo Sabji", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Vengaya Sambhar (Onion), Artikai Vepudu", "North Indian": "Rajma, Tawa Veg", "Breads & Rice": "Roti, Plain Rice", "Dessert": "Moong Dal Halwa/Besan Burfi", "Accompaniments": "Green Salad" } } }
  ],
  week2: [
    { day: 'Sunday', meals: { breakfast: { "North Indian": "Stuffed Mix Prantha, Pickle", "South Indian": "Hot Pongal, Sambhar, Peanut Chutney", "Continental/Special": "Mangalore Bajji, Tomato Ketchup", "Essentials": "Brown Bread, Jam, Butter, Tea, Coffee, Plain Milk" }, lunch: { "South Indian": "Garlic Pepper Rasam, Vada Curry/Gutti Vankaya", "North Indian": "Pindi Chole, Aloo Pyaz Masaledar", "Breads & Rice": "Bhatura, Roti, Plain Rice", "Accompaniments": "Boondi Raita, Green Salad" }, snacks: { "Snack": "Kachouri, Aloo Sabji, Green Chutney", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Thakkali Sambhar, Potato Peas Poriyal", "North Indian": "Hari Moong Dal, Soya Chap Makhni", "Breads & Rice": "Roti, Veg Pulao, Plain Rice", "Dessert": "Besan Burfi/Sweet Pongal", "Accompaniments": "Fryums" } } },
    { day: 'Monday', meals: { breakfast: { "North Indian": "Stuffed Aloo Parantha, Packed Curd", "South Indian": "Avalakki Bath, Coconut Chutney", "Continental/Special": "Bread Cutlet, Tomato Ketchup", "Healthy Option": "Mix Dal Sprouts", "Essentials": "Brown Bread, Jam, Butter, Tea, Coffee, Banana" }, lunch: { "South Indian": "Tomato Dhal Kootu, Vegetable Sagu, Bisibele Bath", "North Indian": "Dal Makhni, Methi Malai Mattar", "Breads & Rice": "Roti, Plain Rice", "Accompaniments": "Cucumber/Ghia Raita, Fryums" }, snacks: { "Snack": "Veg Bajji, Green Chutney, Tomato Ketchup", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Tomato Pappu, Cauliflower Poriyal", "North Indian": "Moong Masoor Dal, Aloo Matar Dry", "Breads & Rice": "Roti, Jeera Rice, Plain Rice", "Dessert": "Gulab Jamun", "Accompaniments": "Green Salad" } } },
    { day: 'Tuesday', meals: { breakfast: { "North Indian": "Plain Parantha, Veg Bhaji", "South Indian": "Minapa Punugullu, Peanut Chutney", "Continental/Special": "Cold Sandwich, Tomato Ketchup", "Essentials": "Brown Bread, Jam, Butter, Tea, Coffee, Plain Milk" }, lunch: { "South Indian": "Drum Stick Sambhar, Veg Kadamba Poriyal, Coconut Rice", "North Indian": "Lobia Dal, Mix Veg", "Breads & Rice": "Roti, Plain Rice", "Accompaniments": "Mix-Veg Raita, Green Salad" }, snacks: { "Snack": "French Fries, Tomato Ketchup", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Ridge Gourd Pappu, Paneer Chettinad Curry, Chitranna Rice", "North Indian": "Kadai Dal Fry, Paneer Butter Masala", "Breads & Rice": "Roti, Plain Rice", "Dessert": "Payasam", "Accompaniments": "Appalam" } } },
    { day: 'Wednesday', meals: { breakfast: { "North Indian": "Poori, Aloo Bhaji", "South Indian": "Vegetable Rawa Upma, Sambhar, Coconut Chutney", "Continental/Special": "Black Chana Masala, Pickle", "Essentials": "White Bread, Jam, Butter, Tea, Coffee, Plain Milk" }, lunch: { "South Indian": "Palakura Pappu, Aloo Palak Tomato, Pudina Rice", "North Indian": "Hari Moong Dal, Veg Kofta Curry", "Breads & Rice": "Roti, Plain Rice", "Accompaniments": "Boondi Raita, Green Salad" }, snacks: { "Snack": "Veg Coleslaw S/W, Green Chutney", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Guntur Spiced Rasam, Brinjal Poriyal, Puliogare", "North Indian": "Rajma Rasila, Aloo Methi Masala", "Breads & Rice": "Roti, Jeera Rice, Plain Rice", "Dessert": "Boondi Laddu", "Accompaniments": "Green Salad" } } },
    { day: 'Thursday', meals: { breakfast: { "North Indian": "Stuffed Gobhi/Onion Prantha, Pickle", "South Indian": "Idli, Sambhar, Coconut Chutney", "Continental/Special": "Vegetable Macroni, Tomato Ketchup", "Essentials": "Brown Bread, Jam, Butter, Tea, Coffee, Plain Milk" }, lunch: { "South Indian": "Malabari Sambhar, Potato Wedges, Masala Sadam", "North Indian": "Punjabi Kadhi, Aloo Bengan", "Breads & Rice": "Roti, Plain Rice", "Accompaniments": "Majjiga Pulusu, Green Salad" }, snacks: { "Snack": "Pav (2 Pc), Bhaji", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Meal Maker Curry, Mix Veg Poriyal", "North Indian": "White Chana, Aloo Gajar Matar", "Breads & Rice": "Roti, Veg Pulao, Plain Rice", "Dessert": "Gajar Ka Halwa", "Accompaniments": "Green Salad" } } },
    { day: 'Friday', meals: { breakfast: { "North Indian": "Missa Prantha, Packed Curd", "South Indian": "Vermicelli Upma, Tomato Ketchup", "Continental/Special": "Aloo Bonda, Coconut Chutney", "Healthy Option": "Broken Wheat Upma", "Essentials": "White Bread, Jam, Butter, Tea, Coffee" }, lunch: { "South Indian": "Tamarind Rasam, Avial, Karuveppilai Sadam(Curry leaf)", "North Indian": "Dal Palak, Aloo Gobhi Matar", "Breads & Rice": "Roti, Jeera Rice, Plain Rice", "Accompaniments": "Lauki Mint Raita, Fryums" }, snacks: { "Snack": "Samosa, Imly Chutney", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Pasi Paruppu Sambar, Kerala Urulai Roast, Mint Rice", "North Indian": "Dal Makhni, Gobhi Manchurian", "Breads & Rice": "Roti, Fried Rice, Plain Rice", "Dessert": "Fruit Custard", "Accompaniments": "Green Salad" } } },
    { day: 'Saturday', meals: { breakfast: { "North Indian": "Plain Parantha, Soya Paneer Bhurji", "South Indian": "Medu Vada, Sambhar, Tomato Ketchup", "Continental/Special": "Indori Poha, Tomato Ketchup", "Essentials": "Brown Bread, Jam, Butter, Tea, Coffee, Plain Milk" }, lunch: { "South Indian": "Black Channa Palya, Cabbage 65, Andhara Veg Biryani", "North Indian": "Rajma, Palak Paneer/Kadai Paneer", "Breads & Rice": "Roti, Plain Rice", "Accompaniments": "Dahi Bhalla, Green Salad, Imly Chutney" }, snacks: { "Snack": "Aloo Chana Chaat", "Beverage": "Tea, Coffee" }, dinner: { "South Indian": "Kandhi Pappu, Beans Kala Chana Poriyal", "North Indian": "Whole Masoor Dal, Aloo Beans", "Breads & Rice": "Roti, Corn Coriander Pulao, Plain Rice", "Accompaniments": "Fryums" } } }
  ]
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CampusNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mess' | 'map'>('mess');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reference logic: Treat Today (Feb 27, 2025) as Thursday, Week 2.
  const REF_SUNDAY = new Date('2025-02-23T00:00:00Z').getTime();
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  
  const now = Date.now();
  const actualToday = new Date(now).toLocaleDateString('en-US', { weekday: 'long' });
  
  const weeksPassed = Math.floor((now - REF_SUNDAY) / MS_PER_WEEK);
  const weekCycle = (weeksPassed % 2 === 0) ? 2 : 1;

  const [currentWeek, setCurrentWeek] = useState<1 | 2>(weekCycle as 1 | 2);
  const [selectedDay, setSelectedDay] = useState<string>(actualToday);

  // Modal & Floating Button State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [reportForm, setReportForm] = useState({
    hostelName: '',
    issueDetails: '',
    imageProof: null as string | null
  });

  useEffect(() => {
    // Auto-scroll to today button
    if (activeTab === 'mess') {
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          const todayElement = scrollContainerRef.current.querySelector(`[data-day="${actualToday}"]`);
          if (todayElement) {
            todayElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [activeTab, actualToday]);

  // Monitor scroll on the main app container with higher frequency and check
  useEffect(() => {
    const mainArea = document.getElementById('main-content-area');
    
    const handleScroll = () => {
      if (mainArea) {
        // More sensitive trigger for the button
        setShowScrollTop(mainArea.scrollTop > 200);
      }
    };
    
    if (mainArea) {
      mainArea.addEventListener('scroll', handleScroll, { passive: true });
      // Run once to initialize state
      handleScroll();
      return () => mainArea.removeEventListener('scroll', handleScroll);
    }
  }, [activeTab]);

  const scrollToTop = () => {
    const mainArea = document.getElementById('main-content-area');
    if (mainArea) {
      mainArea.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentMenuData = currentWeek === 1 ? MESS_DATA.week1 : MESS_DATA.week2;
  const selectedMeals = currentMenuData.find(m => m.day === selectedDay)?.meals;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportForm(prev => ({ ...prev, imageProof: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.hostelName || !reportForm.issueDetails) {
      alert("Please fill in the required fields.");
      return;
    }
    console.log("Report submitted:", reportForm);
    alert("Thank you! Your report has been submitted. We'll verify and update the data shortly.");
    setReportForm({ hostelName: '', issueDetails: '', imageProof: null });
    setIsReportModalOpen(false);
  };

  const MealCard = ({ title, items, icon, colorClass }: { title: string, items: MealCategories, icon: React.ReactNode, colorClass: string }) => (
    <details className="group glass-panel rounded-2xl overflow-hidden transition-all duration-300 shadow-sm border dark:border-white/5" open>
      <summary className="flex items-center justify-between p-5 cursor-pointer select-none bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
            {icon}
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-xs">{title}</h4>
        </div>
        <span className="transform group-open:rotate-180 transition-transform text-slate-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </summary>
      <div className="px-8 py-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in space-y-4">
        {Object.entries(items).map(([category, dishes]) => (
            <div key={category} className="border-b border-slate-100 dark:border-white/5 last:border-0 pb-3 last:pb-0">
                <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 block mb-1">{category}</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold block">{dishes}</span>
            </div>
        ))}
      </div>
    </details>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <header className="mb-4">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tighter">Campus Navigator</h2>
        <p className="text-slate-600 dark:text-slate-400">Survival guide: Mess menu & Interactive Map.</p>
      </header>

      <div className="flex flex-wrap gap-2 bg-slate-200 dark:bg-white/5 p-1 rounded-2xl w-fit mb-8">
        <button 
          onClick={() => setActiveTab('mess')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center ${activeTab === 'mess' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          <IconMess /> Mess Menu
        </button>
        <button 
          onClick={() => setActiveTab('map')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center ${activeTab === 'map' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          <IconMap /> 3D Map
        </button>
      </div>

      {activeTab === 'mess' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-center space-x-3 mb-6">
            <button 
              onClick={() => setCurrentWeek(1)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${currentWeek === 1 ? 'bg-orange-600/10 border-orange-600 text-orange-600' : 'border-slate-300 dark:border-white/10 text-slate-500'}`}
            >
              Week 1
            </button>
            <button 
              onClick={() => setCurrentWeek(2)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${currentWeek === 2 ? 'bg-orange-600/10 border-orange-600 text-orange-600' : 'border-slate-300 dark:border-white/10 text-slate-500'}`}
            >
              Week 2
            </button>
          </div>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-4 pt-6 space-x-3 no-scrollbar snap-x px-1"
          >
            {DAYS.map((day) => {
              const isSelected = selectedDay === day;
              const isToday = (day === actualToday);
              
              return (
                <button
                  key={day}
                  data-day={day}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    flex-none snap-center flex flex-col items-center justify-center w-24 h-32 rounded-3xl border transition-all duration-300 relative
                    ${isSelected 
                      ? 'bg-orange-600 border-orange-700 text-white shadow-2xl shadow-orange-600/30 transform scale-105' 
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:border-orange-500/50'
                    }
                  `}
                >
                  {isToday && (
                    <span className={`absolute -top-3 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl ${isSelected ? 'bg-white text-orange-600' : 'bg-orange-600 text-white'}`}>
                      Today
                    </span>
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">{day.slice(0, 3)}</span>
                  <span className="text-3xl font-black tracking-tighter">{day.slice(0, 1)}</span>
                </button>
              );
            })}
          </div>

          {selectedMeals ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">{selectedDay} Menu</h3>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">W{currentWeek} Cycle</span>
              </div>
              
              <MealCard title="Breakfast" items={selectedMeals.breakfast} icon={<IconBreakfast />} colorClass="text-yellow-500" />
              <MealCard title="Lunch" items={selectedMeals.lunch} icon={<IconLunch />} colorClass="text-orange-600" />
              <MealCard title="Snacks" items={selectedMeals.snacks} icon={<IconSnacks />} colorClass="text-red-500" />
              <MealCard title="Dinner" items={selectedMeals.dinner} icon={<IconDinner />} colorClass="text-indigo-500" />
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <p className="font-bold">Menu not available.</p>
            </div>
          )}

          {/* Report Issue Trigger */}
          <div className="pt-10 flex justify-center pb-20">
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center px-6 py-3 bg-slate-100 dark:bg-white/5 hover:bg-orange-500/10 hover:text-orange-600 border border-transparent dark:border-white/5 hover:border-orange-500/30 rounded-2xl transition-all group"
            >
              <IconAlert />
              <span className="text-[10px] font-black uppercase tracking-widest">Report Issue / Outdated Data</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'map' && (
         <div className="glass-panel p-1 rounded-3xl h-[650px] overflow-hidden shadow-2xl relative animate-fade-in border dark:border-white/5 bg-black">
           <iframe
            src="https://iviewd.com/lpu2/"
            className="w-full h-full rounded-2xl transition-all duration-700"
            frameBorder="0"
            allowFullScreen
            title="LPU 3D Campus Map"
           />
        </div>
      )}

      {/* Floating Scroll To Top Button - Ensure high z-index and fixed positioning */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-10 right-6 md:right-10 z-[100] w-14 h-14 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-2xl text-slate-800 dark:text-white hover:scale-110 active:scale-95 transition-all animate-fade-in"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-6 h-6"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-[32px] p-8 w-full max-w-lg shadow-2xl border border-white/5 relative">
            <button 
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <header className="mb-8">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Report Issue</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Help us keep the mess menu accurate for everyone.</p>
            </header>

            <form onSubmit={handleReportSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Hostel Name</label>
                <input 
                  type="text"
                  placeholder="e.g., BH-1, GH-4, Sun Hostel"
                  value={reportForm.hostelName}
                  onChange={(e) => setReportForm(prev => ({ ...prev, hostelName: e.target.value }))}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-black border border-transparent dark:border-white/5 focus:ring-2 focus:ring-orange-500 outline-none text-slate-800 dark:text-slate-200 transition-all font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">What's the issue?</label>
                <textarea 
                  placeholder="e.g., Sunday breakfast items are swapped..."
                  value={reportForm.issueDetails}
                  onChange={(e) => setReportForm(prev => ({ ...prev, issueDetails: e.target.value }))}
                  className="w-full h-32 px-5 py-4 rounded-2xl bg-slate-100 dark:bg-black border border-transparent dark:border-white/5 focus:ring-2 focus:ring-orange-500 outline-none text-slate-800 dark:text-slate-200 transition-all font-bold resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Image Proof (Optional)</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`w-full py-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/40 flex flex-col items-center justify-center transition-all ${reportForm.imageProof ? 'border-orange-500 bg-orange-500/5' : 'group-hover:border-orange-500/50'}`}>
                    {reportForm.imageProof ? (
                      <div className="flex flex-col items-center">
                        <img src={reportForm.imageProof} alt="Proof" className="h-16 w-16 object-cover rounded-lg mb-2 shadow-lg" />
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Image Added</span>
                      </div>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-slate-400 mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Tap to upload photo of menu board</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-orange-600/20 active:scale-[0.98]"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusNavigator;