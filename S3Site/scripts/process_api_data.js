// Script to process API data and create proper content.json
const fs = require('fs');

// Read the API response
const apiData = JSON.parse(fs.readFileSync('S3Site/data/api_response.json', 'utf8'));

// Process the API data to create our content structure
function processApiData(apiResponse) {
  const sections = apiResponse.data.content;
  
  // Find specific sections we want to highlight
  const trendingSection = sections.find(s => s.sectionName.toLowerCase().includes('trending'));
  const subjectsSection = sections.find(s => s.sectionType === 'LIST_TYPE');
  const flashSection = sections.find(s => s.sectionName.toLowerCase().includes('flash') || s.sectionType === 'WRAPPER_TYPE');
  const ancientHistorySection = sections.find(s => s.sectionName.toLowerCase().includes('ancient history'));
  const englishSection = sections.find(s => s.sectionName.toLowerCase().includes('english') && s.sectionType === 'SUBJECT_TYPE');

  // Create our processed sections
  const processedSections = [];

  // Add trending section
  if (trendingSection) {
    processedSections.push({
      id: "trending",
      sectionName: "Trending",
      sectionType: "TRENDING_TYPE",
      sortOrder: 1,
      items: trendingSection.items.slice(0, 5).map((item, index) => ({
        id: item.id,
        name: item.name,
        thumbnailUrl: item.thumbnailUrl || item.videoThumbnailUrl,
        categoryName: item.categoryName,
        type: item.type,
        sortOrder: index + 1
      }))
    });
  }

  // Add flash learning section
  if (flashSection) {
    processedSections.push({
      id: "flash-learning",
      sectionName: "Flash Learning | फ्लैश लर्निंग",
      sectionType: "FLASH_TYPE",
      sortOrder: 2,
      items: flashSection.items.slice(0, 3).map((item, index) => ({
        id: item.id,
        name: item.name,
        thumbnailUrl: item.thumbnailUrl,
        categoryName: item.categoryName,
        type: item.type,
        sortOrder: index + 1
      }))
    });
  }

  // Add ancient history section
  if (ancientHistorySection) {
    processedSections.push({
      id: "synth-ancient",
      sectionName: "Ancient History | प्राचीन इतिहास",
      sectionType: "CHAPTER_TYPE",
      sortOrder: 3,
      items: ancientHistorySection.items.slice(0, 3).map((item, index) => ({
        id: item.id,
        name: item.name,
        thumbnailUrl: item.thumbnailUrl,
        categoryName: item.categoryName,
        type: item.type,
        sortOrder: index + 1
      }))
    });
  }

  // Add English section
  if (englishSection) {
    processedSections.push({
      id: "synth-english",
      sectionName: "English | अंग्रेजी",
      sectionType: "CHAPTER_TYPE",
      sortOrder: 4,
      items: englishSection.items.slice(0, 2).map((item, index) => ({
        id: item.id,
        name: item.name,
        thumbnailUrl: item.thumbnailUrl,
        categoryName: item.categoryName,
        type: item.type,
        sortOrder: index + 1
      }))
    });
  }

  // Add subjects section
  if (subjectsSection) {
    processedSections.push({
      id: "synth-subjects",
      sectionName: "Subjects | विषय",
      sectionType: "LIST_TYPE",
      sortOrder: 5,
      items: subjectsSection.items.slice(0, 5).map((item, index) => ({
        id: item.id,
        name: item.name,
        iconUrl: item.iconUrl || item.thumbnailUrl,
        type: item.type,
        sortOrder: index + 1
      }))
    });
  }

  return {
    profile: {
      appName: "Learnr",
      tagline: "Roz ek kadam, sapnon ki aur.",
      description: "Daily learning in 12+ Indian languages. Exam prep to life skills, powered by Riya AI.",
      stats: {
        totalLearners: "10L+",
        languages: "12+",
        hoursContent: "50K+"
      }
    },
    slideshow: {
      images: [
        "images/app-ref-1.jpeg",
        "images/app-ref-2.jpeg", 
        "images/app-ref-3.jpeg",
        "images/app-ref-4.jpeg",
        "images/app-ref-5.jpeg"
      ]
    },
    sections: processedSections,
    testimonials: [
      {
        initials: "PS",
        name: "Priya Sharma",
        location: "Delhi",
        stars: 5,
        text: "Content shorts concept is 🔥! I watch 2-3 videos while commuting and I've already improved my GK so much. Feels like scrolling reels but actually learning something!"
      },
      {
        initials: "RV", 
        name: "Rahul Verma",
        location: "Lucknow",
        stars: 5,
        text: "SSC prep was so boring before Learnr. Now I take quizzes daily and it feels like playing a game. Scored 150+ in my last mock — all thanks to this app!"
      },
      {
        initials: "AP",
        name: "Ananya Patel", 
        location: "Ahmedabad",
        stars: 5,
        text: "The Hindi + English mix makes it so easy to understand. History topics that I used to skip — now I actually enjoy watching them. Best learning app for Indian students."
      },
      {
        initials: "VS",
        name: "Vikram Singh",
        location: "Jaipur", 
        stars: 4,
        text: "Riya AI assistant is genuinely helpful. I ask doubts at 2 AM and get instant answers. Quiz after every topic makes sure I actually remember what I learned."
      },
      {
        initials: "SG",
        name: "Sneha Gupta",
        location: "Patna",
        stars: 5,
        text: "Exam preparation has never been this fun. The bite-sized format is perfect — no more sitting through 2-hour lectures. My friends are hooked on the Art & Culture section!"
      },
      {
        initials: "AM",
        name: "Arjun Mishra",
        location: "Bhopal",
        stars: 5, 
        text: "I failed my last two attempts at SSC CGL. After using Learnr for 3 months, I finally cleared it. The daily quiz habit made all the difference. Highly recommend!"
      },
      {
        initials: "NK",
        name: "Neha Kumari",
        location: "Ranchi",
        stars: 5,
        text: "Geography and History used to be my weakest subjects. Learnr's short videos explained everything so clearly. My score jumped from 45 to 78 in just 6 weeks!"
      },
      {
        initials: "RT",
        name: "Rohan Tiwari",
        location: "Kanpur",
        stars: 4,
        text: "The Hinglish content is a game changer. I never felt comfortable with pure English apps. Learnr speaks my language and that makes learning so much more natural."
      },
      {
        initials: "DM",
        name: "Divya Mehta", 
        location: "Surat",
        stars: 5,
        text: "I use Learnr during my lunch break every day. 15 minutes of focused learning and I feel so productive. The streak feature keeps me coming back every single day!"
      },
      {
        initials: "KS",
        name: "Karan Sharma",
        location: "Chandigarh",
        stars: 5,
        text: "Best investment of my time. The content quality is top-notch and Riya AI answers my doubts instantly. It's like having a personal tutor available 24/7 for free."
      }
    ],
    cta: {
      title: "Sirf sapne mat dekho,",
      subtitle: "unhe poora bhi karo.",
      description: "Shuruaat aaj se karo. Learnr ke saath, roz thoda aage badho.",
      playStoreUrl: "https://app.adjust.com/1zetqonb?campaign=Website"
    },
    footer: {
      email: "support.learnr@adda247.com",
      location: "Gurugram, Haryana, India",
      links: [
        {
          text: "Privacy Policy",
          url: "https://www.learnr.co.in/privacy-policy.html"
        },
        {
          text: "Terms of Use", 
          url: "https://www.learnr.co.in/term-of-use.html"
        },
        {
          text: "Support",
          url: "https://www.learnr.co.in/support.html"
        },
        {
          text: "Delete Account",
          url: "https://www.learnr.co.in/delete-account.html"
        }
      ]
    }
  };
}

// Process the data and save it
const processedData = processApiData(apiData);
fs.writeFileSync('S3Site/data/content.json', JSON.stringify(processedData, null, 2));

console.log('✅ Successfully processed API data and created content.json with real thumbnails!');
console.log('📊 Processed sections:', processedData.sections.length);
console.log('🖼️  Total items with thumbnails:', processedData.sections.reduce((acc, section) => acc + section.items.length, 0));