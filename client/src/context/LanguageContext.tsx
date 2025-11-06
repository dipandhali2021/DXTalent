import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type Language = 'en' | 'jp';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations = {
  en: {
    // Hero Section
    'hero.badge': '🚀 Level Up Your DX Skills',
    'hero.title': 'Master Digital Skills',
    // Subtitle is split so we can highlight (underline) only part of it
    'hero.subtitle_before': 'Through ',
    'hero.subtitle_highlight': 'Gamified Learning',
    'hero.description':
      'Discover motivated talent by teaching and evaluating DX-related skills through our gamified e-learning platform. Recruiters discover top performers. Learners earn recognition.',
    'hero.dashboard': '🏆 Go to Dashboard',
    'hero.challenges': '50+ Gamified Challenges',
    'hero.learners': '10K+ Active Learners',
    'hero.partners': '200+ Recruiting Partners',
    'hero.start_learning': 'Start Learning',
    'hero.for_recruiters': 'For Recruiters',
    'hero.go_to_dashboard': 'Go to Dashboard',

    // Features Section
    'features.badge': '💡 Why Choose Us',
    'features.title': 'Learning That Actually',
    'features.work': 'Works',
    'features.skill.title': 'Skill Challenges',
    'features.skill.desc':
      'Complete hands-on DX challenges and earn points. Real-world scenarios that matter.',
    'features.leaderboard.title': 'Leaderboards',
    'features.leaderboard.desc':
      'Compete with peers and showcase your skills. Top performers get noticed by recruiters.',
    'features.talent.title': 'Talent Discovery',
    'features.talent.desc':
      'Recruiters discover motivated learners with proven skills, not just resumes.',
    'features.assessment.title': 'Real Assessments',
    'features.assessment.desc':
      'Practical evaluations that test actual DX capabilities, not theory.',
    'features.feedback.title': 'Instant Feedback',
    'features.feedback.desc':
      'Get immediate insights on your performance and areas to improve.',
    'features.badges.title': 'Earn Badges',
    'features.badges.desc':
      'Unlock achievements and certifications that prove your expertise.',

    // How It Works Section
    'howitworks.badge': '📝 Simple Process',
    'howitworks.title': 'How It Works',
    'howitworks.subtitle':
      'Three simple steps to master DX skills and get discovered',
    'howitworks.step1.title': 'Sign Up & Choose Path',
    'howitworks.step1.desc':
      'Join as a learner or recruiter. Pick your skill focus area and start your journey.',
    'howitworks.step2.title': 'Complete Challenges',
    'howitworks.step2.desc':
      'Tackle real-world DX problems. Earn points, badges, and climb the leaderboard.',
    'howitworks.step3.title': 'Get Recognized',
    'howitworks.step3.desc':
      'Top performers get noticed by recruiters. Showcase verified skills, not just claims.',

    // Pricing Section
    'pricing.badge': '💰 Transparent Pricing',
    'pricing.title': 'Choose Your Plan',
    'pricing.subtitle':
      'Start for free as a learner, upgrade for pro features, or hire top talent as a recruiter',
    'pricing.processing': 'Processing...',
    'pricing.addon': 'Add-on: +{count} generations for ${price}',
    // Learner feature lines
    'pricing.learner.feature1': 'Access to 50+ Pre-built Lessons',
    'pricing.learner.feature2': 'Basic Leaderboard Access',
    'pricing.learner.feature3': 'Earn Digital Badges',
    'pricing.learner.feature4': '1 AI Lesson Generation per month',
    'pricing.learner.feature5': 'Basic Progress Tracking',
    'pricing.learner.feature6': 'Free 1 Test Generation per month',
    'pricing.popular': 'Most Popular',
    'pricing.learner.title': 'Learner',
    'pricing.learner.subtitle': 'Start your learning journey',
    'pricing.learner.price': '$0',
    'pricing.learner.period': '/month',
    'pricing.learner.note': 'FREE FOREVER',
    'pricing.learner.cta': 'Start Free',
    // Pro features
    'pricing.pro.feature1': 'Everything in Learner',
    'pricing.pro.feature2': '5 AI Lesson Generations per month',
    'pricing.pro.feature3': 'Multiple Test Generations',
    'pricing.pro.feature4': 'Priority Support',
    'pricing.pro.title': 'Pro Learner',
    'pricing.pro.subtitle': 'Unlock advanced learning features',
    'pricing.pro.price': '$20',
    'pricing.pro.period': '/month',
    'pricing.pro.addon': '💡 Add-on: +3 generations for $10',
    'pricing.pro.cta': 'Upgrade to Pro',
    'pricing.recruiter.title': 'Recruiter',
    'pricing.recruiter.subtitle': 'Find and hire top talent',
    'pricing.recruiter.price': '$50',
    'pricing.recruiter.period': '/month',
    'pricing.recruiter.cta': 'Start Hiring',
    // Recruiter features
    'pricing.recruiter.feature1': 'Full Talent Database Access',
    'pricing.recruiter.feature2': 'Advanced Candidate Filtering',
    'pricing.recruiter.feature3': 'Direct Candidate Contact',
    'pricing.recruiter.feature4': 'Performance Analytics',
    'pricing.recruiter.feature5': 'Skill Assessment Tools',
    'pricing.recruiter.feature6': 'Unlimited Searches',
    'pricing.recruiter.feature7': 'Priority Candidate Recommendations',

    // Pricing toasts
    'pricing.toast.already_free.title': 'Already on Free Plan',
    'pricing.toast.already_free.desc':
      'You are already on the free Learner plan!',
    'pricing.toast.already_subscribed.title': 'Already Subscribed',
    'pricing.toast.already_subscribed.desc':
      'You are already on the {plan} plan!',
    'pricing.toast.checkout_failed.title': 'Checkout Failed',
    'pricing.toast.checkout_failed.desc': 'Please try again later.',

    // CTA Section
    'cta.title': 'Ready to Level Up?',
    'cta.subtitle':
      'Join thousands of learners mastering DX skills and getting discovered by top companies',
    'cta.button': '🚀 Get Started Free',
    'cta.demo': 'Demo',

    // Support Section
    'support.badge': '🎯',
    'support.title': "Need Help? We're Here! 🚚",
    'support.subtitle':
      'Got questions or running into issues? Submit a support ticket and our team will get back to you ASAP!',
    'support.form.title': '📮 Submit a Support Ticket',
    'support.form.subtitle':
      'Fill out the form below as it is required as possible',
    'support.form.name': 'Name',
    'support.form.email': 'Email',
    'support.form.subject': 'Subject',
    'support.form.message': 'Message',
    'support.form.submit': '📨 Send Support Ticket',
    // Placeholders
    'support.form.placeholder.name': 'Your name',
    'support.form.placeholder.email': 'your.email@example.com',
    'support.form.placeholder.subject': 'Brief description of your issue',
    'support.form.placeholder.message':
      'Please provide details about your issue...',
    // Toast messages
    'support.toast.opened_title': '📧 Gmail opened!',
    'support.toast.opened_description':
      'Gmail compose window opened in a new tab. Please send the email to complete your request.',
    'support.toast.error_title': 'Error',
    'support.toast.error_description':
      'Failed to open Gmail. Please email us directly at buemethyl68@gmail.com',
    // mail subject prefix
    'support.email.subject_prefix': 'Support Ticket:',
    // Button state
    'support.form.sending': 'Opening Email Client...',
    'support.email.title': '📧 Direct Email Support',
    'support.email.subtitle':
      'Prefer to email us directly? Send your questions or issues to:',
    'support.email.response':
      'We typically respond within 24-48 hours during business days.',
    'support.tips.title': '📋 Before You Submit',
    'support.tips.check':
      'Check if your question is already answered in our FAQ',
    'support.tips.details':
      'Include relevant details like your username and any error messages',
    'support.tips.helpful':
      'Screenshots can be very helpful for technical issues',
    'support.tips.specific': 'Be as specific as possible about your issue',

    // Navigation
    'nav.pricing': '💰 View Pricing',
    'nav.dashboard': 'Dashboard',
    'nav.users': 'Users',
    'nav.payments': 'Payments',
    'nav.profile': 'Profile',
    'nav.lessons': 'Lessons',
    'nav.leaderboard': 'Leaderboard',
    'nav.subscription': 'Subscription',
    'nav.logout': 'Logout',
    'nav.login': 'Login / Sign Up',

    // Stats labels
    'stats.lvl': 'Lvl',
    'stats.xp': 'XP',
    'stats.streak': 'Streak',
    'stats.total_xp': 'Total XP',
    'stats.league': 'League',
    'stats.day_streak': 'Day Streak',
    'stats.badges': 'Badges',

    // Auth (Login / Register)
    'auth.back_home': 'Back to Home',
    'auth.welcome_back': 'Welcome Back!',
    'auth.join_fun': 'Join the Fun!',
    'auth.login_desc': 'Login to continue your journey',
    'auth.signup_desc': 'Create your account and start learning',
    'auth.username': 'Username',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.placeholder.username': 'johndoe',
    'auth.placeholder.email': 'you@example.com',
    'auth.placeholder.password': '••••••••',
    'auth.placeholder.confirm_password': '••••••••',
    'auth.info_signup':
      "💡 You'll start as a <strong>Learner</strong>. Upgrade to Pro or become a Recruiter through our pricing plans after signing up!",
    'auth.processing': 'Processing...',
    'auth.login_btn': 'Login',
    'auth.signup_btn': 'Sign Up',
    'auth.or': 'or',
    'auth.continue_with_google': 'Continue with Google',
    'auth.toggle_to_signup': "Don't have an account? Sign up",
    'auth.toggle_to_login': 'Already have an account? Login',
    // Auth validation messages
    'auth.error.username_required': 'Username is required',
    'auth.error.email_required': 'Email is required',
    'auth.error.email_invalid': 'Email is invalid',
    'auth.error.password_required': 'Password is required',
    'auth.error.password_min': 'Password must be at least 6 characters',
    'auth.error.passwords_mismatch': 'Passwords do not match',

    // Footer
    'footer.about':
      'Master DX skills, earn badges, and get discovered by top tech companies.',
    'footer.quicklinks': 'Quick Links',
    'footer.home': 'Home',
    'footer.lessons': 'Lessons',
    'footer.leaderboard': 'Leaderboard',
    'footer.signup': 'Sign Up',
    'footer.support': 'Support',
    'footer.contactsupport': 'Contact Support',
    'footer.connect': 'Connect',
    'footer.rights': 'All rights reserved.',
    'footer.inquiries': 'For support inquiries:',
  },
  jp: {
    // Hero Section
    'hero.badge': '🚀 DXスキルをレベルアップ',
    'hero.title': 'ゲーム化された学習を通して',
    // For Japanese we also split into before/highlight so the highlight styling works
    // Japanese ordering can differ; by default keep the whole phrase as the highlight
    'hero.subtitle_before': 'デジタ',
    'hero.subtitle_highlight': 'ルスキルを習得',
    'hero.description':
      'ゲーミフィケーションされたeラーニングプラットフォームを通じてDX関連スキルを教育・評価し、意欲的な人材を発見します。採用担当者はトップパフォーマーを発見し、学習者は評価を獲得します。',
    'hero.dashboard': '🏆 ダッシュボードへ',
    'hero.challenges': '50以上のゲーム化されたチャレンジ',
    'hero.learners': '10,000人以上のアクティブな学習者',
    'hero.partners': '200社以上の採用パートナー',

    // Button texts
    'hero.start_learning': '学習を開始',
    'hero.for_recruiters': '採用担当者向け',
    'hero.go_to_dashboard': 'ダッシュボードへ',

    // Features Section
    'features.badge': '💡 選ばれる理由',
    'features.title': '実際に効果のある',
    'features.work': '学習',
    'features.skill.title': 'スキルチャレンジ',
    'features.skill.desc':
      '実践的なDXチャレンジを完了してポイントを獲得。重要な実世界のシナリオ。',
    'features.leaderboard.title': 'リーダーボード',
    'features.leaderboard.desc':
      '仲間と競い合い、スキルを披露。トップパフォーマーは採用担当者に注目されます。',
    'features.talent.title': 'タレント発見',
    'features.talent.desc':
      '採用担当者は、履歴書だけでなく、実証されたスキルを持つ意欲的な学習者を発見します。',
    'features.assessment.title': '実践的評価',
    'features.assessment.desc':
      '理論ではなく、実際のDX能力をテストする実践的な評価。',
    'features.feedback.title': '即座のフィードバック',
    'features.feedback.desc':
      'パフォーマンスと改善すべき領域についての即座の洞察を得る。',
    'features.badges.title': 'バッジ獲得',
    'features.badges.desc': '専門知識を証明する実績と認定をアンロック。',

    // How It Works Section
    'howitworks.badge': '📝 シンプルなプロセス',
    'howitworks.title': '使い方',
    'howitworks.subtitle':
      'DXスキルを習得し、発見されるための3つの簡単なステップ',
    'howitworks.step1.title': 'サインアップ＆パス選択',
    'howitworks.step1.desc':
      '学習者または採用担当者として参加。スキルフォーカスエリアを選択し、旅を始めましょう。',
    'howitworks.step2.title': 'チャレンジを完了',
    'howitworks.step2.desc':
      '実世界のDX問題に取り組む。ポイント、バッジを獲得し、リーダーボードを登る。',
    'howitworks.step3.title': '評価を得る',
    'howitworks.step3.desc':
      'トップパフォーマーは採用担当者に注目されます。主張だけでなく、検証されたスキルを披露。',

    // Pricing Section
    'pricing.badge': '💰 透明な価格設定',
    'pricing.title': 'プランを選択',
    'pricing.subtitle':
      '学習者として無料で開始し、プロ機能にアップグレードするか、リクルーターとして優秀な人材を採用しましょう',
    'pricing.popular': '最も人気',
    'pricing.learner.title': '学習者',
    'pricing.learner.subtitle': '学習の旅を始める',
    'pricing.learner.price': '$0',
    'pricing.learner.period': '/月',
    'pricing.learner.note': '永久無料',
    'pricing.learner.cta': '無料で始める',
    'pricing.pro.title': 'プロ学習者',
    'pricing.pro.subtitle': '高度な学習機能をアンロック',
    'pricing.pro.price': '$20',
    'pricing.pro.period': '/月',
    'pricing.pro.addon': '💡 アドオン: $10で+3世代',
    'pricing.pro.cta': 'プロにアップグレード',
    'pricing.recruiter.title': '採用担当者',
    'pricing.recruiter.subtitle': 'トップタレントを見つけて採用',
    'pricing.recruiter.price': '$50',
    'pricing.recruiter.period': '/月',
    'pricing.recruiter.cta': '採用を開始',
    'pricing.processing': '処理中...',
    'pricing.addon': 'アドオン: +{count} 世代を ${price} で',
    // Learner feature lines
    'pricing.learner.feature1': '50以上の事前構築済みレッスンにアクセス',
    'pricing.learner.feature2': '基本的なリーダーボードアクセス',
    'pricing.learner.feature3': 'デジタルバッジを獲得',
    'pricing.learner.feature4': '月 1 回のAIレッスン生成',
    'pricing.learner.feature5': '基本的な進捗トラッキング',
    'pricing.learner.feature6': '月1回無料のテスト生成',
    // Pro features
    'pricing.pro.feature1': '学習者向けのすべての機能',
    'pricing.pro.feature2': '月5回のAIレッスン生成',
    'pricing.pro.feature3': '複数のテスト生成',
    'pricing.pro.feature4': '優先サポート',
    // Recruiter features
    'pricing.recruiter.feature1': 'フルタレントデータベースへのアクセス',
    'pricing.recruiter.feature2': '高度な候補者フィルタリング',
    'pricing.recruiter.feature3': '候補者への直接連絡',
    'pricing.recruiter.feature4': 'パフォーマンス分析',
    'pricing.recruiter.feature5': 'スキル評価ツール',
    'pricing.recruiter.feature6': '無制限の検索',
    'pricing.recruiter.feature7': '優先候補者の推薦',

    // Pricing toasts
    'pricing.toast.already_free.title': '無料プランですでにご利用中',
    'pricing.toast.already_free.desc':
      '現在、学習者向けの無料プランをご利用中です！',
    'pricing.toast.already_subscribed.title': 'すでにサブスクライブ済み',
    'pricing.toast.already_subscribed.desc':
      '{plan} プランをすでにご利用中です！',
    'pricing.toast.checkout_failed.title': 'チェックアウトに失敗しました',
    'pricing.toast.checkout_failed.desc': '後でもう一度お試しください。',

    // CTA Section
    'cta.title': 'レベルアップの準備はできましたか？',
    'cta.subtitle':
      'DXスキルを習得し、トップ企業に発見される数千人の学習者に参加',
    'cta.button': '🚀 無料で始める',
    'cta.demo': 'デモ',

    // Support Section
    'support.badge': '🎯',
    'support.title': 'お困りですか？お手伝いします！🚚',
    'support.subtitle':
      '質問や問題がありますか？サポートチケットを送信してください。チームができるだけ早く返信します！',
    'support.form.title': '📮 サポートチケットを送信',
    'support.form.subtitle': '以下のフォームにできるだけ詳しく記入してください',
    'support.form.name': '名前',
    'support.form.email': 'メール',
    'support.form.subject': '件名',
    'support.form.message': 'メッセージ',
    'support.form.submit': '📨 サポートチケットを送信',
    // Placeholders
    'support.form.placeholder.name': 'あなたの名前',
    'support.form.placeholder.email': 'your.email@example.com',
    'support.form.placeholder.subject': '問題の簡単な説明',
    'support.form.placeholder.message':
      '問題の詳細をできるだけ詳しくご記入ください...',
    // Toast messages
    'support.toast.opened_title': '📧 Gmailを開きました！',
    'support.toast.opened_description':
      'Gmailの作成ウィンドウを新しいタブで開きました。リクエストを完了するにはメールを送信してください。',
    'support.toast.error_title': 'エラー',
    'support.toast.error_description':
      'Gmailを開けませんでした。直接 buemethyl68@gmail.com にメールを送信してください',
    // mail subject prefix
    'support.email.subject_prefix': 'サポートチケット：',
    // Button state
    'support.form.sending': 'メールクライアントを開いています...',
    'support.email.title': '📧 直接メールサポート',
    'support.email.subtitle':
      '直接メールでお問い合わせをご希望ですか？質問や問題を以下に送信してください：',
    'support.email.response': '通常、営業日の24〜48時間以内に返信します。',
    'support.tips.title': '📋 送信前に',
    'support.tips.check': 'FAQで質問がすでに回答されているか確認してください',
    'support.tips.details':
      'ユーザー名やエラーメッセージなどの関連する詳細を含めてください',
    'support.tips.helpful':
      'スクリーンショットは技術的な問題に非常に役立ちます',
    'support.tips.specific': '問題についてできるだけ具体的に説明してください',

    // Navigation
    'nav.pricing': '💰 価格を見る',
    'nav.dashboard': 'ダッシュボード',
    'nav.users': 'ユーザー',
    'nav.payments': '支払い',
    'nav.profile': 'プロフィール',
    'nav.lessons': 'レッスン',
    'nav.leaderboard': 'リーダーボード',
    'nav.subscription': 'サブスクリプション',
    'nav.logout': 'ログアウト',
    'nav.login': 'ログイン / サインアップ',

    // Stats labels
    'stats.lvl': 'レベル',
    'stats.xp': 'XP',
    'stats.streak': '連続',
    'stats.total_xp': '総XP',
    'stats.league': 'リーグ',
    'stats.day_streak': '日連続',
    'stats.badges': 'バッジ',


    // Auth (Login / Register)
    'auth.back_home': 'ホームへ戻る',
    'auth.welcome_back': 'お帰りなさい！',
    'auth.join_fun': 'さあ、始めよう！',
    'auth.login_desc': '続けるにはログインしてください',
    'auth.signup_desc': 'アカウントを作成して学習を始めましょう',
    'auth.username': 'ユーザー名',
    'auth.email': 'メールアドレス',
    'auth.password': 'パスワード',
    'auth.confirm_password': 'パスワードの確認',
    'auth.placeholder.username': 'johndoe',
    'auth.placeholder.email': 'you@example.com',
    'auth.placeholder.password': '••••••••',
    'auth.placeholder.confirm_password': '••••••••',
    'auth.info_signup':
      '💡 登録すると最初は学習者として開始します。後で料金プランからプロにアップグレードしたり、採用担当者になることができます。',
    'auth.processing': '処理中...',
    'auth.login_btn': 'ログイン',
    'auth.signup_btn': 'サインアップ',
    'auth.or': 'または',
    'auth.continue_with_google': 'Googleで続行',
    'auth.toggle_to_signup': 'アカウントをお持ちでないですか？ サインアップ',
    'auth.toggle_to_login': 'すでにアカウントをお持ちですか？ ログイン',
    // Auth validation messages
    'auth.error.username_required': 'ユーザー名は必須です',
    'auth.error.email_required': 'メールアドレスは必須です',
    'auth.error.email_invalid': '無効なメールアドレスです',
    'auth.error.password_required': 'パスワードは必須です',
    'auth.error.password_min': 'パスワードは6文字以上である必要があります',
    'auth.error.passwords_mismatch': 'パスワードが一致しません',

    // Footer
    'footer.about':
      'DXスキルを習得し、バッジを獲得し、トップテクノロジー企業に発見されます。',
    'footer.quicklinks': 'クイックリンク',
    'footer.home': 'ホーム',
    'footer.lessons': 'レッスン',
    'footer.leaderboard': 'リーダーボード',
    'footer.signup': 'サインアップ',
    'footer.support': 'サポート',
    'footer.contactsupport': 'サポートに連絡',
    'footer.connect': '接続',
    'footer.rights': '全著作権所有。',
    'footer.inquiries': 'サポートのお問い合わせ：',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Load language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return stored === 'en' || stored === 'jp' ? stored : 'en';
  });

  // Persist language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, vars?: Record<string, string | number>): string => {
    const entry = translations[language][key] || key;
    if (!vars) return entry;

    // simple interpolation for {name} and ${name} placeholders
    return Object.keys(vars).reduce((str, k) => {
      const v = String(vars[k]);
      return str
        .replace(new RegExp(`\\{${k}\\}`, 'g'), v)
        .replace(new RegExp(`\\$\\{${k}\\}`, 'g'), v);
    }, entry);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
