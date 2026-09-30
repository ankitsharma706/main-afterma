const fs = require('fs');
const path = require('path');

const dictionaries = {
  hi: {
    physical: { title: "केयर जर्नी", titlePost: "हीलिंग जर्नी", nurture: "पोषण चरण", transition: "जन्म संक्रमण", healing: "हीलिंग चरण", cycleTitle: "साइकिल ट्रैकिंग", cycleTitlePre: "लक्षण लॉग", reportTitle: "स्वास्थ्य सारांश" },
    mental: { subtitle: "अपने भावनात्मक परिदृश्य को नेविगेट करें।", ritualTitle: "दैनिक हीलिंग अनुष्ठान", ritualReward: "अपने आप को समय देने के लिए एक गर्म गले लगाओ!" },
    education: { title: "लर्निंग सेंटर", subtitle: "आपकी मातृत्व यात्रा के लिए सत्यापित अंतर्दृष्टि।", quickLinks: { guides: "मार्गदर्शिकाएँ", videos: "वीडियो", tips: "विशेषज्ञ युक्तियाँ", safety: "सुरक्षा" }, newsletterTitle: "आपके लिए क्युरेटेड", newsletterSub: "मातृ कल्याण में नवीनतम जानकारी", archive: "पुरालेख देखें", govtTitle: "सरकारी योजनाएं", govtSub: "सार्वजनिक लाभ", latestResources: "नवीनतम संसाधन", read: "मिनट पढ़ें" },
    settings: { tabs: { profile: "मेरी प्रोफ़ाइल", journey: "जर्नी ट्यूनिंग", custom: "दिखावट (Appearance)", notifications: "सूचनाएं", privacy: "गोपनीयता और देखभाल" }, journey: { title: "यात्रा विन्यास", commitmentTitle: "दैनिक प्रतिबद्धता" }, fields: { name: "पूरा नाम", age: "आयु", stage: "मातृत्व चरण", delivery: "प्रसव विधि", medicalHistory: "चिकित्सा इतिहास", allergies: "एलर्जी", language: "भाषा सेटिंग्स" }, stages: { ttc: "गर्भधारण का प्रयास", t1: "गर्भवती - पहली तिमाही", t2: "गर्भवती - दूसरी तिमाही", t3: "गर्भवती - तीसरी तिमाही", post: "पोस्टपार्टम रिकवरी" }, languages: { en: "English", hi: "हिंदी (INDIA)" } },
    store: { title: "मॉमकार्ट", subtitle: "क्युरेटेड आवश्यक वस्तुएं", addToCart: "कार्ट में जोड़ें", added: "संलग्न किया गया", cartEmpty: "आपकी टोकरी खाली है", viewCart: "कार्ट देखें" },
    membership: { title: "सदस्यता हब", elevate: "अपनी रिकवरी को बेहतर बनाएं", subtitle: "आधुनिक माँ के लिए व्यक्तिगत देखभाल।", essential: "आवश्यक देखभाल", free: "नि: शुल्क योजना", plus: "आफ्टरमा प्लस", upgrade: "प्लस में अपग्रेड करें", current: "वर्तमान योजना" }
  },
  mr: {
    physical: { title: "केअर जर्नी", titlePost: "हिलिंग जर्नी", nurture: "पोषण टप्पा", transition: "जन्म संक्रमण", healing: "हिलिंग टप्पा", cycleTitle: "मासिक पाळी ट्रॅकिंग", cycleTitlePre: "लक्षणे लॉग", reportTitle: "आरोग्य अहवाल" },
    mental: { subtitle: "तुमच्या भावनिक प्रवासात मार्गदर्शन.", ritualTitle: "दैनिक हिलिंग उपाय", ritualReward: "स्वतःची काळजी घेतल्याबद्दल एक मिठी!" },
    education: { title: "शिक्षण केंद्र", subtitle: "तुमच्या मातृत्वासाठी प्रमाणित माहिती.", quickLinks: { guides: "मार्गदर्शक", videos: "व्हिडिओ", tips: "तज्ञांचे सल्ले", safety: "सुरक्षा" }, newsletterTitle: "तुमच्यासाठी निवडलेले", newsletterSub: "मातृ आरोग्यातील नवीन माहिती", archive: "संग्रह पहा", govtTitle: "सरकारी योजना", govtSub: "सार्वजनिक लाभ", latestResources: "नवीनतम संसाधने", read: "मिनिटे वाचा" },
    settings: { tabs: { profile: "माझी प्रोफाईल", journey: "प्रवास सेटिंग्ज", custom: "देखावा (Appearance)", notifications: "सूचना", privacy: "गोपनीयता" }, journey: { title: "प्रवास कॉन्फिगरेशन", commitmentTitle: "दैनिक वचनबद्धता" }, fields: { name: "पूर्ण नाव", age: "वय", stage: "मातृत्वाचा टप्पा", delivery: "प्रसूती पद्धत", medicalHistory: "वैद्यकीय इतिहास", allergies: "ऍलर्जी", language: "भाषा सेटिंग्ज" }, stages: { ttc: "गर्भधारणेचा प्रयत्न", t1: "गर्भवती - पहिली तिमाही", t2: "गर्भवती - दुसरी तिमाही", t3: "गर्भवती - तिसरी तिमाही", post: "पोस्टपार्टम रिकव्हरी" }, languages: { en: "English", hi: "हिंदी" } },
    store: { title: "मॉमकार्ट", subtitle: "निवडक आवश्यक वस्तू", addToCart: "कार्टमध्ये जोडा", added: "यशस्वीरित्या जोडले", cartEmpty: "तुमची टोपली रिकामी आहे", viewCart: "कार्ट पहा" },
    membership: { title: "सदस्यत्व हब", elevate: "तुमची रिकव्हरी वाढवा", subtitle: "आधुनिक आईसाठी वैयक्तिकृत काळजी.", essential: "आवश्यक काळजी", free: "मोफत योजना", plus: "आफ्टरमा प्लस", upgrade: "प्लस वर अपग्रेड करा", current: "सध्याची योजना" }
  },
  or: {
    physical: { title: "ଯତ୍ନ ଯାତ୍ରା", titlePost: "ଆରୋଗ୍ୟ ଯାତ୍ରା", nurture: "ପୋଷଣ ପର୍ଯ୍ୟାୟ", transition: "ଜନ୍ମ ସଂକ୍ରମଣ", healing: "ଆରୋଗ୍ୟ ପର୍ଯ୍ୟାୟ", cycleTitle: "ଋତୁସ୍ରାବ ଟ୍ରାକିଂ", cycleTitlePre: "ଲକ୍ଷଣ ଲଗ୍", reportTitle: "ସ୍ୱାସ୍ଥ୍ୟ ରିପୋର୍ଟ" },
    mental: { subtitle: "ଆପଣଙ୍କ ଭାବନାତ୍ମକ ଯାତ୍ରା ପାଇଁ ମାର୍ଗଦର୍ଶନ।", ritualTitle: "ଦୈନିକ ଆରୋଗ୍ୟ ଅଭ୍ୟାସ", ritualReward: "ନିଜର ଯତ୍ନ ନେବା ପାଇଁ ଏକ ଆଲିଙ୍ଗନ!" },
    education: { title: "ଶିକ୍ଷା କେନ୍ଦ୍ର", subtitle: "ମାତୃତ୍ୱ ପାଇଁ ପ୍ରମାଣିତ ସୂଚନା।", quickLinks: { guides: "ମାର୍ଗଦର୍ଶିକା", videos: "ଭିଡିଓ", tips: "ବିଶେଷଜ୍ଞ ପରାମର୍ଶ", safety: "ସୁରକ୍ଷା" }, newsletterTitle: "ଆପଣଙ୍କ ପାଇଁ ମନୋନୀତ", newsletterSub: "ମାତୃ ସ୍ୱାସ୍ଥ୍ୟରେ ନୂତନ ସୂଚନା", archive: "ଆର୍କାଇଭ୍ ଦେଖନ୍ତୁ", govtTitle: "ସରକାରୀ ଯୋଜନା", govtSub: "ସାଧାରଣ ଲାଭ", latestResources: "ନୂତନ ସମ୍ବଳ", read: "ମିନିଟ୍ ପଢନ୍ତୁ" },
    settings: { tabs: { profile: "ମୋର ପ୍ରୋଫାଇଲ୍", journey: "ଯାତ୍ରା ସେଟିଂସ", custom: "ଆବିର୍ଭାବ (Appearance)", notifications: "ସୂଚନା", privacy: "ଗୋପନୀୟତା" }, journey: { title: "ଯାତ୍ରା ବିନ୍ୟାସ", commitmentTitle: "ଦୈନିକ ପ୍ରତିବଦ୍ଧତା" }, fields: { name: "ପୂରା ନାମ", age: "ବୟସ", stage: "ମାତୃତ୍ୱ ପର୍ଯ୍ୟାୟ", delivery: "ପ୍ରସବ ପଦ୍ଧତି", medicalHistory: "ଚିକିତ୍ସା ଇତିହାସ", allergies: "ଆଲର୍ଜି", language: "ଭାଷା ସେଟିଂସ" }, stages: { ttc: "ଗର୍ଭଧାରଣ ଚେଷ୍ଟା", t1: "ଗର୍ଭବତୀ - ପ୍ରଥମ ତ୍ରୈମାସିକ", t2: "ଗର୍ଭବତୀ - ଦ୍ୱିତୀୟ ତ୍ରୈମାସିକ", t3: "ଗର୍ଭବତୀ - ତୃତୀୟ ତ୍ରୈମାସିକ", post: "ପ୍ରସବ ପରବର୍ତ୍ତୀ ସୁସ୍ଥତା" }, languages: { en: "English", hi: "हिंदी" } },
    store: { title: "ମମ୍-କାର୍ଟ", subtitle: "ମନୋନୀତ ଆବଶ୍ୟକୀୟ ସାମଗ୍ରୀ", addToCart: "କାର୍ଟରେ ଯୋଡନ୍ତୁ", added: "ଯୋଗ କରାଗଲା", cartEmpty: "ଆପଣଙ୍କ ବାସ୍କେଟ୍ ଖାଲି ଅଛି", viewCart: "କାର୍ଟ ଦେଖନ୍ତୁ" },
    membership: { title: "ସଦସ୍ୟତା ହବ୍", elevate: "ଆପଣଙ୍କ ଆରୋଗ୍ୟକୁ ଉନ୍ନତ କରନ୍ତୁ", subtitle: "ଯତ୍ନ ଏବଂ ବିଶେଷଜ୍ଞଙ୍କ ସୁବିଧା।", essential: "ଆବଶ୍ୟକ ଯତ୍ନ", free: "ମାଗଣା ଯୋଜନା", plus: "ଆଫ୍ଟରମା ପ୍ଲସ୍", upgrade: "ପ୍ଲସ୍ କୁ ଅପଗ୍ରେଡ୍ କରନ୍ତୁ", current: "ବର୍ତ୍ତମାନର ଯୋଜନା" }
  },
  te: {
    physical: { title: "సంరక్షణ ప్రయాణం", titlePost: "స్వస్థత ప్రయాణం", nurture: "పోషణ దశ", transition: "జనన మార్పు", healing: "స్వస్థత దశ", cycleTitle: "రుతుచక్రం ట్రాకింగ్", cycleTitlePre: "లక్షణాల లాగ్", reportTitle: "ఆరోగ్య నివేదిక" },
    mental: { subtitle: "మీ భావోద్వేగ ప్రయాణానికి మార్గనిర్దేశం.", ritualTitle: "రోజువారీ స్వస్థత ఆచారాలు", ritualReward: "మిమ్మల్ని మీరు చూసుకున్నందుకు ఒక ఆలింగనం!" },
    education: { title: "అభ్యాస కేంద్రం", subtitle: "మీ మాతృత్వానికి ధృవీకరించబడిన సమాచారం.", quickLinks: { guides: "మార్గదర్శకాలు", videos: "వీడియోలు", tips: "నిపుణుల సలహాలు", safety: "భద్రత" }, newsletterTitle: "మీ కోసం ఎంచుకోబడినవి", newsletterSub: "మాతృ ఆరోగ్య సంరక్షణలో తాజా వార్తలు", archive: "ఆర్కైవ్ చూడండి", govtTitle: "ప్రభుత్వ పథకాలు", govtSub: "ప్రజా ప్రయోజనాలు", latestResources: "తాజా వనరులు", read: "నిమిషాలు చదవండి" },
    settings: { tabs: { profile: "నా ప్రొఫైల్", journey: "ప్రయాణ సెట్టింగ్‌లు", custom: "స్వరూపం", notifications: "నోటిఫికేషన్‌లు", privacy: "గోప్యత" }, journey: { title: "ప్రయాణ ఆకృతీకరణ", commitmentTitle: "రోజువారీ నిబద్ధత" }, fields: { name: "పూర్తి పేరు", age: "వయసు", stage: "మాతృత్వ దశ", delivery: "డెలివరీ పద్ధతి", medicalHistory: "వైద్య చరిత్ర", allergies: "అలెర్జీలు", language: "భాషా సెట్టింగ్‌లు" }, stages: { ttc: "గర్భం కోసం ప్రయత్నిస్తున్నారు", t1: "గర్భిణీ - మొదటి త్రైమాసికం", t2: "గర్భిణీ - రెండవ త్రైమాసికం", t3: "గర్భిణీ - మూడవ త్రైమాసికం", post: "ప్రసవానంతర కోలుకోవడం" }, languages: { en: "English", hi: "हिंदी" } },
    store: { title: "మామ్‌కార్ట్", subtitle: "ఎంచుకున్న నిత్యావసరాలు", addToCart: "కార్ట్‌కు జోడించు", added: "విజయవంతంగా జోడించబడింది", cartEmpty: "మీ బాస్కెట్ ఖాళీగా ఉంది", viewCart: "కార్ట్ చూడండి" },
    membership: { title: "సభ్యత్వ కేంద్రం", elevate: "మీ స్వస్థతను మెరుగుపరచండి", subtitle: "వ్యక్తిగత సంరక్షణ మరియు నిపుణుల ప్రాప్యత.", essential: "అవసరమైన సంరక్షణ", free: "ఉచిత ప్లాన్", plus: "ఆఫ్టర్‌మా ప్లస్", upgrade: "ప్లస్‌కు అప్‌గ్రేడ్ చేయండి", current: "ప్రస్తుత ప్లాన్" }
  },
  ta: {
    physical: { title: "பராமரிப்பு பயணம்", titlePost: "குணப்படுத்தும் பயணம்", nurture: "ஊட்டச்சத்து கட்டம்", transition: "பிறப்பு மாற்றம்", healing: "குணப்படுத்தும் கட்டம்", cycleTitle: "மாதவிடாய் கண்காணிப்பு", cycleTitlePre: "அறிகுறிகள் பதிவு", reportTitle: "சுகாதார அறிக்கை" },
    mental: { subtitle: "உங்கள் உணர்ச்சி பயணத்திற்கான வழிகாட்டுதல்.", ritualTitle: "தினசரி குணப்படுத்தும் சடங்குகள்", ritualReward: "உங்களை கவனித்துக்கொண்டதற்காக ஒரு அணைப்பு!" },
    education: { title: "கற்றல் மையம்", subtitle: "உங்கள் மகப்பேறுக்கான சரிபார்க்கப்பட்ட தகவல்.", quickLinks: { guides: "வழிகாட்டிகள்", videos: "காணொளிகள்", tips: "நிபுணர் குறிப்புகள்", safety: "பாதுகாப்பு" }, newsletterTitle: "உங்களுக்காக தேர்ந்தெடுக்கப்பட்டது", newsletterSub: "தாய்மை நலனில் சமீபத்திய செய்திகள்", archive: "காப்பகத்தைக் காண்க", govtTitle: "அரசு திட்டங்கள்", govtSub: "பொது நன்மைகள்", latestResources: "சமீபத்திய வளங்கள்", read: "நிமிடங்கள் படிக்க" },
    settings: { tabs: { profile: "என் சுயவிவரம்", journey: "பயண அமைப்புகள்", custom: "தோற்றம்", notifications: "அறிவிப்புகள்", privacy: "தனியுரிமை" }, journey: { title: "பயண கட்டமைப்பு", commitmentTitle: "தினசரி அர்ப்பணிப்பு" }, fields: { name: "முழு பெயர்", age: "வயது", stage: "மகப்பேறு நிலை", delivery: "பிரசவ முறை", medicalHistory: "மருத்துவ வரலாறு", allergies: "ஒவ்வாமை", language: "மொழி அமைப்புகள்" }, stages: { ttc: "கர்ப்பம் தரிக்க முயற்சி", t1: "கர்ப்பிணி - முதல் காலாண்டு", t2: "கர்ப்பிணி - இரண்டாம் காலாண்டு", t3: "கர்ப்பிணி - மூன்றாம் காலாண்டு", post: "பிரசவத்திற்குப் பிந்தைய மீட்பு" }, languages: { en: "English", hi: "हिंदी" } },
    store: { title: "மாம்கார்ட்", subtitle: "தேர்ந்தெடுக்கப்பட்ட அத்தியாவசிய பொருட்கள்", addToCart: "கார்ட்டில் சேர்", added: "வெற்றிகரமாக சேர்க்கப்பட்டது", cartEmpty: "உங்கள் கூடை காலியாக உள்ளது", viewCart: "கார்ட்டைக் காண்க" },
    membership: { title: "உறுப்பினர் மையம்", elevate: "உங்கள் மீட்பை மேம்படுத்துங்கள்", subtitle: "தனிப்பயனாக்கப்பட்ட பராமரிப்பு மற்றும் நிபுணர் அணுகல்.", essential: "அத்தியாவசிய பராமரிப்பு", free: "இலவச திட்டம்", plus: "ஆஃப்டர்மா பிளஸ்", upgrade: "பிளஸ்க்கு மேம்படுத்துங்கள்", current: "தற்போதைய திட்டம்" }
  },
  ml: {
    physical: { title: "പരിചരണ യാത്ര", titlePost: "സൗഖ്യദായക യാത്രാ", nurture: "പരിപാലന ഘട്ടം", transition: "ജനന മാറ്റം", healing: "സൗഖ്യദായക ഘട്ടം", cycleTitle: "ആർത്തവ ട്രാക്കിംഗ്", cycleTitlePre: "ലക്ഷണങ്ങളുടെ ലോഗ്", reportTitle: "ആരോഗ്യ റിപ്പോർട്ട്" },
    mental: { subtitle: "നിങ്ങളുടെ വൈകാരിക യാത്രയ്ക്കുള്ള മാർഗ്ഗനിർദ്ദേശം.", ritualTitle: "പ്രതിദിന സൗഖ്യദായക ആചാരങ്ങൾ", ritualReward: "നിങ്ങളെത്തന്നെ ശ്രദ്ധിച്ചതിന് ഒരു ആലിംഗനം!" },
    education: { title: "പഠന കേന്ദ്രം", subtitle: "നിങ്ങളുടെ മാതൃത്വത്തിനായുള്ള പരിശോധിച്ച വിവരങ്ങൾ.", quickLinks: { guides: "വഴികാട്ടികൾ", videos: "വീഡിയോകൾ", tips: "വിദഗ്ദ്ധോപദേശം", safety: "സുരക്ഷ" }, newsletterTitle: "നിങ്ങൾക്കായി തിരഞ്ഞെടുത്തത്", newsletterSub: "മാതൃ ആരോഗ്യത്തിലെ ഏറ്റവും പുതിയ വാർത്തകൾ", archive: "ആർക്കൈവ് കാണുക", govtTitle: "സർക്കാർ പദ്ധതികൾ", govtSub: "പൊതു ആനുകൂല്യങ്ങൾ", latestResources: "ഏറ്റവും പുതിയ വിവരങ്ങൾ", read: "മിനിറ്റുകൾ വായിക്കുക" },
    settings: { tabs: { profile: "എൻ്റെ പ്രൊഫൈൽ", journey: "യാത്രാ ക്രമീകരണങ്ങൾ", custom: "രൂപഭാവം", notifications: "അറിയിപ്പുകൾ", privacy: "സ്വകാര്യത" }, journey: { title: "യാത്രാ ക്രമീകരണം", commitmentTitle: "പ്രതിദിന പ്രതിബദ്ധത" }, fields: { name: "മുഴുവൻ പേര്", age: "പ്രായം", stage: "മാതൃത്വ ഘട്ടം", delivery: "പ്രസവ രീതി", medicalHistory: "വൈദ്യ ചരിത്രം", allergies: "അലർജികൾ", language: "ഭാഷാ ക്രമീകരണങ്ങൾ" }, stages: { ttc: "ഗർഭം ധരിക്കാൻ ശ്രമിക്കുന്നു", t1: "ഗർഭിണി - ആദ്യ ത്രിമാസം", t2: "ഗർഭിണി - രണ്ടാം ത്രിമാസം", t3: "ഗർഭിണി - മൂന്നാം ത്രിമാസം", post: "പ്രസവാനന്തര വീണ്ടെടുക്കൽ" }, languages: { en: "English", hi: "हिंदी" } },
    store: { title: "മോംകാർട്ട്", subtitle: "തിരഞ്ഞെടുത്ത അവശ്യവസ്തുക്കൾ", addToCart: "കാർട്ടിലേക്ക് ചേർക്കുക", added: "വിജയകരമായി ചേർത്തു", cartEmpty: "നിങ്ങളുടെ ബാസ്കറ്റ് ശൂന്യമാണ്", viewCart: "കാർട്ട് കാണുക" },
    membership: { title: "മെമ്പർഷിപ്പ് ഹബ്", elevate: "നിങ്ങളുടെ വീണ്ടെടുക്കൽ മെച്ചപ്പെടുത്തുക", subtitle: "വ്യക്തിഗത പരിചരണവും വിദഗ്ദ്ധ ആക്സസും.", essential: "അവശ്യ പരിചരണം", free: "സൗജന്യ പ്ലാൻ", plus: "ആഫ്റ്റർമ പ്ലസ്", upgrade: "പ്ലസിലേക്ക് അപ്‌ഗ്രേഡ് ചെയ്യുക", current: "നിലവിലെ പ്ലാൻ" }
  },
  en: {
    store: { title: "MomKart", subtitle: "Curated Essentials", addToCart: "Add to Cart", added: "Added successfully", cartEmpty: "Your basket is empty", viewCart: "View Basket" },
    membership: { title: "Membership Hub", elevate: "Elevate Your Recovery Journey", subtitle: "Personalized care, expert access, and advanced analytics for the modern mother.", essential: "Essential Care", free: "Free Tier", plus: "AfterMa Plus", upgrade: "Upgrade to Plus", current: "Current Plan" }
  }
};

const localesDir = path.join(__dirname, 'public', 'locales');

Object.keys(dictionaries).forEach(lang => {
  const file = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(file)) {
    const existing = JSON.parse(fs.readFileSync(file, 'utf8'));
    const combined = { ...existing, ...dictionaries[lang] };
    fs.writeFileSync(file, JSON.stringify(combined, null, 2));
    console.log(`Pushed deep translations to ${lang}`);
  }
});
