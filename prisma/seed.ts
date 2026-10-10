// LearnReach AI - Database Seed Script
// Seeds realistic curriculum data (Science, Math, Environmental Studies) tailored for rural and regional education

import bcrypt from 'bcryptjs';

export async function getSeedData() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const users = [
    {
      id: 'usr_student_priya',
      email: 'priya@rurallearn.org',
      passwordHash,
      name: 'Priya Sharma',
      role: 'STUDENT',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        id: 'prof_priya',
        userId: 'usr_student_priya',
        preferredLanguage: 'hi', // Hindi
        learningLevel: 'BEGINNER',
        gradeLevel: 'Class 8',
        villageOrRegion: 'Sundargarh District, Odisha',
        schoolName: 'Adarsha Vidyalaya',
        dailyGoalMinutes: 35,
        streakDays: 4,
        totalPoints: 340,
      }
    },
    {
      id: 'usr_student_rohit',
      email: 'rohit@rurallearn.org',
      passwordHash,
      name: 'Rohit Mandal',
      role: 'STUDENT',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rohit',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        id: 'prof_rohit',
        userId: 'usr_student_rohit',
        preferredLanguage: 'bn', // Bengali
        learningLevel: 'INTERMEDIATE',
        gradeLevel: 'Class 9',
        villageOrRegion: 'Bankura Rural Hub, West Bengal',
        schoolName: 'Govt. High School',
        dailyGoalMinutes: 30,
        streakDays: 7,
        totalPoints: 520,
      }
    },
    {
      id: 'usr_teacher_anita',
      email: 'teacher@rurallearn.org',
      passwordHash,
      name: 'Anita Patra (Head Teacher)',
      role: 'TEACHER',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=TeacherAnita',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'usr_admin_vikram',
      email: 'admin@rurallearn.org',
      passwordHash,
      name: 'Vikram Sengupta (System Admin)',
      role: 'ADMIN',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminVikram',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const subjects = [
    {
      id: 'subj_math',
      name: 'Mathematics & Everyday Logic',
      code: 'MATH',
      description: 'Foundations of numbers, fractions, geometry, and farm-to-market calculations.',
      icon: 'calculator',
      grade: 'Class 6 - 10',
      order: 1
    },
    {
      id: 'subj_science',
      name: 'General Science & Agriculture',
      code: 'SCI',
      description: 'Plant biology, water cycles, renewable solar energy, and basic physics for rural settings.',
      icon: 'flask-conical',
      grade: 'Class 6 - 10',
      order: 2
    },
    {
      id: 'subj_environment',
      name: 'Environmental Studies (SDG 4 & Climate)',
      code: 'EVS',
      description: 'Ecology, sustainable farming, soil preservation, and clean water systems.',
      icon: 'sprout',
      grade: 'Class 6 - 9',
      order: 3
    },
    {
      id: 'subj_english',
      name: 'Practical English & Global Literacy',
      code: 'ENG',
      description: 'Bridging regional dialects with conversational and academic English.',
      icon: 'languages',
      grade: 'Class 6 - 10',
      order: 4
    }
  ];

  const topics = [
    {
      id: 'top_fractions',
      subjectId: 'subj_math',
      title: 'Fractions & Proportions in Farming',
      description: 'Understanding parts of a whole through land division, seed distribution, and daily trade.',
      difficulty: 'BEGINNER',
      order: 1
    },
    {
      id: 'top_percentage',
      subjectId: 'subj_math',
      title: 'Percentages & Simple Interest (Kisan Loan Math)',
      description: 'Calculating interest rates, discounts on fertilizer, and market profit margins.',
      difficulty: 'INTERMEDIATE',
      order: 2
    },
    {
      id: 'top_photosynthesis',
      subjectId: 'subj_science',
      title: 'Photosynthesis & Plant Respiration',
      description: 'How green crops turn sunlight and carbon dioxide into food and oxygen.',
      difficulty: 'BEGINNER',
      order: 1
    },
    {
      id: 'top_solar',
      subjectId: 'subj_science',
      title: 'Solar Energy & Electric Circuits',
      description: 'How village solar lamps work, battery storage, and clean power generation.',
      difficulty: 'INTERMEDIATE',
      order: 2
    },
    {
      id: 'top_water_cycle',
      subjectId: 'subj_environment',
      title: 'Groundwater, Rainfall & Monsoons',
      description: 'The science of evaporation, cloud formation, percolation, and rainwater harvesting ponds.',
      difficulty: 'BEGINNER',
      order: 1
    },
    {
      id: 'top_verbs',
      subjectId: 'subj_english',
      title: 'Everyday Action Words & Tenses',
      description: 'Expressing actions clearly in past, present, and future forms.',
      difficulty: 'BEGINNER',
      order: 1
    }
  ];

  const lessons = [
    {
      id: 'les_photosynthesis_1',
      topicId: 'top_photosynthesis',
      title: 'How Green Leaves Feed Our Crops',
      summary: 'Learn the role of chlorophyll, sunlight, and water in sustaining life on earth.',
      content: `Photosynthesis is nature's kitchen inside every green leaf. The word comes from 'Photo' (light) and 'Synthesis' (putting together). 

Plants absorb water through roots from the soil, capture carbon dioxide from the air through tiny openings called stomata, and use sunlight caught by green chlorophyll pigment to produce glucose (sugar) and oxygen.

Equation in simple terms:
Sunlight + Carbon Dioxide + Water -> Glucose (Energy for plant) + Oxygen (Breath for us).`,
      keyPoints: [
        'Chlorophyll gives leaves their green color and traps solar rays.',
        'Stomata are microscopic pores on the underside of leaves.',
        'Oxygen is released as a vital byproduct that humans and animals breathe.',
        'During the night, plants pause photosynthesis and mainly respire.'
      ],
      practicalExample: 'Think of paddy fields in the morning sun: when leaves spread wide, they are soaking up sunlight like solar cookers to grow healthy grain ears.',
      ruralContextNote: 'Farmers notice crops growing slower during persistent cloudy monsoon weeks because less sunlight reaches chlorophyll to power glucose production.'
    },
    {
      id: 'les_fractions_1',
      topicId: 'top_fractions',
      title: 'Dividing Field Harvests Fairly',
      summary: 'Mastering numerators and denominators through physical land division.',
      content: `A fraction represents part of a whole quantity. The top number is the Numerator (how many pieces you take) and the bottom number is the Denominator (how many equal pieces the whole was divided into).

When two neighbors share 1 bag of organic seeds equally, each gets 1/2 (one-half). If divided among 4 farming families, each gets 1/4 (one-fourth).`,
      keyPoints: [
        'Numerator = selected parts; Denominator = total equal pieces.',
        'Equal size is essential: 1/4 means four strictly identical shares.',
        'Equivalent fractions: 2/4 is the exact same amount as 1/2.'
      ],
      practicalExample: 'If a farmer has 8 sacks of wheat and keeps 2 sacks for the family while selling 6 sacks at the weekly mandi (market), the family keeps 2/8 (or 1/4) of the harvest.',
      ruralContextNote: 'Used every day in traditional land sharing (Batta / Adhi system) and measuring pond irrigation water shares.'
    }
  ];

  const quizzes = [
    {
      id: 'quiz_photosynthesis_intro',
      title: 'Photosynthesis Mastery & Crop Science',
      subjectId: 'subj_science',
      topicId: 'top_photosynthesis',
      difficulty: 'BEGINNER',
      language: 'en',
      questionCount: 4,
      isAiGenerated: false,
      questions: [
        {
          id: 'q_photo_1',
          prompt: 'Which green pigment in leaves captures energy from sunlight?',
          options: ['Hemoglobin', 'Chlorophyll', 'Melanin', 'Carotene'],
          correctOptionIndex: 1,
          explanation: 'Chlorophyll is the green pigment in plant cells that traps solar energy needed to drive photosynthesis.',
          topicConcept: 'Chlorophyll & Light Absorption'
        },
        {
          id: 'q_photo_2',
          prompt: 'What gas do plants take in from the atmosphere to carry out photosynthesis?',
          options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
          correctOptionIndex: 2,
          explanation: 'Leaves absorb Carbon Dioxide (CO2) through microscopic pores called stomata.',
          topicConcept: 'Gas Exchange & Stomata'
        },
        {
          id: 'q_photo_3',
          prompt: 'What essential gas is released into the air as a byproduct of photosynthesis?',
          options: ['Carbon Monoxide', 'Oxygen', 'Methane', 'Helium'],
          correctOptionIndex: 1,
          explanation: 'Oxygen (O2) is split from water molecules and released into the air for humans and animals to breathe.',
          topicConcept: 'Byproduct of Photosynthesis'
        },
        {
          id: 'q_photo_4',
          prompt: 'Why do crops grow slower during prolonged cloudy monsoon weeks?',
          options: [
            'They have too much oxygen',
            'Reduced sunlight decreases the rate of photosynthesis',
            'The soil loses all nitrogen instantly',
            'Plants sleep all day when cloudy'
          ],
          correctOptionIndex: 1,
          explanation: 'Sunlight is the fundamental energy source; without sufficient light, the photosynthetic machinery cannot manufacture enough glucose.',
          topicConcept: 'Environmental Factors on Plant Growth'
        }
      ]
    },
    {
      id: 'quiz_fractions_basic',
      title: 'Fractions in Everyday Village Trade',
      subjectId: 'subj_math',
      topicId: 'top_fractions',
      difficulty: 'BEGINNER',
      language: 'en',
      questionCount: 3,
      isAiGenerated: false,
      questions: [
        {
          id: 'q_frac_1',
          prompt: 'In the fraction 3/5, what is the number 5 called and what does it represent?',
          options: [
            'Numerator: the parts taken',
            'Denominator: the total number of equal parts',
            'Remainder: the leftover portion',
            'Factor: the multiplier'
          ],
          correctOptionIndex: 1,
          explanation: 'The bottom number is the denominator, which shows how many equal parts make up the complete whole.',
          topicConcept: 'Numerator vs Denominator'
        },
        {
          id: 'q_frac_2',
          prompt: 'A farmer divides 12 bighas of land equally among 3 children. What fraction of the total land does each child receive?',
          options: ['1/2', '1/3', '3/12 which equals 1/4', '1/6'],
          correctOptionIndex: 1,
          explanation: 'Dividing any whole among 3 equal recipients gives 1/3 to each.',
          topicConcept: 'Equal Division Fractions'
        },
        {
          id: 'q_frac_3',
          prompt: 'Which fraction is equivalent to 2/4?',
          options: ['1/3', '1/2', '3/4', '2/8'],
          correctOptionIndex: 1,
          explanation: 'Dividing both numerator and denominator by 2 simplifies 2/4 to 1/2.',
          topicConcept: 'Equivalent Fractions'
        }
      ]
    }
  ];

  return { users, subjects, topics, lessons, quizzes };
}
