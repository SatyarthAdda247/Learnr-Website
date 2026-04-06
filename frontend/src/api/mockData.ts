export const userProfile = {
  name: "Learner",
  coins: 450,
  streak: 12,
  avatar: "/images/png/ic_question_profile_img.png",
};

export const banners = [
  { id: 1, image: "/images/svg/tp_banner_bg.svg", alt: "Promo Banner 1" },
  { id: 2, image: "/images/svg/generic_banner_bg.svg", alt: "Promo Banner 2" },
];

export const examCategories = [
  { id: "banking", title: "Banking", icon: "/images/png/banking.png" },
  { id: "ssc", title: "SSC", icon: "/images/png/ssc.png" },
  { id: "railways", title: "Railways", icon: "/images/png/railways.png" },
  { id: "teaching", title: "Teaching", icon: "/images/png/teaching.png" },
  { id: "ugc", title: "UGC NET", icon: "/images/png/ugc.png" },
  { id: "regulatory", title: "Regulatory Bodies", icon: "/images/png/regulatory.png" },
];

export const featureTiles = [
  { id: "live", title: "Live Classes", icon: "/images/svg/ic_live_class.svg", bg: "bg-red-50 text-red-900 border border-red-100" },
  { id: "video", title: "Video Courses", icon: "/images/svg/ic_video_course.svg", bg: "bg-blue-50 text-blue-900 border border-blue-100" },
  { id: "test", title: "Mock Tests", icon: "/images/svg/ic_mock_test.svg", bg: "bg-green-50 text-green-900 border border-green-100" },
  { id: "ebook", title: "E-Books", icon: "/images/svg/ic_ebooks.svg", bg: "bg-purple-50 text-purple-900 border border-purple-100" },
  { id: "ai", title: "Adda AI", icon: "/images/svg/adda_ai.svg", bg: "bg-pink-50 border border-pink-100" },
  { id: "3d", title: "3D Learning", icon: "/images/svg/ic_3d_learning.svg", bg: "bg-indigo-50 border border-indigo-100" },
  { id: "pdf", title: "Study PDFs", icon: "/images/svg/ic_pdf.svg", bg: "bg-orange-50 border border-orange-100" },
  { id: "books", title: "Printed Books", icon: "/images/svg/ic_printed_books.svg", bg: "bg-teal-50 border border-teal-100" },
];

export const upcomingClasses = [
  { id: 1, title: "Quantitative Aptitude Masterclass", time: "10:00 AM", instructor: "Rahul Sir", image: "/images/png/live_now_card_background.png" },
  { id: 2, title: "English Grammar Rules", time: "12:30 PM", instructor: "Neha Ma'am", image: "/images/svg/live_class_card_background.svg" },
  { id: 3, title: "Current Affairs Analysis", time: "05:00 PM", instructor: "Ashish Sir", image: "/images/png/live_class_card_background_round.png" },
];

export const promotionalBanners = {
  referral: "/images/svg/refer_and_earn_bg.svg",
  subscription: "/images/svg/subscription_bs_logo.svg",
  premiumCrown: "/images/svg/big_crown.svg",
};

export const dailyTasks = [
  { id: "quiz", title: "Daily Quiz", icon: "/images/png/question_task.png" },
  { id: "video", title: "Daily Video", icon: "/images/png/video_task.png" },
];

export const apiStore = {
  fetchProfile: async () => Promise.resolve(userProfile),
  fetchBanners: async () => Promise.resolve(banners),
  fetchExamCategories: async () => Promise.resolve(examCategories),
  fetchFeatureTiles: async () => Promise.resolve(featureTiles),
  fetchUpcomingClasses: async () => Promise.resolve(upcomingClasses),
  fetchPromoData: async () => Promise.resolve(promotionalBanners),
  fetchDailyTasks: async () => Promise.resolve(dailyTasks),
};
