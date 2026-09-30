const fs = require('fs');
const path = require('path');

const missingEnglish = {
  "physical": {
    "title": "Care Journey",
    "titlePost": "Healing Journey",
    "nurture": "Nurture Phase",
    "transition": "Birth Transition",
    "healing": "Healing Phase",
    "cycleTitle": "Cycle Tracking",
    "cycleTitlePre": "Symptom Log",
    "reportTitle": "Health Summary"
  },
  "mental": {
    "subtitle": "Navigating your emotional landscape with clinical grace.",
    "ritualTitle": "Daily Healing Rituals",
    "ritualReward": "A warm hug for taking care of yourself!"
  },
  "education": {
    "title": "Learning Center",
    "subtitle": "Verified insights for your unique maternity path.",
    "quickLinks": {
      "guides": "Guides",
      "videos": "Videos",
      "tips": "Expert Tips",
      "safety": "Safety"
    },
    "newsletterTitle": "Curated for You",
    "newsletterSub": "The latest in maternal wellness",
    "archive": "View Archive",
    "govtTitle": "Government Schemes",
    "govtSub": "Public Benefits",
    "latestResources": "Latest Resources",
    "read": "min read"
  },
  "settings": {
    "tabs": {
      "profile": "My Profile",
      "journey": "Journey Tuning",
      "custom": "Appearance",
      "notifications": "Notifications",
      "privacy": "Privacy & Caregiver"
    },
    "journey": {
      "title": "Journey Configuration",
      "commitmentTitle": "Daily Commitment"
    },
    "fields": {
      "name": "Full Name",
      "age": "Age",
      "stage": "Maternity Stage",
      "delivery": "Delivery Method (If Postpartum)",
      "medicalHistory": "Medical History",
      "allergies": "Allergies",
      "language": "Language Settings"
    },
    "stages": {
      "ttc": "Trying to Conceive",
      "t1": "Pregnant - Trimester 1",
      "t2": "Pregnant - Trimester 2",
      "t3": "Pregnant - Trimester 3",
      "post": "Postpartum Recovery"
    },
    "languages": {
      "en": "English (GLOBAL)",
      "hi": "हिंदी (INDIA)"
    }
  }
};

const localesDir = path.join(__dirname, 'public', 'locales');
const langs = ['en', 'hi', 'or', 'te', 'ta', 'ml', 'mr'];

langs.forEach(lang => {
  const file = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));

      // Inject missing object sections (using English as the fallback text instead of showing IDs)
      if (!data.physical) data.physical = missingEnglish.physical;
      if (!data.mental) data.mental = missingEnglish.mental;
      if (!data.education) data.education = missingEnglish.education;
      if (!data.settings) data.settings = missingEnglish.settings;

      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Updated ${lang}/translation.json`);
    } catch (e) {
      console.error(`Error on ${lang}`, e);
    }
  } else {
    // If folder doesn't exist, create it and put the missing English as fallback
    try {
      fs.mkdirSync(path.join(localesDir, lang), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(missingEnglish, null, 2), 'utf8');
      console.log(`Created ${lang}/translation.json`);
    } catch (e) {
      console.error(`Error creating ${lang}`, e);
    }
  }
});
