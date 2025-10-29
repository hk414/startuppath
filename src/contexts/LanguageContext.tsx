import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'zh' | 'fr' | 'es' | 'pt' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('preferredLanguage') as Language;
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = language;
    // Update dir attribute for RTL languages
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English
        value = translations.en;
        for (const k of keys) {
          value = value?.[k];
          if (value === undefined) return key;
        }
        return value || key;
      }
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  en: {
    nav: {
      features: "Features",
      howItWorks: "How It Works",
      guidebook: "Guidebook",
      challenges: "🎮 Challenges",
      signIn: "Sign In",
      dashboard: "Dashboard",
    },
    features: {
      title: "Everything You Need to",
      titleHighlight: "Learn and Grow",
      subtitle: "A complete platform designed to capture, analyze, and share the entrepreneurial journey",
      timeline: {
        title: "Interactive Timeline",
        description: "Log every pivot, decision, and milestone in your startup journey with a visual timeline that brings your story to life.",
      },
      decisions: {
        title: "Decision Trees",
        description: "Visualize how each choice led to outcomes, creating a clear map of cause and effect throughout your startup evolution.",
      },
      mentor: {
        title: "AI Mentor Matching",
        description: "Get paired with experienced mentors based on your industry, startup stage, and unique pivot history for personalized guidance.",
      },
      guidebook: {
        title: "Guidebook Library",
        description: "Access step-by-step startup guides, best practices, case studies, and actionable frameworks from real founders.",
      },
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Three simple steps to transform your startup journey into shared wisdom",
      step1: {
        title: "Document Your Journey",
        description: "Start by logging your startup's pivots, decisions, and key milestones in an intuitive timeline format.",
      },
      step2: {
        title: "Visualize & Reflect",
        description: "See your decision trees come to life, analyze patterns, and receive AI-powered insights on your progress.",
      },
      step3: {
        title: "Connect & Learn",
        description: "Get matched with mentors, access relevant case studies, and share your lessons with the community.",
      },
    },
    cta: {
      badge: "Join 500+ Startups Already Learning Together",
      title: "Ready to Turn Your Startup Story Into Shared Wisdom?",
      subtitle: "Start documenting your journey today and help build a living knowledge base for the next generation of founders.",
      getStarted: "Get Started Free",
      scheduleDemo: "Schedule a Demo",
    },
    footer: {
      description: "Transforming startup journeys into shared wisdom. Document, learn, and grow with the entrepreneurial community.",
      product: "Product",
      features: "Features",
      pricing: "Pricing",
      caseStudies: "Case Studies",
      guidebook: "Guidebook",
      company: "Company",
      about: "About Us",
      blog: "Blog",
      careers: "Careers",
      contact: "Contact",
      copyright: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookie Policy",
    },
    hero: {
      badge: "Empowering Student Entrepreneurs with Clear Guidance",
      title1: "Unite Mentorship,",
      title2: "Guidance & Growth",
      title3: "Build Credibility",
      subtitle: "Struggling to find accessible mentorship? Our platform connects student entrepreneurs with",
      subtitleBold: "mentors, startup guidebooks, and progress tracking",
      subtitleEnd: "to help you build credibility and attract real investors.",
      ctaStart: "Start Your Journey",
      ctaExplore: "Explore Features",
      stats: {
        startups: "Student Startups",
        pivots: "Mentorship Sessions",
        mentors: "Expert Mentors",
      }
    },
    auth: {
      description: "Unite mentorship, guidance & growth for student entrepreneurs",
      signIn: "Sign In",
      signUp: "Sign Up",
      createAccount: "Create Account",
      creatingAccount: "Creating account...",
      gdpr: {
        accept: "I accept the",
        privacy: "Privacy Policy",
        and: "and",
        terms: "Terms of Service",
      },
    },
    challenges: {
      title: "Startup Challenges Arena",
      subtitle: "Play games, earn XP, and level up your entrepreneurial skills",
      level: "Level",
      totalXP: "Total XP",
      tabs: {
        games: "Games",
        leaderboard: "Leaderboard",
      },
      authDialog: {
        title: "Join Startup Challenges",
        description: "Please log in or create an account to join Startup Challenges and track your progress!",
        signIn: "Sign In / Sign Up",
        goBack: "Go Back",
      },
      ideaGenerator: {
        title: "Idea Generator Challenge",
        description: "Spin a random startup theme and pitch your idea in 2 minutes",
        generate: "Generate Random Theme",
        yourTheme: "Your Theme:",
        timeLeft: "Time Left:",
        placeholder: "Describe your startup idea here... What problem does it solve? Who is it for? What makes it unique?",
        submit: "Submit Idea",
        newTheme: "New Theme",
        aiFeedback: "AI Feedback:",
        complete: "🎉 Challenge Complete!",
        earnedXP: "You earned {xp} XP!",
      },
      problemSolver: {
        title: "Problem Solver",
        description: "Choose the best strategy for this startup scenario",
        scenario: "Scenario:",
        submit: "Submit Answer",
        tryAnother: "Try Another Scenario",
        correct: "🎉 Correct!",
        keepLearning: "📚 Keep Learning!",
      },
      simulation: {
        title: "Build Your Startup Simulation",
        description: "Make strategic decisions and grow your virtual startup",
        start: "Start Simulation",
        round: "Round",
        decisionTime: "Decision Time",
        profit: "Profit",
        growth: "Growth",
        reputation: "Reputation",
        complete: "Simulation Complete!",
        performance: "Here's how your startup performed",
        finalScore: "Overall Score",
        playAgain: "Play Again",
      },
      leaderboard: {
        title: "Top 10 Entrepreneurs",
        description: "Monthly leaderboard - Rankings reset at the start of each month",
        you: "You",
        challenges: "challenges",
        noRankings: "No rankings yet. Be the first to play!",
        levels: {
          seed: "🌱 Seed",
          growth: "📈 Growth",
          unicorn: "🦄 Unicorn",
        }
      }
    }
  },
  zh: {
    nav: {
      features: "功能特点",
      howItWorks: "如何运作",
      guidebook: "指南",
      challenges: "🎮 挑战赛",
      signIn: "登录",
      dashboard: "仪表板",
    },
    hero: {
      badge: "将每次转型转化为共享智慧",
      title1: "记录您的",
      title2: "创业历程",
      title3: "加速创新",
      subtitle: "将每一个决策、转型和突破转化为",
      subtitleBold: "可行的见解",
      subtitleEnd: "为整个创业生态系统提供动力。",
      ctaStart: "开始您的旅程",
      ctaExplore: "探索功能",
      stats: {
        startups: "追踪的初创公司",
        pivots: "记录的转型",
        mentors: "活跃导师",
      }
    },
    challenges: {
      title: "创业挑战竞技场",
      subtitle: "玩游戏，赚取经验值，提升您的创业技能",
      level: "等级",
      totalXP: "总经验值",
      tabs: {
        games: "游戏",
        leaderboard: "排行榜",
      },
      authDialog: {
        title: "加入创业挑战",
        description: "请登录或创建账户以加入创业挑战并跟踪您的进度！",
        signIn: "登录 / 注册",
        goBack: "返回",
      },
      ideaGenerator: {
        title: "创意生成挑战",
        description: "随机生成创业主题并在2分钟内推销您的想法",
        generate: "生成随机主题",
        yourTheme: "您的主题：",
        timeLeft: "剩余时间：",
        placeholder: "在这里描述您的创业想法...它解决什么问题？面向谁？什么使它独特？",
        submit: "提交想法",
        newTheme: "新主题",
        aiFeedback: "AI反馈：",
        complete: "🎉 挑战完成！",
        earnedXP: "您获得了 {xp} 经验值！",
      },
      problemSolver: {
        title: "问题解决者",
        description: "为这个创业场景选择最佳策略",
        scenario: "场景：",
        submit: "提交答案",
        tryAnother: "尝试另一个场景",
        correct: "🎉 正确！",
        keepLearning: "📚 继续学习！",
      },
      simulation: {
        title: "建立您的创业模拟",
        description: "做出战略决策并发展您的虚拟创业",
        start: "开始模拟",
        round: "回合",
        decisionTime: "决策时间",
        profit: "利润",
        growth: "增长",
        reputation: "声誉",
        complete: "模拟完成！",
        performance: "这是您创业的表现",
        finalScore: "总分",
        playAgain: "再玩一次",
      },
      leaderboard: {
        title: "前10名创业者",
        description: "月度排行榜 - 每月初重置排名",
        you: "您",
        challenges: "挑战",
        noRankings: "还没有排名。成为第一个玩的人！",
        levels: {
          seed: "🌱 种子",
          growth: "📈 成长",
          unicorn: "🦄 独角兽",
        }
      }
    }
  },
  fr: {
    nav: {
      features: "Fonctionnalités",
      howItWorks: "Comment ça marche",
      guidebook: "Guide",
      challenges: "🎮 Défis",
      signIn: "Se connecter",
      dashboard: "Tableau de bord",
    },
    hero: {
      badge: "Transformez chaque pivot en sagesse partagée",
      title1: "Documentez votre",
      title2: "Parcours Entrepreneurial",
      title3: "Accélérez l'Innovation",
      subtitle: "Transformez chaque décision, pivot et percée en",
      subtitleBold: "informations exploitables",
      subtitleEnd: "qui alimentent l'ensemble de l'écosystème entrepreneurial.",
      ctaStart: "Commencez votre voyage",
      ctaExplore: "Découvrir les fonctionnalités",
      stats: {
        startups: "Startups suivies",
        pivots: "Pivots documentés",
        mentors: "Mentors actifs",
      }
    },
    challenges: {
      title: "Arène des défis entrepreneuriaux",
      subtitle: "Jouez à des jeux, gagnez de l'XP et améliorez vos compétences entrepreneuriales",
      level: "Niveau",
      totalXP: "XP total",
      tabs: {
        games: "Jeux",
        leaderboard: "Classement",
      },
      authDialog: {
        title: "Rejoindre les défis",
        description: "Veuillez vous connecter ou créer un compte pour rejoindre les défis et suivre vos progrès !",
        signIn: "Se connecter / S'inscrire",
        goBack: "Retour",
      },
      ideaGenerator: {
        title: "Défi du générateur d'idées",
        description: "Tournez un thème de startup aléatoire et présentez votre idée en 2 minutes",
        generate: "Générer un thème aléatoire",
        yourTheme: "Votre thème :",
        timeLeft: "Temps restant :",
        placeholder: "Décrivez votre idée de startup ici... Quel problème résout-elle ? Pour qui ? Qu'est-ce qui la rend unique ?",
        submit: "Soumettre l'idée",
        newTheme: "Nouveau thème",
        aiFeedback: "Retour IA :",
        complete: "🎉 Défi terminé !",
        earnedXP: "Vous avez gagné {xp} XP !",
      },
      problemSolver: {
        title: "Résolveur de problèmes",
        description: "Choisissez la meilleure stratégie pour ce scénario de startup",
        scenario: "Scénario :",
        submit: "Soumettre la réponse",
        tryAnother: "Essayer un autre scénario",
        correct: "🎉 Correct !",
        keepLearning: "📚 Continuez à apprendre !",
      },
      simulation: {
        title: "Construisez votre simulation de startup",
        description: "Prenez des décisions stratégiques et développez votre startup virtuelle",
        start: "Démarrer la simulation",
        round: "Tour",
        decisionTime: "Temps de décision",
        profit: "Profit",
        growth: "Croissance",
        reputation: "Réputation",
        complete: "Simulation terminée !",
        performance: "Voici les performances de votre startup",
        finalScore: "Score global",
        playAgain: "Rejouer",
      },
      leaderboard: {
        title: "Top 10 des entrepreneurs",
        description: "Classement mensuel - Les classements sont réinitialisés au début de chaque mois",
        you: "Vous",
        challenges: "défis",
        noRankings: "Pas encore de classement. Soyez le premier à jouer !",
        levels: {
          seed: "🌱 Graine",
          growth: "📈 Croissance",
          unicorn: "🦄 Licorne",
        }
      }
    }
  },
  es: {
    nav: {
      features: "Características",
      howItWorks: "Cómo funciona",
      guidebook: "Guía",
      challenges: "🎮 Desafíos",
      signIn: "Iniciar sesión",
      dashboard: "Panel",
    },
    hero: {
      badge: "Convierte cada pivote en sabiduría compartida",
      title1: "Documenta tu",
      title2: "Viaje Emprendedor",
      title3: "Acelera la Innovación",
      subtitle: "Transforma cada decisión, pivote y avance en",
      subtitleBold: "conocimientos accionables",
      subtitleEnd: "que impulsan todo el ecosistema emprendedor.",
      ctaStart: "Comienza tu viaje",
      ctaExplore: "Explorar características",
      stats: {
        startups: "Startups rastreadas",
        pivots: "Pivotes documentados",
        mentors: "Mentores activos",
      }
    },
    challenges: {
      title: "Arena de desafíos empresariales",
      subtitle: "Juega, gana XP y mejora tus habilidades emprendedoras",
      level: "Nivel",
      totalXP: "XP total",
      tabs: {
        games: "Juegos",
        leaderboard: "Clasificación",
      },
      authDialog: {
        title: "Únete a los desafíos",
        description: "¡Inicia sesión o crea una cuenta para unirte a los desafíos y seguir tu progreso!",
        signIn: "Iniciar sesión / Registrarse",
        goBack: "Volver",
      },
      ideaGenerator: {
        title: "Desafío del generador de ideas",
        description: "Gira un tema de startup aleatorio y presenta tu idea en 2 minutos",
        generate: "Generar tema aleatorio",
        yourTheme: "Tu tema:",
        timeLeft: "Tiempo restante:",
        placeholder: "Describe tu idea de startup aquí... ¿Qué problema resuelve? ¿Para quién es? ¿Qué la hace única?",
        submit: "Enviar idea",
        newTheme: "Nuevo tema",
        aiFeedback: "Comentarios de IA:",
        complete: "🎉 ¡Desafío completado!",
        earnedXP: "¡Ganaste {xp} XP!",
      },
      problemSolver: {
        title: "Solucionador de problemas",
        description: "Elige la mejor estrategia para este escenario de startup",
        scenario: "Escenario:",
        submit: "Enviar respuesta",
        tryAnother: "Probar otro escenario",
        correct: "🎉 ¡Correcto!",
        keepLearning: "📚 ¡Sigue aprendiendo!",
      },
      simulation: {
        title: "Construye tu simulación de startup",
        description: "Toma decisiones estratégicas y haz crecer tu startup virtual",
        start: "Iniciar simulación",
        round: "Ronda",
        decisionTime: "Tiempo de decisión",
        profit: "Beneficio",
        growth: "Crecimiento",
        reputation: "Reputación",
        complete: "¡Simulación completada!",
        performance: "Así es como funcionó tu startup",
        finalScore: "Puntuación total",
        playAgain: "Jugar de nuevo",
      },
      leaderboard: {
        title: "Top 10 emprendedores",
        description: "Clasificación mensual - Las clasificaciones se reinician al comienzo de cada mes",
        you: "Tú",
        challenges: "desafíos",
        noRankings: "Aún no hay clasificaciones. ¡Sé el primero en jugar!",
        levels: {
          seed: "🌱 Semilla",
          growth: "📈 Crecimiento",
          unicorn: "🦄 Unicornio",
        }
      }
    }
  },
  pt: {
    nav: {
      features: "Recursos",
      howItWorks: "Como funciona",
      guidebook: "Guia",
      challenges: "🎮 Desafios",
      signIn: "Entrar",
      dashboard: "Painel",
    },
    hero: {
      badge: "Transforme cada pivô em sabedoria compartilhada",
      title1: "Documente sua",
      title2: "Jornada Empreendedora",
      title3: "Acelere a Inovação",
      subtitle: "Transforme cada decisão, pivô e avanço em",
      subtitleBold: "insights acionáveis",
      subtitleEnd: "que impulsionam todo o ecossistema empreendedor.",
      ctaStart: "Comece sua jornada",
      ctaExplore: "Explorar recursos",
      stats: {
        startups: "Startups rastreadas",
        pivots: "Pivôs documentados",
        mentors: "Mentores ativos",
      }
    },
    challenges: {
      title: "Arena de desafios empresariais",
      subtitle: "Jogue, ganhe XP e melhore suas habilidades empreendedoras",
      level: "Nível",
      totalXP: "XP total",
      tabs: {
        games: "Jogos",
        leaderboard: "Classificação",
      },
      authDialog: {
        title: "Junte-se aos desafios",
        description: "Faça login ou crie uma conta para participar dos desafios e acompanhar seu progresso!",
        signIn: "Entrar / Registrar",
        goBack: "Voltar",
      },
      ideaGenerator: {
        title: "Desafio do gerador de ideias",
        description: "Gire um tema de startup aleatório e apresente sua ideia em 2 minutos",
        generate: "Gerar tema aleatório",
        yourTheme: "Seu tema:",
        timeLeft: "Tempo restante:",
        placeholder: "Descreva sua ideia de startup aqui... Que problema ela resolve? Para quem é? O que a torna única?",
        submit: "Enviar ideia",
        newTheme: "Novo tema",
        aiFeedback: "Feedback da IA:",
        complete: "🎉 Desafio concluído!",
        earnedXP: "Você ganhou {xp} XP!",
      },
      problemSolver: {
        title: "Solucionador de problemas",
        description: "Escolha a melhor estratégia para este cenário de startup",
        scenario: "Cenário:",
        submit: "Enviar resposta",
        tryAnother: "Tentar outro cenário",
        correct: "🎉 Correto!",
        keepLearning: "📚 Continue aprendendo!",
      },
      simulation: {
        title: "Construa sua simulação de startup",
        description: "Tome decisões estratégicas e faça sua startup virtual crescer",
        start: "Iniciar simulação",
        round: "Rodada",
        decisionTime: "Tempo de decisão",
        profit: "Lucro",
        growth: "Crescimento",
        reputation: "Reputação",
        complete: "Simulação concluída!",
        performance: "Veja como sua startup se saiu",
        finalScore: "Pontuação total",
        playAgain: "Jogar novamente",
      },
      leaderboard: {
        title: "Top 10 empreendedores",
        description: "Classificação mensal - As classificações são redefinidas no início de cada mês",
        you: "Você",
        challenges: "desafios",
        noRankings: "Ainda não há classificações. Seja o primeiro a jogar!",
        levels: {
          seed: "🌱 Semente",
          growth: "📈 Crescimento",
          unicorn: "🦄 Unicórnio",
        }
      }
    }
  },
  ar: {
    nav: {
      features: "الميزات",
      howItWorks: "كيف يعمل",
      guidebook: "الدليل",
      challenges: "🎮 التحديات",
      signIn: "تسجيل الدخول",
      dashboard: "لوحة التحكم",
    },
    hero: {
      badge: "حول كل تغيير إلى حكمة مشتركة",
      title1: "وثق",
      title2: "رحلة شركتك الناشئة",
      title3: "عجّل الابتكار",
      subtitle: "حول كل قرار وتغيير واختراق إلى",
      subtitleBold: "رؤى قابلة للتنفيذ",
      subtitleEnd: "تدعم النظام البيئي الريادي بأكمله.",
      ctaStart: "ابدأ رحلتك",
      ctaExplore: "استكشف الميزات",
      stats: {
        startups: "الشركات المتتبعة",
        pivots: "التغييرات الموثقة",
        mentors: "الموجهون النشطون",
      }
    },
    challenges: {
      title: "ساحة تحديات الشركات الناشئة",
      subtitle: "العب الألعاب، اكسب نقاط الخبرة، وطوّر مهاراتك الريادية",
      level: "المستوى",
      totalXP: "نقاط الخبرة الإجمالية",
      tabs: {
        games: "الألعاب",
        leaderboard: "لوحة المتصدرين",
      },
      authDialog: {
        title: "انضم إلى التحديات",
        description: "يرجى تسجيل الدخول أو إنشاء حساب للانضمام إلى التحديات وتتبع تقدمك!",
        signIn: "تسجيل الدخول / التسجيل",
        goBack: "العودة",
      },
      ideaGenerator: {
        title: "تحدي مولد الأفكار",
        description: "اختر موضوعًا عشوائيًا للشركة الناشئة وقدم فكرتك في دقيقتين",
        generate: "توليد موضوع عشوائي",
        yourTheme: "موضوعك:",
        timeLeft: "الوقت المتبقي:",
        placeholder: "صف فكرة شركتك الناشئة هنا... ما المشكلة التي تحلها؟ لمن؟ ما الذي يجعلها فريدة؟",
        submit: "إرسال الفكرة",
        newTheme: "موضوع جديد",
        aiFeedback: "ملاحظات الذكاء الاصطناعي:",
        complete: "🎉 اكتمل التحدي!",
        earnedXP: "لقد كسبت {xp} نقطة خبرة!",
      },
      problemSolver: {
        title: "حل المشكلات",
        description: "اختر أفضل استراتيجية لسيناريو الشركة الناشئة هذا",
        scenario: "السيناريو:",
        submit: "إرسال الإجابة",
        tryAnother: "جرب سيناريو آخر",
        correct: "🎉 صحيح!",
        keepLearning: "📚 استمر في التعلم!",
      },
      simulation: {
        title: "بناء محاكاة شركتك الناشئة",
        description: "اتخذ قرارات استراتيجية وطور شركتك الناشئة الافتراضية",
        start: "بدء المحاكاة",
        round: "الجولة",
        decisionTime: "وقت القرار",
        profit: "الربح",
        growth: "النمو",
        reputation: "السمعة",
        complete: "اكتملت المحاكاة!",
        performance: "إليك كيف كان أداء شركتك الناشئة",
        finalScore: "النتيجة الإجمالية",
        playAgain: "العب مرة أخرى",
      },
      leaderboard: {
        title: "أفضل 10 رواد أعمال",
        description: "لوحة المتصدرين الشهرية - تُعاد تعيين التصنيفات في بداية كل شهر",
        you: "أنت",
        challenges: "تحديات",
        noRankings: "لا توجد تصنيفات بعد. كن أول من يلعب!",
        levels: {
          seed: "🌱 بذرة",
          growth: "📈 نمو",
          unicorn: "🦄 يونيكورن",
        }
      }
    }
  }
};
