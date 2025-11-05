import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'jp';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations = {
  en: {
    // Hero Section
    'hero.badge': '🚀 Level Up Your DX Skills',
    'hero.title': 'Master Digital Skills',
    'hero.subtitle': 'Through Gamified Learning',
    'hero.description':
      'Discover motivated talent by teaching and evaluating DX-related skills through our gamified e-learning platform. Recruiters discover top performers. Learners earn recognition.',
    'hero.dashboard': '🏆 Go to Dashboard',
    'hero.challenges': '50+ Gamified Challenges',
    'hero.learners': '10K+ Active Learners',
    'hero.partners': '200+ Recruiting Partners',

    // Features Section
    'features.badge': '💡 Why Choose Us',
    'features.title': 'Learning That Actually Works',
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
    'pricing.popular': 'Most Popular',
    'pricing.learner.title': 'Learner',
    'pricing.learner.subtitle': 'Start your learning journey',
    'pricing.learner.price': '$0',
    'pricing.learner.period': '/month',
    'pricing.learner.note': 'FREE FOREVER',
    'pricing.learner.cta': 'Start Free',
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
    'nav.logout': 'Logout',
    'nav.login': 'Login / Sign Up',

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
    'hero.title': 'デジタルスキルを習得',
    'hero.subtitle': 'ゲーミフィケーション学習を通じて',
    'hero.description':
      'ゲーミフィケーションされたeラーニングプラットフォームを通じてDX関連スキルを教育・評価し、意欲的な人材を発見します。採用担当者はトップパフォーマーを発見し、学習者は評価を獲得します。',
    'hero.dashboard': '🏆 ダッシュボードへ',
    'hero.challenges': '50以上のゲーム化されたチャレンジ',
    'hero.learners': '10,000人以上のアクティブな学習者',
    'hero.partners': '200社以上の採用パートナー',

    // Features Section
    'features.badge': '💡 選ばれる理由',
    'features.title': '実際に機能する学習',
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
      '学習者として無料で始め、プロ機能にアップグレード、または採用担当者としてトップタレントを採用',
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
    'nav.logout': 'ログアウト',
    'nav.login': 'ログイン / サインアップ',

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
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
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
