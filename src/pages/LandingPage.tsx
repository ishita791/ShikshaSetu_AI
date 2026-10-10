// LearnReach AI - Landing Page
// UN SDG 4: Quality Education for Rural and Regional Students

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Languages, 
  CheckCircle2, 
  ArrowRight, 
  Globe2, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  Award, 
  Target, 
  Compass, 
  ChevronDown, 
  Lightbulb,
  Check
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  // Interactive Live Demo Simulator state
  const [demoTopic, setDemoTopic] = useState<'photosynthesis' | 'fractions' | 'solar'>('photosynthesis');
  const [demoDifficulty, setDemoDifficulty] = useState<'beginner' | 'intermediate'>('beginner');
  const [demoLang, setDemoLang] = useState<'en' | 'hi' | 'or' | 'bn'>('en');

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const demoExplanations: Record<string, Record<string, Record<string, { title: string; explanation: string; example: string }>>> = {
    photosynthesis: {
      beginner: {
        en: {
          title: 'How Green Leaves Cook With Sunlight',
          explanation: 'Leaves take water from the soil and carbon dioxide from the air. Using green chlorophyll as a tiny solar kitchen, they make food (glucose) and release fresh oxygen for us.',
          example: 'Think of morning paddy fields soaking in sunshine: leaves act like solar collectors powering grain growth.'
        },
        hi: {
          title: 'हरी पत्तियाँ धूप से भोजन कैसे बनाती हैं',
          explanation: 'पत्तियां मिट्टी से पानी और हवा से कार्बन डाइऑक्साइड लेती हैं। हरे क्लोरोफिल की मदद से वे धूप को ऊर्जा में बदलकर ग्लूकोज बनाती हैं और हमें साफ ऑक्सीजन देती हैं।',
          example: 'जैसे सुबह खेत सूरज की रोशनी से खिल उठते हैं, वैसे ही पत्तियां सौर ऊर्जा इकट्ठा करती हैं।'
        },
        or: {
          title: 'ସବୁଜ ପତ୍ର କିପରି ସୂର୍ଯ୍ୟାଲୋକରୁ ଖାଦ୍ୟ ତିଆରି କରେ',
          explanation: 'ପତ୍ରଗୁଡ଼ିକ ମାଟିରୁ ପାଣି ଏବଂ ବାୟୁରୁ କାର୍ବନ ଡାଇଅକ୍ସାଇଡ୍ ଗ୍ରହଣ କରନ୍ତି। କ୍ଲୋରୋଫିଲ୍ ସାହାଯ୍ୟରେ ସେମାନେ ସୂର୍ଯ୍ୟ କିରଣକୁ ଖାଦ୍ୟ (ଗ୍ଲୁକୋଜ୍) ରେ ପରିଣତ କରି ଅମ୍ଳଜାନ ଛାଡ଼ନ୍ତି।',
          example: 'ଧାନ କ୍ଷେତରେ ସୂର୍ଯ୍ୟାଲୋକ ପଡ଼ିବା ଦ୍ୱାରା ଫସଲ ସୁସ୍ଥ ରହିବା ଏହାର ପ୍ରତ୍ୟକ୍ଷ ଉଦାହରଣ।'
        },
        bn: {
          title: 'সবুজ পাতা কীভাবে সূর্যালোক দিয়ে খাদ্য তৈরি করে',
          explanation: 'গাছের পাতা মাটি থেকে জল এবং বাতাস থেকে কার্বন ডাই অক্সাইড গ্রহণ করে। ক্লোরোফিলের সাহায্যে সূর্যালোক ব্যবহার করে তারা গ্লুকোজ বানায় এবং অক্সিজেন বাতাসে মুক্ত করে।',
          example: 'সকালের রোদে ধানের খেত যেমন প্রাণবন্ত হয়, তেমনি পাতাগুলি সৌরশক্তি কাজে লাগিয়ে পুষ্টি জোগায়।'
        }
      },
      intermediate: {
        en: {
          title: 'Photochemical Reactions & Stomatal Gas Exchange',
          explanation: 'Light-dependent reactions in the thylakoid membrane split water molecules (photolysis) releasing O2. In the Calvin cycle, carbon fixation forms three-carbon sugars.',
          example: 'During dry drought conditions, guard cells close stomata to prevent transpiration water loss, temporarily throttling photosynthesis.'
        },
        hi: {
          title: 'प्रकाश-रासायनिक अभिक्रियाएं एवं रंध्र गैस विनिमय',
          explanation: 'थायलेकोइड झिल्ली में प्रकाश-निर्भर अभिक्रियाएं पानी के अणुओं को तोड़ती हैं (फोटोलाइसिस) और O2 मुक्त करती हैं। केल्विन चक्र में कार्बन स्थिरीकरण से शर्करा बनती है।',
          example: 'सूखे के दौरान रंध्र बंद हो जाते हैं ताकि पानी का वाष्पोत्सर्जन रोका जा सके।'
        },
        or: {
          title: 'ଆଲୋକ ରାସାୟନିକ ପ୍ରକ୍ରିୟା ଏବଂ ଗ୍ୟାସୀୟ ବିନିମୟ',
          explanation: 'ଥାଇଲାକଏଡ୍ ରେ ଆଲୋକ ପ୍ରତିକ୍ରିୟା ଜଳ ଅଣୁକୁ ବିଭାଜିତ କରି ଅମ୍ଳଜାନ ମୁକ୍ତ କରେ। କେଲଭିନ୍ ଚକ୍ର ମାଧ୍ୟମରେ କାର୍ବନ ସଂସ୍ଥାପନ ଘଟି ଶର୍କରା ଉତ୍ପନ୍ନ ହୁଏ।',
          example: 'ଖରାଦିନେ ଜଳକ୍ଷୟ ରୋକିବା ପାଇଁ ପତ୍ରର ଷ୍ଟୋମାଟା ବନ୍ଦ ହୋଇଯାଏ।'
        },
        bn: {
          title: 'আলোক-রাসায়নিক বিক্রিয়া ও পত্ররন্ধ্র গ্যাস বিনিময়',
          explanation: 'থাইলাকয়েড ঝিল্লিতে আলোর বিক্রিয়ায় জলের অণু বিশ্লিষ্ট হয়ে অক্সিজেন নির্গত হয়। কেলভিন চক্রে কার্বন সংবদ্ধকরণের মাধ্যমে শর্করার সংশ্লেষ ঘটে।',
          example: 'অনাবৃষ্টির সময় জল সংরক্ষণ করতে পত্ররন্ধ্র সাময়িকভাবে বন্ধ থাকে।'
        }
      }
    },
    fractions: {
      beginner: {
        en: {
          title: 'Sharing Land and Harvest Equitably',
          explanation: 'A fraction shows parts of a whole. The numerator (top number) is how many parts you take; the denominator (bottom number) is how many equal parts exist in total.',
          example: 'If 4 families share 1 tractor equally for 12 days, each family gets 12/4 = 3 days (1/4 of total tractor time).'
        },
        hi: {
          title: 'खेत और फसल का उचित बंटवारा (भिन्न)',
          explanation: 'भिन्न किसी पूरी वस्तु के हिस्सों को दर्शाता है। अंश (ऊपर की संख्या) लिए गए हिस्से बताता है और हर (नीचे की संख्या) कुल बराबर हिस्से दर्शाता है।',
          example: 'यदि 4 किसान मिलकर 12 बोरी बीज बराबर बांटते हैं, तो प्रत्येक को 12/4 = 3 बोरी (1/4 हिस्सा) मिलती है।'
        },
        or: {
          title: 'କ୍ଷେତ ଏବଂ ଫସଲର ସମାନ ଭାଗ (ଭଗ୍ନାଂଶ)',
          explanation: 'ଭଗ୍ନାଂଶ ଏକ ସମ୍ପୂର୍ଣ୍ଣ ଜିନିଷର ଅଂଶ ଦର୍ଶାଏ। ଲବ (ଉପର ସଂଖ୍ୟା) ନିଆଯାଇଥିବା ଅଂଶ ଏବଂ ହର (ତଳ ସଂଖ୍ୟା) ସମୁଦାୟ ସମାନ ଭାଗକୁ ବୁଝାଏ।',
          example: 'ଯଦି ୪ ଜଣ ଚାଷୀ ୧୨ ବସ୍ତା ସାର ସମାନ ଭାବେ ବାଣ୍ଟନ୍ତି, ତେବେ ପ୍ରତ୍ୟେକ ୩ ବସ୍ତା (୧/୪ ଅଂଶ) ପାଆନ୍ତି।'
        },
        bn: {
          title: 'ফসলের ন্যায্য ভাগাভাগি (ভগ্নাংশ)',
          explanation: 'ভগ্নাংশ একটি সম্পূর্ণ জিনিসের অংশ প্রকাশ করে। লব (উপরের সংখ্যা) নেওয়া অংশ নির্দেশ করে এবং হর (নিচের সংখ্যা) মোট সমান অংশ নির্দেশ করে।',
          example: 'যদি ৪ জন কৃষক ১২ বস্তা বীজ সমানভাবে ভাগ করে নেন, তবে প্রত্যেকে ৩ বস্তা (১/৪ অংশ) পাবেন।'
        }
      },
      intermediate: {
        en: {
          title: 'Proportions & Simple Interest in Crop Finance',
          explanation: 'Proportions compare two equal ratios (a/b = c/d). Simple interest calculates repayment cost: Principal × Rate × Time / 100.',
          example: 'A crop loan of ₹10,000 at 4% annual interest for 6 months costs ₹200 in interest, preserving farming capital.'
        },
        hi: {
          title: 'अनुपात और कृषि ऋण का साधारण ब्याज',
          explanation: 'समानुपात दो अनुपातों की बराबरी दिखाता है। साधारण ब्याज = (मूलधन × दर × समय) / 100।',
          example: '₹10,000 के किसान क्रेडिट ऋण पर 4% वार्षिक दर से 6 महीने का ब्याज केवल ₹200 होता है।'
        },
        or: {
          title: 'ଅନୁପାତ ଏବଂ କୃଷି ଋଣର ସରଳ ସୁଧ',
          explanation: 'ଅନୁପାତ ଦୁଇଟି ମାନର ସମାନତା ଦେଖାଏ। ସରଳ ସୁଧ = (ମୂଳଧନ × ହାର × ସମୟ) / ୧୦୦।',
          example: '୧୦,୦୦୦ ଟଙ୍କା ଋଣ ଉପରେ ୪% ବାର୍ଷିକ ହାରରେ ୬ ମାସ ପାଇଁ ସୁଧ ମାତ୍ର ୨୦୦ ଟଙ୍କା ହୁଏ।'
        },
        bn: {
          title: 'অনুপাত ও কৃষি ঋণের সরল সুদ',
          explanation: 'সমানুপাত দুটি অনুপাতের সমতা নির্দেশ করে। সরল সুদ = (আসল × সুদের হার × সময়) / ১০০।',
          example: '১০,০০০ টাকার কৃষি ঋণে ৪% বার্ষিক হারে ৬ মাসের সুদ মাত্র ২০০ টাকা হয়।'
        }
      }
    },
    solar: {
      beginner: {
        en: {
          title: 'Clean Light From the Sun (Village Solar Lanterns)',
          explanation: 'Photovoltaic cells on the lamp absorb daylight, charge an internal lithium battery, and glow brightly at night without kerosene fumes.',
          example: 'Just 4 hours of bright sunshine powers a student reading lamp for 8 hours of evening study.'
        },
        hi: {
          title: 'सूरज से स्वच्छ रोशनी (सौर लालटेन)',
          explanation: 'सौर सेल धूप को बिजली में बदलकर बैटरी चार्ज करते हैं, जिससे रात में बिना धुएं के सुरक्षित रोशनी मिलती है।',
          example: 'दिन में 4 घंटे की धूप शाम को 8 घंटे तक पढ़ाई के लिए उजाला देती है।'
        },
        or: {
          title: 'ସୂର୍ଯ୍ୟଙ୍କ ଠାରୁ ବିଶୁଦ୍ଧ ଆଲୋକ (ସୌର ଲଣ୍ଠନ)',
          explanation: 'ସୌର ପ୍ୟାନେଲ ଦିନରେ ବ୍ୟାଟେରୀ ଚାର୍ଜ କରେ ଏବଂ ରାତିରେ ବିନା ଧୂଆଁରେ ସୁରକ୍ଷିତ ଆଲୋକ ଯୋଗାଏ।',
          example: '୪ ଘଣ୍ଟା ସୂର୍ଯ୍ୟ କିରଣରେ ଚାର୍ଜ କଲେ ୮ ଘଣ୍ଟା ପଢ଼ିବା ପାଇଁ ଆଲୋକ ମିଳିଥାଏ।'
        },
        bn: {
          title: 'সূর্য থেকে নির্মল আলো (সোলার লণ্ঠন)',
          explanation: 'সোলার সেল দিনের আলো থেকে ব্যাটারি চার্জ করে এবং রাতে ধোঁয়াহীন আলো প্রদান করে।',
          example: '৪ ঘণ্টার সূর্যালোক সন্ধ্যায় ৮ ঘণ্টা পড়াশোনার জন্য পর্যাপ্ত আলো জোগায়।'
        }
      },
      intermediate: {
        en: {
          title: 'Photovoltaic Voltage & Energy Storage Efficiency',
          explanation: 'Silicon semiconductor junctions create electron flow under light. Energy (Watt-hours) = Voltage × Ampere-hours × Efficiency factor.',
          example: 'A 20W solar panel with a 12V 10Ah battery stores roughly 120Wh, enough for two LED lights and mobile charging.'
        },
        hi: {
          title: 'फोटोवोल्टिक वोल्टेज एवं ऊर्जा भंडारण दक्षता',
          explanation: 'सिलिकॉन सेमीकंडक्टर धूप में इलेक्ट्रॉन प्रवाह उत्पन्न करते हैं। कुल ऊर्जा = वोल्ट × एम्पीयर-घंटे × दक्षता।',
          example: '20 वॉट का पैनल 12V बैटरी को चार्ज करके रात भर दो पंखे या लाइट चला सकता है।'
        },
        or: {
          title: 'ଫୋଟୋଭୋଲ୍ଟାଇକ୍ ଭୋଲ୍ଟେଜ୍ ଏବଂ ଶକ୍ତି ସଂରକ୍ଷଣ',
          explanation: 'ସିଲିକନ୍ ସେମିକଣ୍ଡକ୍ଟର ଆଲୋକ ଦ୍ୱାରା ବିଦ୍ୟୁତ୍ ସୃଷ୍ଟି କରେ। ମୋଟ ଶକ୍ତି = ଭୋଲ୍ଟ × ଆମ୍ପିୟର-ଘଣ୍ଟା।',
          example: '୨୦ ୱାଟ୍ ପ୍ୟାନେଲ୍ ଦ୍ୱାରା ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ରାତିରେ ପଢ଼ିବା ସହଜ ହୋଇଥାଏ।'
        },
        bn: {
          title: 'ফটোভোল্টাইক ভোল্টেজ ও শক্তি সঞ্চয় দক্ষতা',
          explanation: 'সিলিকন সেমিকন্ডাক্টরে আলোর প্রভাবে ইলেক্ট্রন প্রবাহ সৃষ্টি হয়। মোট শক্তি = ভোল্ট × অ্যাম্পিয়ার-আওয়ার।',
          example: '২০ ওয়াটের সৌর প্যানেল সহজে দুটি আলো ও পড়ার বাতি পরিচালনা করতে পারে।'
        }
      }
    }
  };

  const currentSnippet = demoExplanations[demoTopic][demoDifficulty][demoLang];

  const faqs = [
    {
      q: 'How does LearnReach AI help students in rural areas with limited internet?',
      a: 'LearnReach AI is optimized for low-bandwidth environments. Sessions store minimal text payloads, support bite-sized modules, and provide offline-friendly practice prompts so students can learn on basic shared devices.'
    },
    {
      q: 'Which regional languages are supported?',
      a: 'LearnReach AI currently supports English, Hindi (हिन्दी), Odia (ଓଡ଼ିଆ), and Bengali (বাংলা). Our translation engine pairs academic translations with everyday regional analogies to overcome language barriers in STEM.'
    },
    {
      q: 'How does the AI Quiz Generator adapt to student performance?',
      a: 'The server tracks concepts missed in past attempts. When generating new quizzes, questions specifically target those weak topics. If a student scores below 50%, foundational analogies are reinforced; when scoring 80%+, the system unlocks advanced challenges.'
    },
    {
      q: 'Can teachers monitor their students\' progress?',
      a: 'Yes! Authorized teachers have a dedicated dashboard to view student rosters, quiz completion rates, and common classroom learning gaps, allowing them to recommend specific revision lessons.'
    },
    {
      q: 'How does this align with UN Sustainable Development Goal 4?',
      a: 'SDG 4 aims to "ensure inclusive and equitable quality education and promote lifelong learning opportunities for all." LearnReach AI directly addresses geographic and linguistic inequalities that leave remote rural students behind.'
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Vision & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-800 bg-teal-50/80 border border-teal-200/60 rounded-md px-3 py-1">
                <span>UN SDG 4: Quality Education Initiative</span>
                <span aria-hidden="true">·</span>
                <span>Bridging the Rural Digital Divide</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]" style={{ textWrap: 'balance' }}>
                Learning That Understands You.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Students in rural and remote regions deserve quality, personalized education. LearnReach AI adapts concepts to your speed, explains tough STEM topics with local everyday analogies, and speaks your regional language.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="px-6 py-3 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#demo-sandbox"
                  className="px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Try Live Adaptive Demo
                </a>
              </div>

              {/* Trust & Access Indicators (Unboxed metadata) */}
              <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Multilingual (Hindi, Odia, Bengali, English)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Adaptive Weak-Topic Quizzes</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>Teacher-Connected Feedback</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Educational Visual */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-white">
                <img
                  src="/src/assets/images/hero_rural_learning_1791610708422.jpg"
                  alt="Students in a rural classroom happily learning together with a digital tablet"
                  className="w-full h-80 sm:h-96 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">Bridging Classrooms & Technology</div>
                  <p className="text-slate-500">
                    Empowering students in remote clusters to master foundational science and mathematics at their own pace.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Three Core Feature Cards */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Three Pillars of Personalized Learning
          </h2>
          <p className="text-sm text-slate-600">
            Built specifically to solve the distinct challenges faced by students who lack specialized subject tutors or English fluency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: AI Personal Tutor */}
          <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                AI Personal Tutor
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                An empathetic study guide that breaks down complex formulas into step-by-step logic, gives everyday farming analogies, and encourages questions without judgment.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-teal-700">
              <Link to="/tutor" className="inline-flex items-center gap-1 hover:underline">
                <span>Explore Tutoring</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-slate-400">Step-by-step guidance</span>
            </div>
          </div>

          {/* Card 2: Regional Language Learning */}
          <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Learn in Your Language
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Academic translations in Hindi, Odia, Bengali, and English that demystify dense textbook passages with regional vocabulary glossaries and simple metaphors.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-teal-700">
              <Link to="/translate" className="inline-flex items-center gap-1 hover:underline">
                <span>Translate Concepts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-slate-400">Native linguistic clarity</span>
            </div>
          </div>

          {/* Card 3: Smart Practice Quizzes */}
          <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Smart Practice Quizzes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Quizzes that dynamically target your previously missed concepts. Our backend calculates scores safely, explains every choice, and recommends customized next steps.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-teal-700">
              <Link to="/quizzes" className="inline-flex items-center gap-1 hover:underline">
                <span>Generate Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-slate-400">Server-validated scores</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Live Demo Sandbox */}
      <section id="demo-sandbox" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-100 pb-6">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                Interactive Pedagogical Sandbox
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Experience How Explanations Adapt
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Select a topic, difficulty tier, and regional language to see live content adaptation in action.
              </p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
              <button
                onClick={() => setDemoLang('en')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${demoLang === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                English
              </button>
              <button
                onClick={() => setDemoLang('hi')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${demoLang === 'hi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setDemoLang('or')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${demoLang === 'or' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                ଓଡ଼ିଆ
              </button>
              <button
                onClick={() => setDemoLang('bn')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${demoLang === 'bn' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* Sandbox Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Topic Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium mr-1">Topic:</span>
              <button
                onClick={() => setDemoTopic('photosynthesis')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${demoTopic === 'photosynthesis' ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'}`}
              >
                Plant Photosynthesis
              </button>
              <button
                onClick={() => setDemoTopic('fractions')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${demoTopic === 'fractions' ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'}`}
              >
                Fractions in Harvest
              </button>
              <button
                onClick={() => setDemoTopic('solar')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${demoTopic === 'solar' ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'}`}
              >
                Village Solar Power
              </button>
            </div>

            {/* Difficulty Tier */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium mr-1">Level:</span>
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
                <button
                  onClick={() => setDemoDifficulty('beginner')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${demoDifficulty === 'beginner' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Beginner (Everyday Analogy)
                </button>
                <button
                  onClick={() => setDemoDifficulty('intermediate')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${demoDifficulty === 'intermediate' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Intermediate (Technical Depth)
                </button>
              </div>
            </div>

          </div>

          {/* Adapted Content Card */}
          <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-teal-800">
                Tutor Output Preview · {demoDifficulty === 'beginner' ? 'Foundational Tier' : 'Advanced Tier'}
              </span>
              <span>Language: {demoLang.toUpperCase()}</span>
            </div>

            <h4 className="text-xl font-bold text-slate-900">
              {currentSnippet.title}
            </h4>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {currentSnippet.explanation}
            </p>

            <div className="p-4 bg-teal-50/60 border border-teal-200/70 rounded-lg space-y-1">
              <div className="text-xs font-semibold text-teal-800 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Rural Contextual Analogy</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic">
                "{currentSnippet.example}"
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Try our full interactive tutor with custom chat, speech options, and your school curriculum.
            </span>
            <Link
              to="/tutor"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
            >
              Open Full AI Tutor
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How LearnReach AI Works
          </h2>
          <p className="text-sm text-slate-600">
            A seamless, adaptive cycle designed around the student's personal comprehension.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="text-xs font-mono text-teal-700 font-semibold">
              01. Diagnostic Setup
            </div>
            <h4 className="text-base font-semibold text-slate-900">
              Set Language & Grade
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose your comfortable dialect and class level so the AI communicates in words you intuitively understand.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="text-xs font-mono text-teal-700 font-semibold">
              02. Conversational Mastery
            </div>
            <h4 className="text-base font-semibold text-slate-900">
              Ask Any Doubt
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interact with your AI tutor. Click "Explain more simply" or "Give me an example" until the concept clicks.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="text-xs font-mono text-teal-700 font-semibold">
              03. Smart Assessment
            </div>
            <h4 className="text-base font-semibold text-slate-900">
              Take Calibrated Quizzes
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Answer questions generated to test the specific concepts you just explored. Scores are validated server-side.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="text-xs font-mono text-teal-700 font-semibold">
              04. Adaptive Progression
            </div>
            <h4 className="text-base font-semibold text-slate-900">
              Bridge Learning Gaps
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Weak topics are automatically flagged for targeted practice, while mastered modules advance your learning streak.
            </p>
          </div>

        </div>
      </section>

      {/* UN SDG 4 Impact Section */}
      <section id="sdg-impact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-900 text-white rounded-2xl p-8 sm:p-12 overflow-hidden relative shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-200 bg-teal-800/80 px-3 py-1 rounded-md">
                <Target className="w-3.5 h-3.5" />
                <span>UN Sustainable Development Goal 4: Quality Education</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Closing the Opportunity Gap for Rural Learners
              </h2>

              <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed">
                Over 250 million children worldwide lack basic literacy and numeracy skills, predominantly in rural and underserved regions. Language mismatch in science and math curricula causes early dropouts.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2 border-t border-teal-800">
                <div>
                  <div className="text-2xl font-bold text-white tabular-nums">4+</div>
                  <div className="text-xs text-teal-200">Regional Languages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white tabular-nums">100%</div>
                  <div className="text-xs text-teal-200">Adaptive Scoring</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white tabular-nums">Zero</div>
                  <div className="text-xs text-teal-200">Paywall or Data Selling</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-xs font-semibold text-teal-950 bg-white rounded-lg hover:bg-stone-100 transition-colors inline-flex items-center gap-2 shadow-xs"
                >
                  Join the LearnReach Mission
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-teal-700/60 shadow-md bg-teal-950">
                <img
                  src="/src/assets/images/sdg4_quality_education_1791610721908.jpg"
                  alt="Artistic representation of UN SDG 4 Quality Education sprouting from an illuminated open book"
                  className="w-full h-72 sm:h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3 bg-teal-950/80 text-xs text-teal-200">
                  Target 4.1 & 4.5: Equitable access and eliminating disparity.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Common questions regarding rural deployment, AI pedagogical ethics, and curriculum support.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-stone-200 rounded-xl bg-white overflow-hidden shadow-xs transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-medium text-sm text-slate-900 hover:text-teal-800"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-teal-700' : ''}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-stone-100/80 border border-stone-200 rounded-2xl p-10 sm:p-14 space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900" style={{ textWrap: 'balance' }}>
            Empower Every Student Today
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Experience the difference when learning adapts to who you are, what language you speak, and where you live.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-6 py-3 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Sign In to Your Dashboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
