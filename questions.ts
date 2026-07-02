export interface Question {
  id: number;
  sentence: string; // The sentence in Spanish with ___
  translation: string; // Armenian translation of the sentence
  correctAnswer: string; // Correct conjugation
  options: string[]; // 4 multiple choice options
  explanation: string; // Explanation of why this verb/conjugation is used
  ruleType: 'origin' | 'location' | 'occupation' | 'condition' | 'characteristic' | 'date-time' | 'material' | 'possession' | 'event' | 'relation';
}

export const QUESTIONS: Question[] = [
  // --- 1/8 FINAL STAGE (Questions 1-4) ---
  {
    id: 1,
    sentence: "Yo ___ de Madrid.",
    translation: "Ես Մադրիդից եմ:",
    correctAnswer: "soy",
    options: ["soy", "estoy", "eres", "está"],
    explanation: "**Ser** բայը օգտագործվում է ծագումը նշելու համար (թե որտեղից է մարդը): *«Yo soy de...»* արտահայտությունը թարգմանվում է որպես *«Ես ...-ից եմ»*:",
    ruleType: "origin"
  },
  {
    id: 2,
    sentence: "La sopa ___ fría.",
    translation: "Ապուրը սառն է (այս պահին):",
    correctAnswer: "está",
    options: ["es", "está", "son", "están"],
    explanation: "**Estar** բայը օգտագործվում է ուտելիքի ժամանակավոր վիճակն արտահայտելու համար: Ապուրը հիմա է սառել կամ սառն է մատուցվել, դա դրա մշտական հատկությունը չէ: Հետևաբար՝ *está*:",
    ruleType: "condition"
  },
  {
    id: 3,
    sentence: "¿Dónde ___ el baño?",
    translation: "Որտե՞ղ է գտնվում զուգարանը:",
    correctAnswer: "está",
    options: ["es", "está", "eres", "estás"],
    explanation: "Առարկաների, շենքերի և սենյակների գտնվելու վայրը նշելու համար միշտ օգտագործվում է **Estar** բայը (նույնիսկ եթե դրանք այնտեղ գտնվում են մշտապես):",
    ruleType: "location"
  },
  {
    id: 4,
    sentence: "Nosotros ___ estudiantes.",
    translation: "Մենք ուսանողներ ենք:",
    correctAnswer: "somos",
    options: ["somos", "estamos", "sois", "estáis"],
    explanation: "**Ser** բայը օգտագործվում է մարդկանց մասնագիտությունները, զբաղմունքները և դերերը նշելու համար, նույնիսկ եթե դա ժամանակավոր ուսում է:",
    ruleType: "occupation"
  },

  // --- QUARTERFINAL STAGE (Questions 5-8) ---
  {
    id: 5,
    sentence: "Hoy ___ lunes.",
    translation: "Այսօր երկուշաբթի է:",
    correctAnswer: "es",
    options: ["es", "está", "son", "están"],
    explanation: "**Ser** բայը օգտագործվում է ժամանակը, շաբաթվա օրերը և ամսաթիվը նշելու համար (*«Hoy es...»*):",
    ruleType: "date-time"
  },
  {
    id: 6,
    sentence: "Mi hermano ___ muy alto.",
    translation: "Եղբայրս շատ բարձրահասակ է:",
    correctAnswer: "es",
    options: ["es", "está", "eres", "estás"],
    explanation: "**Ser** բայը նկարագրում է մարդկանց մշտական կամ երկարաժամկետ ֆիզիկական բնութագրերը և բնավորության գծերը:",
    ruleType: "characteristic"
  },
  {
    id: 7,
    sentence: "Juan no ___ en casa hoy.",
    translation: "Խուանն այսօր տանը չէ:",
    correctAnswer: "está",
    options: ["es", "está", "eres", "estás"],
    explanation: "**Estar** բայը օգտագործվում է մարդկանց գտնվելու վայրը նշելու համար (*«estar en casa»* — տանը լինել):",
    ruleType: "location"
  },
  {
    id: 8,
    sentence: "María y Ana ___ cansadas.",
    translation: "Մարիան և Անան հոգնել են:",
    correctAnswer: "están",
    options: ["son", "están", "somos", "estamos"],
    explanation: "**Estar** բայը արտահայտում է մարդկանց ժամանակավոր ֆիզիկական և հուզական վիճակները (հոգնածություն, տրամադրություն):",
    ruleType: "condition"
  },

  // --- SEMIFINAL STAGE (Questions 9-12) ---
  {
    id: 9,
    sentence: "Este reloj ___ de oro.",
    translation: "Այս ժամացույցը ոսկուց է:",
    correctAnswer: "es",
    options: ["es", "está", "son", "están"],
    explanation: "**Ser** բայը օգտագործվում է այն նյութը նկարագրելու համար, որից պատրաստված է առարկան (*«es de oro»* — ոսկուց է):",
    ruleType: "material"
  },
  {
    id: 10,
    sentence: "¿De quién ___ este libro?",
    translation: "Ո՞ւմ գիրքն է սա:",
    correctAnswer: "es",
    options: ["es", "está", "son", "están"],
    explanation: "**Ser** բայը արտահայտում է առարկայի պատկանելությունը կամ տիրապետումը (*«es de Juan»* — Խուանի գիրքն է):",
    ruleType: "possession"
  },
  {
    id: 11,
    sentence: "Mis padres ___ médicos.",
    translation: "Ծնողներս բժիշկներ են:",
    correctAnswer: "son",
    options: ["son", "están", "somos", "estamos"],
    explanation: "**Ser** բայը պարտադիր է հոգնակի կամ եզակի թվով մասնագիտությունները նշելիս (*«ellos son médicos»*):",
    ruleType: "occupation"
  },
  {
    id: 12,
    sentence: "El concierto ___ en el estadio.",
    translation: "Համերգը տեղի է ունենում մարզադաշտում:",
    correctAnswer: "es",
    options: ["es", "está", "son", "están"],
    explanation: "Հատուկ կանոն. Թեև մարզադաշտը վայր է, բայց **միջոցառումների** (համերգներ, երեկույթներ, խաղեր) անցկացման վայրը նշելու համար օգտագործվում է **Ser** բայը:",
    ruleType: "event"
  },

  // --- FINAL STAGE (Questions 13-15) ---
  {
    id: 13,
    sentence: "¿Tú ___ triste hoy?",
    translation: "Դու տխո՞ւր ես այսօր:",
    correctAnswer: "estás",
    options: ["eres", "estás", "es", "está"],
    explanation: "**Estar** բայը արտահայտում է ժամանակավոր զգացմունքներ և էմոցիաներ: Այսօր տխուր լինելը ժամանակավոր տրամադրություն է, ուստի ընտրում ենք *estás*:",
    ruleType: "condition"
  },
  {
    id: 14,
    sentence: "La puerta ___ abierta.",
    translation: "Դուռը բաց է:",
    correctAnswer: "está",
    options: ["es", "está", "son", "están"],
    explanation: "**Estar** բայը օգտագործվում է առարկաների ներկա վիճակը նկարագրելու համար, որն առաջացել է որևէ գործողության արդյունքում (բաց է, փակ է, կոտրված է):",
    ruleType: "condition"
  },
  {
    id: 15,
    sentence: "Nosotros ___ de Rusia.",
    translation: "Մենք Ռուսաստանից ենք:",
    correctAnswer: "somos",
    options: ["somos", "estamos", "sois", "estáis"],
    explanation: "**Ser** բայը օգտագործվում է մարդկանց խմբի քաղաքացիությունը կամ ծագումն արտահայտելու համար (*«somos de Rusia»*):",
    ruleType: "origin"
  }
];

export interface TournamentStage {
  name: string;
  armenianName: string;
  questionIds: number[];
  requiredWins: number;
}

export const TOURNAMENT_STAGES: TournamentStage[] = [
  {
    name: "Round of 16",
    armenianName: "1/8 Եզրափակիչ",
    questionIds: [1, 2, 3, 4],
    requiredWins: 3
  },
  {
    name: "Quarterfinals",
    armenianName: "Քառորդ եզրափակիչ",
    questionIds: [5, 6, 7, 8],
    requiredWins: 3
  },
  {
    name: "Semifinals",
    armenianName: "Կիսաեզրափակիչ",
    questionIds: [9, 10, 11, 12],
    requiredWins: 3
  },
  {
    name: "Final",
    armenianName: "Եզրափակիչ",
    questionIds: [13, 14, 15],
    requiredWins: 2
  }
];

export const SER_ESTAR_CHEAT_SHEET = {
  ser: {
    title: "SER (Լինել / Գոյություն ունենալ)",
    usage: [
      { tag: "D", rule: "Description (Նկարագրություն)", example: "El cielo es azul." },
      { tag: "O", rule: "Occupation (Մասնագիտություն)", example: "Yo soy profesor." },
      { tag: "C", rule: "Characteristic (Բնութագիր)", example: "Él es muy inteligente." },
      { tag: "T", rule: "Time & Date (Ժամանակ և Ամսաթվեր)", example: "Hoy es martes. Son las dos." },
      { tag: "O", rule: "Origin (Ծագում)", example: "Nosotros somos de España." },
      { tag: "R", rule: "Relation (Հարաբերություններ / Պատկանելություն)", example: "Este libro es de mi hermano." }
    ]
  },
  estar: {
    title: "ESTAR (Գտնվել / Լինել ինչ-որ վիճակում)",
    usage: [
      { tag: "P", rule: "Position (Դիրք / Կեցվածք)", example: "Él está sentado." },
      { tag: "L", rule: "Location (Գտնվելու վայր)", example: "El gato está en el jardín." },
      { tag: "A", rule: "Action (Գործողություն հենց հիմա)", example: "Estoy studying español." },
      { tag: "C", rule: "Condition (Ժամանակավոր վիճակ)", example: "La sopa está caliente." },
      { tag: "E", rule: "Emotion (Տրամադրություն / Էմոցիաներ)", example: "Ellas están muy felices hoy." }
    ]
  }
};
