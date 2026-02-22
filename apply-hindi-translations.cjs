const fs = require('fs');
const p = require('path');
const hiPath = p.join(process.cwd(), 'public/locales/hi/translation.json');

let hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

hi.common = { signIn: 'लॉग इन करें', signOut: 'लॉग आउट', sos: 'SOS के लिए डबल टैप करें', searchPlaceholder: 'सुरक्षित खोज...', welcome: 'नमस्ते', close: 'बंद करें', ghostMode: 'घोस्ट मोड सक्रिय...' };
hi.nav = { dashboard: 'डैशबोर्ड', physical: 'केयर जर्नी', physicalPost: 'हीलिंग जर्नी', mental: 'मानसिक स्वास्थ्य', care: 'केयर कनेक्ट', momkart: 'मॉमकार्ट', education: 'लर्निंग सेंटर', settings: 'सेटिंग्स', membership: 'आफ्टरमा प्लस' };
hi.dashboard = { inspiration: 'आपका दिन मंगलमय हो...', streakSuffix: 'स्वस्थ दिन', progressSuffix: 'हीलिंग पॉइंट्स', logMoment: 'लॉग प्रविष्टि करें', nextStep: 'अगला सुरक्षित कदम', startSoftly: 'सत्र शुरू करें', healingPulse: 'हीलिंग पल्स', healingPulseSub: 'पिछले 7 दिनों में आपकी रिकवरी का रुझान', warmNutrition: 'गर्म पोषण', recipes: 'सुरक्षित रेसिपी खोजें', stats: { hydration: 'हाइड्रेशन', rest: 'आराम का समय', selfcare: 'स्व-देखभाल', kegel: 'हल्का व्यायाम' } };
hi.care = { title: 'केयर कनेक्ट', subtitle: 'प्रमाणित मातृत्व विशेषज्ञता और सहकर्मी सहायता के लिए आपका सेतु।', helpline: 'आपातकालीन हेल्पलाइन', tabs: { community: 'बहनों का घेरा', experts: 'विशेषज्ञ', ngo: 'एनजीओ सहायता', insurance: 'बीमा योजनाएं', sessions: 'माई सेशंस' }, community: { sistersJoined: 'बहनें शामिल हुईं', joinSisters: 'सिस्टर्स सर्कल में शामिल हों' }, experts: { book: 'सत्र बुक करें' } };

fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2));
console.log('Hindi deep translations finalized.');
