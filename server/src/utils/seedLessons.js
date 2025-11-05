/**
 * Seed default lessons for new users or empty database
 * These lessons include pre-defined questions to avoid AI generation and API limits
 */

export const defaultLessons = [
  // MARKETING LESSONS (10 lessons)
  {
    topic: 'Digital Marketing Fundamentals',
    skillName: 'Introduction to Digital Marketing',
    skillIcon: '📱',
    category: 'Marketing',
    difficulty: 'Beginner',
    description:
      'Learn the basics of digital marketing, including key concepts, channels, and strategies to reach your target audience online.',
    duration: '10 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is digital marketing?',
        options: [
          'Marketing only through email',
          'Marketing using digital channels like social media, search engines, and websites',
          'Marketing physical products online',
          'Marketing exclusively on television',
        ],
        correctAnswer: 1,
        explanation:
          'Digital marketing encompasses all marketing efforts that use digital channels to reach and engage customers.',
        xpReward: 15,
      },
      {
        question: 'Which of the following is NOT a digital marketing channel?',
        options: [
          'Social media advertising',
          'Search engine optimization',
          'Billboard advertising',
          'Email marketing',
        ],
        correctAnswer: 2,
        explanation:
          'Billboard advertising is a traditional marketing channel, while the others are digital marketing methods.',
        xpReward: 15,
      },
      {
        question: 'What does SEO stand for?',
        options: [
          'Social Engagement Optimization',
          'Search Engine Optimization',
          'Sales Enhancement Operations',
          'Strategic Email Outreach',
        ],
        correctAnswer: 1,
        explanation:
          'SEO stands for Search Engine Optimization, which is the practice of improving website visibility in search engine results.',
        xpReward: 15,
      },
      {
        question:
          'Which platform is primarily used for professional networking in digital marketing?',
        options: ['Instagram', 'LinkedIn', 'TikTok', 'Snapchat'],
        correctAnswer: 1,
        explanation:
          'LinkedIn is the primary platform for professional networking and B2B marketing.',
        xpReward: 15,
      },
      {
        question: 'What is the main goal of content marketing?',
        options: [
          'Sell products directly',
          'Attract and retain customers by creating valuable content',
          'Run paid advertisements',
          'Send promotional emails',
        ],
        correctAnswer: 1,
        explanation:
          'Content marketing focuses on creating valuable content to attract and engage an audience over time.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Digital Marketing Fundamentals',
    skillName: 'Social Media Marketing Basics',
    skillIcon: '👥',
    category: 'Marketing',
    difficulty: 'Beginner',
    description:
      'Understand how to leverage social media platforms to build brand awareness and engage with your audience.',
    duration: '12 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is the primary goal of social media marketing?',
        options: [
          'Sell products directly',
          'Build brand awareness and engage with audience',
          'Run TV commercials',
          'Print advertisements',
        ],
        correctAnswer: 1,
        explanation:
          'Social media marketing focuses on building relationships and brand awareness through engagement.',
        xpReward: 15,
      },
      {
        question:
          'Which social media platform is best for visual content and younger audiences?',
        options: ['LinkedIn', 'Instagram', 'TikTok', 'Snapchat'],
        correctAnswer: 1,
        explanation:
          'Instagram is optimized for visual content and appeals to younger demographics.',
        xpReward: 15,
      },
      {
        question: 'What does CTR stand for in social media marketing?',
        options: [
          'Cost To Reach',
          'Click Through Rate',
          'Content Type Ratio',
          'Customer Touch Response',
        ],
        correctAnswer: 1,
        explanation:
          'CTR measures the percentage of people who click on your social media posts or ads.',
        xpReward: 15,
      },
      {
        question: 'What is a social media hashtag primarily used for?',
        options: [
          'Making text bold',
          'Categorizing content and increasing discoverability',
          'Creating usernames',
          'Sending private messages',
        ],
        correctAnswer: 1,
        explanation:
          'Hashtags help categorize content and make posts discoverable to users searching for specific topics.',
        xpReward: 15,
      },
      {
        question:
          'Which metric measures how many people see your social media content?',
        options: [
          'Engagement rate',
          'Click-through rate',
          'Reach/Impressions',
          'Conversion rate',
        ],
        correctAnswer: 2,
        explanation:
          'Reach measures how many unique users see your content, while impressions count total views.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Digital Marketing Fundamentals',
    skillName: 'Email Marketing Essentials',
    skillIcon: '📧',
    category: 'Marketing',
    difficulty: 'Beginner',
    description:
      'Master the fundamentals of email marketing campaigns, from list building to crafting effective messages.',
    duration: '15 min',
    totalXP: 75,
    questions: [
      {
        question:
          'What is the most important factor for successful email marketing?',
        options: [
          'Fancy graphics',
          'Building a quality email list with permission',
          'Sending emails frequently',
          'Using multiple email providers',
        ],
        correctAnswer: 1,
        explanation:
          'Permission-based email lists ensure your emails reach interested subscribers and comply with regulations.',
        xpReward: 15,
      },
      {
        question: 'What does CAN-SPAM stand for?',
        options: [
          'Canadian Spam Prevention',
          'Controlling the Assault of Non-Solicited Pornography And Marketing',
          'Campaign Against Spam Marketing',
          'None of the above',
        ],
        correctAnswer: 1,
        explanation:
          'CAN-SPAM is the US law that regulates commercial email and sets requirements for commercial messages.',
        xpReward: 15,
      },
      {
        question: 'What is the ideal subject line length for email marketing?',
        options: [
          'Over 100 characters',
          '30-50 characters',
          'Under 10 characters',
          'Exactly 25 characters',
        ],
        correctAnswer: 1,
        explanation:
          'Subject lines of 30-50 characters typically have the highest open rates.',
        xpReward: 15,
      },
      {
        question: 'What is A/B testing in email marketing?',
        options: [
          'Testing two different email versions to see which performs better',
          'Sending emails to A and B groups separately',
          'Testing email delivery speed',
          'Checking email formatting',
        ],
        correctAnswer: 0,
        explanation:
          'A/B testing compares two versions of an email to determine which elements perform better.',
        xpReward: 15,
      },
      {
        question: 'What is the typical industry average for email open rates?',
        options: ['5-10%', '15-25%', '50-70%', '80-95%'],
        correctAnswer: 1,
        explanation:
          'Average email open rates typically range from 15-25% depending on industry and audience.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Digital Marketing Fundamentals',
    skillName: 'Content Marketing Strategy',
    skillIcon: '📝',
    category: 'Marketing',
    difficulty: 'Beginner',
    description:
      'Create compelling content that attracts and retains customers through strategic planning and execution.',
    duration: '15 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is the main purpose of content marketing?',
        options: [
          'Direct product sales',
          'Building trust and authority through valuable content',
          'Running advertisements',
          'Cold outreach',
        ],
        correctAnswer: 1,
        explanation:
          'Content marketing focuses on providing value to build long-term customer relationships.',
        xpReward: 15,
      },
      {
        question: 'Which of these is NOT a content marketing tactic?',
        options: ['Blog posts', 'Whitepapers', 'Cold calling', 'Infographics'],
        correctAnswer: 2,
        explanation:
          'Cold calling is a sales tactic, not content marketing. Content marketing provides value without direct selling.',
        xpReward: 15,
      },
      {
        question: 'What does SEO stand for in content marketing?',
        options: [
          'Social Engagement Optimization',
          'Search Engine Optimization',
          'Sales Enhancement Operations',
          'Strategic Email Outreach',
        ],
        correctAnswer: 1,
        explanation:
          'SEO helps content rank higher in search results, increasing visibility and traffic.',
        xpReward: 15,
      },
      {
        question: 'What is a content marketing funnel?',
        options: [
          'A physical funnel for storing content',
          'A strategic framework showing customer journey from awareness to conversion',
          'A tool for creating content',
          'A type of content format',
        ],
        correctAnswer: 1,
        explanation:
          'The content marketing funnel guides prospects through awareness, consideration, and decision stages.',
        xpReward: 15,
      },
      {
        question: 'Why is consistency important in content marketing?',
        options: [
          'It reduces costs',
          'It builds audience trust and keeps them engaged over time',
          'It makes content creation easier',
          'It improves SEO rankings',
        ],
        correctAnswer: 1,
        explanation:
          'Consistent content publishing builds audience trust and keeps your brand top-of-mind.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Digital Marketing Fundamentals',
    skillName: 'SEO Fundamentals',
    skillIcon: '🔍',
    category: 'Marketing',
    difficulty: 'Intermediate',
    description:
      "Learn search engine optimization techniques to improve your website's visibility in search results.",
    duration: '20 min',
    totalXP: 100,
    questions: [
      {
        question: 'What are the two main types of SEO?',
        options: [
          'On-page and off-page SEO',
          'Technical and content SEO',
          'Local and global SEO',
          'Mobile and desktop SEO',
        ],
        correctAnswer: 0,
        explanation:
          'On-page SEO focuses on content and HTML elements, while off-page SEO involves external factors like backlinks.',
        xpReward: 20,
      },
      {
        question: 'What does the term "keyword research" refer to in SEO?',
        options: [
          'Finding words to use in website URLs',
          'Identifying terms people search for to optimize content around them',
          'Researching competitor keywords',
          'Finding keywords in programming code',
        ],
        correctAnswer: 1,
        explanation:
          'Keyword research helps identify what terms your target audience uses when searching for your products or services.',
        xpReward: 20,
      },
      {
        question: 'What is a backlink in SEO?',
        options: [
          'A link from your website to another site',
          'A link from another website to your site',
          'A link within your own website',
          'A broken link on your site',
        ],
        correctAnswer: 1,
        explanation:
          'Backlinks are incoming links from other websites to yours, which search engines use as a ranking signal.',
        xpReward: 20,
      },
      {
        question: 'What is the purpose of meta descriptions in SEO?',
        options: [
          'To describe the website owner',
          'To provide a summary that appears in search results',
          'To list website keywords',
          'To show website creation date',
        ],
        correctAnswer: 1,
        explanation:
          'Meta descriptions appear under the title in search results and can influence click-through rates.',
        xpReward: 20,
      },
      {
        question: 'What does "mobile-first indexing" mean?',
        options: [
          'Websites are indexed primarily on mobile devices',
          'Google uses the mobile version of content for indexing and ranking',
          'Mobile sites get priority in search results',
          'Only mobile-friendly sites are indexed',
        ],
        correctAnswer: 1,
        explanation:
          'Google predominantly uses the mobile version of a site for indexing and ranking, even for desktop searches.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Digital Marketing Fundamentals',
    skillName: 'Pay-Per-Click Advertising',
    skillIcon: '💰',
    category: 'Marketing',
    difficulty: 'Intermediate',
    description:
      'Master PPC campaigns on Google Ads and social platforms to drive targeted traffic to your business.',
    duration: '22 min',
    totalXP: 100,
    questions: [
      {
        question: 'What does PPC stand for in digital advertising?',
        options: [
          'Pay Per Click',
          'Pay Per Customer',
          'Pay Per Conversion',
          'Pay Per Campaign',
        ],
        correctAnswer: 0,
        explanation:
          'PPC means Pay Per Click, where advertisers pay each time someone clicks on their ad.',
        xpReward: 20,
      },
      {
        question: 'What is the main advantage of PPC advertising?',
        options: [
          "It's completely free",
          'It provides immediate visibility and traffic',
          'It lasts forever without maintenance',
          "It doesn't require targeting",
        ],
        correctAnswer: 1,
        explanation:
          'PPC provides instant visibility and targeted traffic, unlike organic methods that take time to build.',
        xpReward: 20,
      },
      {
        question: 'What is a PPC quality score?',
        options: [
          'The amount you pay per click',
          "Google's rating of your ad relevance and landing page quality",
          'The position of your ad in search results',
          'The number of clicks your ad receives',
        ],
        correctAnswer: 1,
        explanation:
          'Quality Score affects your ad position and cost-per-click, based on ad relevance, click-through rate, and landing page quality.',
        xpReward: 20,
      },
      {
        question: 'What is remarketing in PPC?',
        options: [
          'Marketing to new customers',
          'Showing ads to people who have previously visited your site',
          'Marketing on social media only',
          'Email marketing campaigns',
        ],
        correctAnswer: 1,
        explanation:
          'Remarketing shows ads to users who have previously interacted with your website or app.',
        xpReward: 20,
      },
      {
        question: 'What is A/B testing in PPC campaigns?',
        options: [
          'Testing two different ad creatives to see which performs better',
          'Splitting your budget between Google and Facebook',
          'Testing different bidding strategies',
          'Comparing PPC to organic traffic',
        ],
        correctAnswer: 0,
        explanation:
          'A/B testing compares different versions of ads, landing pages, or targeting to optimize performance.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Digital Marketing Fundamentals',
    skillName: 'Analytics and Data Tracking',
    skillIcon: '📊',
    category: 'Marketing',
    difficulty: 'Intermediate',
    description:
      'Use analytics tools to measure campaign performance and make data-driven marketing decisions.',
    duration: '25 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is Google Analytics primarily used for?',
        options: [
          'Creating advertisements',
          'Tracking website traffic and user behavior',
          'Managing social media accounts',
          'Sending email campaigns',
        ],
        correctAnswer: 1,
        explanation:
          'Google Analytics tracks and reports website traffic, helping marketers understand user behavior and campaign performance.',
        xpReward: 20,
      },
      {
        question: 'What does the term "bounce rate" measure?',
        options: [
          'How many visitors convert to customers',
          'The percentage of visitors who leave after viewing only one page',
          'The number of pages viewed per session',
          'How long visitors stay on the site',
        ],
        correctAnswer: 1,
        explanation:
          "Bounce rate shows the percentage of single-page sessions, indicating if visitors find what they're looking for.",
        xpReward: 20,
      },
      {
        question: 'What is a conversion in web analytics?',
        options: [
          'A visitor leaving the site',
          'A visitor completing a desired action like making a purchase',
          'A visitor clicking an ad',
          'A visitor viewing multiple pages',
        ],
        correctAnswer: 1,
        explanation:
          'A conversion is when a visitor completes a goal, such as making a purchase, signing up, or filling out a form.',
        xpReward: 20,
      },
      {
        question: 'What does ROI stand for in marketing analytics?',
        options: [
          'Return On Investment',
          'Rate Of Interaction',
          'Revenue Over Income',
          'Reach Of Influence',
        ],
        correctAnswer: 0,
        explanation:
          'ROI measures the profitability of marketing campaigns by comparing revenue generated to costs incurred.',
        xpReward: 20,
      },
      {
        question: 'What is attribution modeling in analytics?',
        options: [
          'Assigning credit to marketing channels that led to conversions',
          'Creating user profiles',
          'Tracking website speed',
          'Measuring social media engagement',
        ],
        correctAnswer: 0,
        explanation:
          'Attribution modeling determines how credit for conversions is assigned across different marketing touchpoints.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Digital Marketing Fundamentals',
    skillName: 'Advanced Marketing Automation',
    skillIcon: '🤖',
    category: 'Marketing',
    difficulty: 'Advanced',
    description:
      'Implement sophisticated marketing automation workflows to nurture leads and increase conversions.',
    duration: '28 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is marketing automation?',
        options: [
          'Automated social media posting',
          'Using software to automate marketing processes and workflows',
          'Automated email sending only',
          'Creating automated advertisements',
        ],
        correctAnswer: 1,
        explanation:
          'Marketing automation uses software to automate repetitive marketing tasks and create personalized customer journeys.',
        xpReward: 25,
      },
      {
        question: 'What is a lead scoring system?',
        options: [
          'Ranking leads by their purchase potential',
          'Counting the number of leads',
          'Scoring marketing campaign performance',
          'Rating content quality',
        ],
        correctAnswer: 0,
        explanation:
          'Lead scoring assigns points to prospects based on their behavior and profile to identify sales-ready leads.',
        xpReward: 25,
      },
      {
        question: 'What is a marketing funnel?',
        options: [
          'A physical funnel for storing leads',
          'A model describing the customer journey from awareness to purchase',
          'A tool for filtering marketing data',
          'A type of email campaign',
        ],
        correctAnswer: 1,
        explanation:
          'A marketing funnel represents the stages customers go through: awareness, interest, consideration, purchase, and retention.',
        xpReward: 25,
      },
      {
        question: 'What is lead nurturing?',
        options: [
          'Finding new leads',
          'Building relationships with potential customers over time',
          'Converting leads to customers immediately',
          'Deleting old leads',
        ],
        correctAnswer: 1,
        explanation:
          'Lead nurturing involves sending targeted content to move prospects through the sales funnel at their own pace.',
        xpReward: 25,
      },
      {
        question: 'What is a drip campaign?',
        options: [
          'A campaign that loses momentum',
          'A series of automated emails sent over time',
          'A one-time email blast',
          'A social media advertising campaign',
        ],
        correctAnswer: 1,
        explanation:
          'Drip campaigns send a sequence of emails automatically based on triggers or time intervals.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Digital Marketing Fundamentals',
    skillName: 'Conversion Rate Optimization',
    skillIcon: '🎯',
    category: 'Marketing',
    difficulty: 'Advanced',
    description:
      'Master CRO techniques to optimize landing pages and increase conversion rates through A/B testing.',
    duration: '30 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is conversion rate optimization (CRO)?',
        options: [
          'Optimizing website speed',
          'Improving the percentage of visitors who complete desired actions',
          'Increasing website traffic',
          'Reducing bounce rate',
        ],
        correctAnswer: 1,
        explanation:
          'CRO focuses on improving the percentage of website visitors who complete goals like purchases or sign-ups.',
        xpReward: 25,
      },
      {
        question: 'What is A/B testing in CRO?',
        options: [
          'Testing two different websites',
          'Comparing two versions of a page to see which performs better',
          'Testing website loading speed',
          'Comparing traffic sources',
        ],
        correctAnswer: 1,
        explanation:
          'A/B testing compares two versions of a webpage or element to determine which drives more conversions.',
        xpReward: 25,
      },
      {
        question: 'What is a landing page in CRO?',
        options: [
          'The first page visitors see on your site',
          'A standalone page designed specifically for conversion',
          'Your website homepage',
          'A page with contact information',
        ],
        correctAnswer: 1,
        explanation:
          'A landing page is designed for a specific campaign or audience with a single conversion goal.',
        xpReward: 25,
      },
      {
        question: 'What does the term "above the fold" refer to?',
        options: [
          'Content visible without scrolling',
          'Content below the page header',
          'Content in the website footer',
          'Content in sidebars',
        ],
        correctAnswer: 0,
        explanation:
          'Above the fold refers to content visible in the browser window without scrolling.',
        xpReward: 25,
      },
      {
        question: 'What is a heat map used for in CRO?',
        options: [
          'Measuring website temperature',
          'Visualizing where users click, scroll, and spend time on a page',
          'Tracking website performance',
          'Creating color schemes',
        ],
        correctAnswer: 1,
        explanation:
          'Heat maps show user interaction data, helping identify which page elements attract the most attention.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Digital Marketing Fundamentals',
    skillName: 'Marketing Strategy & ROI',
    skillIcon: '💡',
    category: 'Marketing',
    difficulty: 'Advanced',
    description:
      'Develop comprehensive marketing strategies and calculate ROI to maximize business growth.',
    duration: '30 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is a SWOT analysis used for in marketing strategy?',
        options: [
          'Analyzing website traffic',
          'Evaluating Strengths, Weaknesses, Opportunities, and Threats',
          'Creating social media posts',
          'Managing email campaigns',
        ],
        correctAnswer: 1,
        explanation:
          'SWOT analysis helps businesses understand their internal capabilities and external environment.',
        xpReward: 25,
      },
      {
        question: 'How is ROI calculated in marketing?',
        options: [
          'Revenue divided by costs',
          '(Revenue - Costs) / Costs × 100',
          'Costs divided by revenue',
          'Revenue minus costs',
        ],
        correctAnswer: 1,
        explanation:
          'ROI = (Revenue - Costs) / Costs × 100, showing the percentage return on marketing investment.',
        xpReward: 25,
      },
      {
        question: 'What is customer lifetime value (CLV)?',
        options: [
          'How long a customer stays with your business',
          'The total revenue a customer generates over their relationship with your business',
          'The average order value',
          'Customer satisfaction rating',
        ],
        correctAnswer: 1,
        explanation:
          'CLV represents the total revenue a business can expect from a single customer over time.',
        xpReward: 25,
      },
      {
        question: 'What is market segmentation?',
        options: [
          'Dividing the market into smaller groups with similar needs',
          'Finding new markets to enter',
          'Analyzing competitor strategies',
          'Setting market prices',
        ],
        correctAnswer: 0,
        explanation:
          'Market segmentation divides a broad market into subsets of consumers with common needs or characteristics.',
        xpReward: 25,
      },
      {
        question: 'What is a marketing KPI?',
        options: [
          'Key Performance Indicator measuring marketing success',
          'Key Pricing Indicator',
          'Key Product Information',
          'Key Purchase Intent',
        ],
        correctAnswer: 0,
        explanation:
          'KPIs are measurable values that demonstrate how effectively a company achieves key business objectives.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },

  // DEVELOPMENT LESSONS (10 lessons)
  {
    topic: 'Web Development Essentials',
    skillName: 'HTML Basics',
    skillIcon: '🌐',
    category: 'Development',
    difficulty: 'Beginner',
    description:
      'Learn the foundation of web development with HTML structure, tags, and semantic markup.',
    duration: '10 min',
    totalXP: 75,
    questions: [
      {
        question: 'What does HTML stand for?',
        options: [
          'HyperText Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlink and Text Markup Language',
        ],
        correctAnswer: 0,
        explanation:
          'HTML stands for HyperText Markup Language, the standard markup language for creating web pages.',
        xpReward: 15,
      },
      {
        question: 'Which HTML tag is used to create a hyperlink?',
        options: ['<link>', '<a>', '<href>', '<url>'],
        correctAnswer: 1,
        explanation:
          'The <a> tag (anchor tag) is used to create hyperlinks to other pages or resources.',
        xpReward: 15,
      },
      {
        question: 'What is the purpose of the <head> tag in HTML?',
        options: [
          'To contain the main content of the page',
          'To contain metadata about the document',
          'To create headings',
          'To define the page footer',
        ],
        correctAnswer: 1,
        explanation:
          'The <head> tag contains metadata like the title, character set, and links to stylesheets.',
        xpReward: 15,
      },
      {
        question: 'Which HTML element is used for the largest heading?',
        options: ['<h6>', '<h1>', '<heading>', '<title>'],
        correctAnswer: 1,
        explanation:
          '<h1> is the largest heading tag, with <h6> being the smallest.',
        xpReward: 15,
      },
      {
        question: 'What does the alt attribute in an <img> tag provide?',
        options: [
          'Image size',
          'Alternative text for accessibility',
          'Image source',
          'Image alignment',
        ],
        correctAnswer: 1,
        explanation:
          'The alt attribute provides alternative text that describes the image for screen readers and when images fail to load.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Web Development Essentials',
    skillName: 'CSS Fundamentals',
    skillIcon: '🎨',
    category: 'Development',
    difficulty: 'Beginner',
    description:
      'Style your web pages with CSS, including layouts, colors, typography, and responsive design.',
    duration: '12 min',
    totalXP: 75,
    questions: [
      {
        question: 'What does CSS stand for?',
        options: [
          'Computer Style Sheets',
          'Cascading Style Sheets',
          'Creative Style Sheets',
          'Colorful Style Sheets',
        ],
        correctAnswer: 1,
        explanation:
          'CSS stands for Cascading Style Sheets, used to describe the presentation of web documents.',
        xpReward: 15,
      },
      {
        question: 'Which CSS property is used to change the text color?',
        options: ['font-color', 'text-color', 'color', 'text-style'],
        correctAnswer: 2,
        explanation: 'The color property sets the color of text in CSS.',
        xpReward: 15,
      },
      {
        question: 'What is the CSS box model?',
        options: [
          'A container for storing CSS rules',
          'A model describing element spacing with margins, borders, padding, and content',
          'A way to create boxes on web pages',
          'A CSS framework',
        ],
        correctAnswer: 1,
        explanation:
          'The box model describes how elements are rendered with content, padding, border, and margin areas.',
        xpReward: 15,
      },
      {
        question:
          'Which CSS property is used to control the spacing between lines of text?',
        options: [
          'line-height',
          'text-spacing',
          'letter-spacing',
          'word-spacing',
        ],
        correctAnswer: 0,
        explanation:
          'The line-height property sets the height of a line box in CSS.',
        xpReward: 15,
      },
      {
        question: 'What does CSS specificity determine?',
        options: [
          'Which CSS rules are more specific and override others',
          'The speed of CSS loading',
          'CSS file size',
          'Browser compatibility',
        ],
        correctAnswer: 0,
        explanation:
          'CSS specificity determines which CSS rule is applied when multiple rules target the same element.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Web Development Essentials',
    skillName: 'JavaScript Basics',
    skillIcon: '⚡',
    category: 'Development',
    difficulty: 'Beginner',
    description:
      'Master JavaScript fundamentals including variables, functions, and DOM manipulation.',
    duration: '15 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is JavaScript primarily used for?',
        options: [
          'Styling web pages',
          'Creating interactive web content',
          'Defining page structure',
          'Database management',
        ],
        correctAnswer: 1,
        explanation:
          'JavaScript is a programming language that enables interactive web pages and dynamic content.',
        xpReward: 15,
      },
      {
        question: 'Which keyword is used to declare a variable in JavaScript?',
        options: ['var', 'let', 'const', 'All of the above'],
        correctAnswer: 3,
        explanation:
          'JavaScript has three ways to declare variables: var, let, and const.',
        xpReward: 15,
      },
      {
        question: 'What is the DOM in JavaScript?',
        options: [
          'Document Object Model representing the page structure',
          'Data Object Manager',
          'Dynamic Object Method',
          'Document Orientation Mode',
        ],
        correctAnswer: 0,
        explanation:
          'The DOM is a programming interface for HTML and XML documents that represents the page structure.',
        xpReward: 15,
      },
      {
        question: 'Which operator is used for strict equality in JavaScript?',
        options: ['==', '===', '=', '!='],
        correctAnswer: 1,
        explanation:
          'The === operator checks for both value and type equality, while == only checks value.',
        xpReward: 15,
      },
      {
        question: 'What is a function in JavaScript?',
        options: [
          'A variable type',
          'A reusable block of code that performs a specific task',
          'An HTML element',
          'A CSS property',
        ],
        correctAnswer: 1,
        explanation:
          'A function is a block of code designed to perform a particular task and can be reused throughout the program.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Web Development Essentials',
    skillName: 'Git Version Control',
    skillIcon: '📦',
    category: 'Development',
    difficulty: 'Beginner',
    description:
      'Learn version control with Git, including commits, branches, and collaboration workflows.',
    duration: '15 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is Git?',
        options: [
          'A programming language',
          'A distributed version control system',
          'A text editor',
          'A web browser',
        ],
        correctAnswer: 1,
        explanation:
          'Git is a distributed version control system that tracks changes in source code during software development.',
        xpReward: 15,
      },
      {
        question: 'What does the git commit command do?',
        options: [
          'Uploads code to a remote repository',
          'Saves changes to the local repository',
          'Creates a new branch',
          'Merges branches',
        ],
        correctAnswer: 1,
        explanation:
          'git commit saves staged changes to the local repository with a descriptive message.',
        xpReward: 15,
      },
      {
        question: 'What is a Git branch?',
        options: [
          'A copy of the repository at a specific point in time',
          'A separate line of development',
          'A backup of the code',
          'A Git command',
        ],
        correctAnswer: 1,
        explanation:
          'A branch represents an independent line of development that allows working on features without affecting the main codebase.',
        xpReward: 15,
      },
      {
        question: 'What does git pull do?',
        options: [
          'Uploads local changes to remote',
          'Downloads and merges changes from remote repository',
          'Creates a new repository',
          'Deletes a branch',
        ],
        correctAnswer: 1,
        explanation:
          'git pull fetches changes from a remote repository and merges them into the current branch.',
        xpReward: 15,
      },
      {
        question: 'What is GitHub?',
        options: [
          'A Git command',
          'A web-based hosting service for Git repositories',
          'A text editor',
          'A programming language',
        ],
        correctAnswer: 1,
        explanation:
          'GitHub is a platform for hosting and collaborating on Git repositories with additional features like issue tracking.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Web Development Essentials',
    skillName: 'React Components',
    skillIcon: '⚛️',
    category: 'Development',
    difficulty: 'Intermediate',
    description:
      'Build interactive UIs with React components, props, and state management.',
    duration: '20 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is React?',
        options: [
          'A database',
          'A JavaScript library for building user interfaces',
          'A CSS framework',
          'A backend framework',
        ],
        correctAnswer: 1,
        explanation:
          'React is a JavaScript library for building user interfaces, particularly single-page applications.',
        xpReward: 20,
      },
      {
        question: 'What are React components?',
        options: [
          'HTML elements',
          'Reusable pieces of UI code',
          'CSS classes',
          'JavaScript functions only',
        ],
        correctAnswer: 1,
        explanation:
          'React components are reusable pieces of code that return JSX elements to describe what should appear on the screen.',
        xpReward: 20,
      },
      {
        question: 'What are props in React?',
        options: [
          'Component styling',
          'Data passed from parent to child components',
          'Component state',
          'Event handlers',
        ],
        correctAnswer: 1,
        explanation:
          'Props (properties) are read-only data passed from parent components to child components.',
        xpReward: 20,
      },
      {
        question: 'What is state in React?',
        options: [
          'Component props',
          'Data that can change over time within a component',
          'Component styling',
          'External data',
        ],
        correctAnswer: 1,
        explanation:
          "State is a built-in React object that stores data that can change over the component's lifecycle.",
        xpReward: 20,
      },
      {
        question: 'What is JSX?',
        options: [
          'A JavaScript framework',
          'A syntax extension for JavaScript used in React',
          'A CSS preprocessor',
          'A database query language',
        ],
        correctAnswer: 1,
        explanation:
          'JSX is a syntax extension that allows writing HTML-like code within JavaScript, used in React components.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Web Development Essentials',
    skillName: 'REST APIs',
    skillIcon: '🔌',
    category: 'Development',
    difficulty: 'Intermediate',
    description:
      'Create and consume RESTful APIs for backend-frontend communication.',
    duration: '22 min',
    totalXP: 100,
    questions: [
      {
        question: 'What does REST stand for?',
        options: [
          'Really Effective Simple Transfer',
          'Representational State Transfer',
          'Remote Execution System Technology',
          'Rapid Endpoint Service Tool',
        ],
        correctAnswer: 1,
        explanation:
          'REST stands for Representational State Transfer, an architectural style for designing networked applications.',
        xpReward: 20,
      },
      {
        question: 'Which HTTP method is typically used to retrieve data?',
        options: ['POST', 'PUT', 'GET', 'DELETE'],
        correctAnswer: 2,
        explanation:
          'GET requests are used to retrieve data from a server without modifying it.',
        xpReward: 20,
      },
      {
        question: 'What is an API endpoint?',
        options: [
          'A physical server location',
          'A specific URL where an API can be accessed',
          'A programming language',
          'A database table',
        ],
        correctAnswer: 1,
        explanation:
          'An API endpoint is a specific URL that represents a particular resource or functionality in an API.',
        xpReward: 20,
      },
      {
        question: 'What is JSON commonly used for in APIs?',
        options: [
          'Styling web pages',
          'Data interchange between client and server',
          'Creating databases',
          'Writing documentation',
        ],
        correctAnswer: 1,
        explanation:
          'JSON (JavaScript Object Notation) is a lightweight format for data interchange in APIs.',
        xpReward: 20,
      },
      {
        question: 'What does HTTP status code 200 indicate?',
        options: ['Server error', 'Not found', 'Success/OK', 'Unauthorized'],
        correctAnswer: 2,
        explanation:
          'HTTP 200 OK indicates that the request was successful and the server returned the requested data.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Web Development Essentials',
    skillName: 'Database Design',
    skillIcon: '🗄️',
    category: 'Development',
    difficulty: 'Intermediate',
    description:
      'Design efficient database schemas and write optimized queries for data management.',
    duration: '25 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is a database schema?',
        options: [
          'Database software',
          'The structure and organization of a database',
          'Database security settings',
          'Database backup files',
        ],
        correctAnswer: 1,
        explanation:
          'A database schema defines the structure, including tables, fields, relationships, and constraints.',
        xpReward: 20,
      },
      {
        question: 'What is normalization in database design?',
        options: [
          'Making databases faster',
          'Organizing data to reduce redundancy and improve integrity',
          'Encrypting database data',
          'Creating database backups',
        ],
        correctAnswer: 1,
        explanation:
          'Normalization is the process of organizing data to minimize redundancy and dependency issues.',
        xpReward: 20,
      },
      {
        question: 'What is a primary key?',
        options: [
          'The main database password',
          'A unique identifier for each record in a table',
          'The first column in a table',
          'A foreign key reference',
        ],
        correctAnswer: 1,
        explanation:
          'A primary key uniquely identifies each record in a database table.',
        xpReward: 20,
      },
      {
        question: 'What is a foreign key?',
        options: [
          'A key from another country',
          'A field that links to the primary key of another table',
          'An encrypted key',
          'A backup key',
        ],
        correctAnswer: 1,
        explanation:
          'A foreign key creates a relationship between tables by referencing the primary key of another table.',
        xpReward: 20,
      },
      {
        question: 'What does SQL stand for?',
        options: [
          'Simple Query Language',
          'Structured Query Language',
          'System Query Logic',
          'Server Query Language',
        ],
        correctAnswer: 1,
        explanation:
          'SQL (Structured Query Language) is used to communicate with and manipulate databases.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Web Development Essentials',
    skillName: 'Advanced JavaScript Patterns',
    skillIcon: '🚀',
    category: 'Development',
    difficulty: 'Advanced',
    description:
      'Master advanced JavaScript concepts including closures, promises, and async/await.',
    duration: '28 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is a closure in JavaScript?',
        options: [
          'A way to close browser windows',
          'A function that has access to variables from its outer scope',
          'A method to end loops',
          'A type of error',
        ],
        correctAnswer: 1,
        explanation:
          'A closure is a function that remembers and accesses variables from its lexical scope even when executed outside that scope.',
        xpReward: 25,
      },
      {
        question: 'What is a Promise in JavaScript?',
        options: [
          'A guarantee to deliver something',
          'An object representing the eventual completion of an asynchronous operation',
          'A type of function',
          'A variable declaration',
        ],
        correctAnswer: 1,
        explanation:
          'A Promise represents a value that may be available now, or in the future, or never, handling asynchronous operations.',
        xpReward: 25,
      },
      {
        question: 'What does async/await do?',
        options: [
          'Makes code run faster',
          'Simplifies working with Promises by making asynchronous code look synchronous',
          'Creates new threads',
          'Handles errors automatically',
        ],
        correctAnswer: 1,
        explanation:
          'async/await is syntactic sugar for Promises, making asynchronous code easier to read and write.',
        xpReward: 25,
      },
      {
        question: 'What is the event loop in JavaScript?',
        options: [
          'A loop that handles events',
          'The mechanism that handles asynchronous callbacks',
          'A way to loop through arrays',
          'A timing mechanism',
        ],
        correctAnswer: 1,
        explanation:
          'The event loop is what allows JavaScript to perform non-blocking I/O operations despite being single-threaded.',
        xpReward: 25,
      },
      {
        question: 'What is destructuring in JavaScript?',
        options: [
          'Breaking down code into smaller parts',
          'A way to unpack values from arrays or objects into distinct variables',
          'Destroying variables',
          'Creating new data structures',
        ],
        correctAnswer: 1,
        explanation:
          'Destructuring allows extracting multiple properties from objects or elements from arrays into variables.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Web Development Essentials',
    skillName: 'Performance Optimization',
    skillIcon: '⚡',
    category: 'Development',
    difficulty: 'Advanced',
    description:
      'Optimize web application performance with code splitting, lazy loading, and caching.',
    duration: '30 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is code splitting?',
        options: [
          'Dividing code into smaller chunks that can be loaded on demand',
          'Removing unnecessary code',
          'Compressing code files',
          'Rewriting code in another language',
        ],
        correctAnswer: 0,
        explanation:
          'Code splitting breaks a large bundle into smaller chunks that can be loaded dynamically, improving initial load times.',
        xpReward: 25,
      },
      {
        question: 'What is lazy loading?',
        options: [
          'Loading all resources at once',
          'Deferring loading of non-critical resources until needed',
          'Loading resources slowly',
          'Caching all resources',
        ],
        correctAnswer: 1,
        explanation:
          'Lazy loading delays loading of images, scripts, or components until they are needed, improving page load speed.',
        xpReward: 25,
      },
      {
        question: 'What is browser caching?',
        options: [
          'Storing frequently used data in the browser for faster access',
          'Clearing browser history',
          'Monitoring browser usage',
          'Blocking browser features',
        ],
        correctAnswer: 0,
        explanation:
          'Browser caching stores web page resources locally to reduce loading times on subsequent visits.',
        xpReward: 25,
      },
      {
        question: 'What is minification?',
        options: [
          'Making code smaller',
          'Removing unnecessary characters from code without changing functionality',
          'Adding comments to code',
          'Reformatting code',
        ],
        correctAnswer: 1,
        explanation:
          'Minification removes whitespace, comments, and other unnecessary characters to reduce file size.',
        xpReward: 25,
      },
      {
        question: 'What is a CDN?',
        options: [
          'Content Delivery Network distributing content globally',
          'Code Development Node',
          'Central Database Network',
          'Client Data Node',
        ],
        correctAnswer: 0,
        explanation:
          'A CDN is a network of servers that delivers web content to users based on their geographic location.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Web Development Essentials',
    skillName: 'System Architecture',
    skillIcon: '🏗️',
    category: 'Development',
    difficulty: 'Advanced',
    description:
      'Design scalable system architectures with microservices and cloud infrastructure.',
    duration: '30 min',
    totalXP: 125,
    questions: [
      {
        question: 'What are microservices?',
        options: [
          'Small physical servers',
          'Small, independent services that work together',
          'Microscopic software components',
          'Small databases',
        ],
        correctAnswer: 1,
        explanation:
          'Microservices are a software architecture style where applications are built as a collection of small, independent services.',
        xpReward: 25,
      },
      {
        question: 'What is scalability in system architecture?',
        options: [
          'Making systems smaller',
          'The ability of a system to handle increased load',
          'Reducing system complexity',
          'Making systems cheaper',
        ],
        correctAnswer: 1,
        explanation:
          "Scalability refers to a system's ability to handle growing amounts of work or accommodate growth.",
        xpReward: 25,
      },
      {
        question: 'What is load balancing?',
        options: [
          'Balancing server weight',
          'Distributing network traffic across multiple servers',
          'Managing server power consumption',
          'Balancing database loads',
        ],
        correctAnswer: 1,
        explanation:
          'Load balancing distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed.',
        xpReward: 25,
      },
      {
        question: 'What is containerization?',
        options: [
          'Storing data in containers',
          'Packaging software with its dependencies into standardized units',
          'Creating virtual machines',
          'Compressing application files',
        ],
        correctAnswer: 1,
        explanation:
          'Containerization packages an application and its dependencies into a container that can run consistently across environments.',
        xpReward: 25,
      },
      {
        question: 'What is the purpose of API Gateway?',
        options: [
          'Managing APIs',
          'A single entry point for all client requests to backend services',
          'A database connection',
          'A security firewall',
        ],
        correctAnswer: 1,
        explanation:
          'An API Gateway acts as a single entry point for client requests, routing them to appropriate backend services.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },

  // DATA LESSONS (10 lessons)
  {
    topic: 'Data Science Fundamentals',
    skillName: 'Data Analysis Basics',
    skillIcon: '📊',
    category: 'Data',
    difficulty: 'Beginner',
    description:
      'Learn fundamental data analysis techniques including data cleaning, exploration, and basic statistics.',
    duration: '10 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is data analysis?',
        options: [
          'Collecting data only',
          'Examining data to find insights and draw conclusions',
          'Storing data in databases',
          'Creating data visualizations',
        ],
        correctAnswer: 1,
        explanation:
          'Data analysis involves inspecting, cleaning, transforming, and modeling data to discover useful information.',
        xpReward: 15,
      },
      {
        question: 'What is the first step in data analysis?',
        options: [
          'Creating visualizations',
          'Understanding the business problem',
          'Data cleaning',
          'Statistical analysis',
        ],
        correctAnswer: 1,
        explanation:
          'Understanding the business problem or question is crucial before diving into data analysis.',
        xpReward: 15,
      },
      {
        question: 'What does "data cleaning" involve?',
        options: [
          'Making data look pretty',
          'Identifying and correcting errors in datasets',
          'Analyzing data patterns',
          'Creating data backups',
        ],
        correctAnswer: 1,
        explanation:
          'Data cleaning involves finding and correcting errors, handling missing values, and ensuring data quality.',
        xpReward: 15,
      },
      {
        question: 'What is a dataset?',
        options: [
          'A single data point',
          'A collection of related data organized in a structured format',
          'A data analysis tool',
          'A type of database',
        ],
        correctAnswer: 1,
        explanation:
          'A dataset is a collection of data points organized in rows and columns, typically for analysis.',
        xpReward: 15,
      },
      {
        question: 'What is the mean in statistics?',
        options: [
          'The middle value',
          'The most frequent value',
          'The average of all values',
          'The range of values',
        ],
        correctAnswer: 2,
        explanation:
          'The mean is the arithmetic average of a set of numbers, calculated by summing all values and dividing by the count.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Data Science Fundamentals',
    skillName: 'Python for Data Analysis',
    skillIcon: '🐍',
    category: 'Data',
    difficulty: 'Beginner',
    description:
      'Master Python libraries like Pandas and NumPy for data manipulation and analysis.',
    duration: '12 min',
    totalXP: 75,
    questions: [
      {
        question:
          'Which Python library is primarily used for data manipulation?',
        options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
        correctAnswer: 1,
        explanation:
          'Pandas provides data structures and operations for working with structured data, especially tabular data.',
        xpReward: 15,
      },
      {
        question: 'What is NumPy used for?',
        options: [
          'Data visualization',
          'Numerical computing and array operations',
          'Machine learning',
          'Web scraping',
        ],
        correctAnswer: 1,
        explanation:
          'NumPy provides support for large, multi-dimensional arrays and matrices, along with mathematical functions.',
        xpReward: 15,
      },
      {
        question: 'What is a Pandas DataFrame?',
        options: [
          'A single column of data',
          'A two-dimensional labeled data structure',
          'A data visualization',
          'A statistical function',
        ],
        correctAnswer: 1,
        explanation:
          'A DataFrame is a 2-dimensional labeled data structure with columns that can be of different types.',
        xpReward: 15,
      },
      {
        question: 'How do you read a CSV file in Pandas?',
        options: [
          'pd.read_csv()',
          'pd.load_csv()',
          'pd.open_csv()',
          'pd.import_csv()',
        ],
        correctAnswer: 0,
        explanation:
          'pd.read_csv() is the primary function for reading CSV files into a Pandas DataFrame.',
        xpReward: 15,
      },
      {
        question: 'What does the head() method do in Pandas?',
        options: [
          'Shows the last rows',
          'Shows the first few rows of a DataFrame',
          'Shows column names',
          'Shows data types',
        ],
        correctAnswer: 1,
        explanation:
          'The head() method returns the first n rows of a DataFrame (default is 5).',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Data Science Fundamentals',
    skillName: 'Data Visualization',
    skillIcon: '📈',
    category: 'Data',
    difficulty: 'Beginner',
    description:
      'Create compelling data visualizations using Matplotlib and Seaborn to communicate insights.',
    duration: '15 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is data visualization?',
        options: [
          'Storing data visually',
          'Representing data graphically to understand patterns and trends',
          'Analyzing data with code',
          'Collecting visual data',
        ],
        correctAnswer: 1,
        explanation:
          'Data visualization uses visual elements like charts and graphs to represent data and reveal insights.',
        xpReward: 15,
      },
      {
        question: 'Which Python library is commonly used for basic plotting?',
        options: ['Seaborn', 'Plotly', 'Matplotlib', 'Bokeh'],
        correctAnswer: 2,
        explanation:
          'Matplotlib is the foundational plotting library in Python, providing basic plotting functionality.',
        xpReward: 15,
      },
      {
        question: 'What type of chart is best for showing trends over time?',
        options: ['Pie chart', 'Bar chart', 'Line chart', 'Scatter plot'],
        correctAnswer: 2,
        explanation:
          'Line charts are ideal for showing trends and changes over continuous time intervals.',
        xpReward: 15,
      },
      {
        question: 'What does a histogram show?',
        options: [
          'Relationships between two variables',
          'Distribution of a single variable',
          'Parts of a whole',
          'Comparisons between categories',
        ],
        correctAnswer: 1,
        explanation:
          'A histogram shows the distribution of a continuous variable by dividing data into bins.',
        xpReward: 15,
      },
      {
        question: 'What is the purpose of a legend in data visualization?',
        options: [
          'To make charts look better',
          'To explain what different colors/symbols represent',
          'To show data sources',
          'To display chart titles',
        ],
        correctAnswer: 1,
        explanation:
          'A legend explains the meaning of different visual elements like colors, shapes, or sizes in a chart.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Data Science Fundamentals',
    skillName: 'Statistical Analysis',
    skillIcon: '📐',
    category: 'Data',
    difficulty: 'Beginner',
    description:
      'Apply statistical methods to analyze data and make informed decisions.',
    duration: '15 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is the median?',
        options: [
          'The average value',
          'The middle value when data is sorted',
          'The most frequent value',
          'The range of values',
        ],
        correctAnswer: 1,
        explanation:
          'The median is the middle value in a sorted list of numbers.',
        xpReward: 15,
      },
      {
        question: 'What does standard deviation measure?',
        options: [
          'Central tendency',
          'Data spread or variability',
          'Data range',
          'Data frequency',
        ],
        correctAnswer: 1,
        explanation:
          'Standard deviation measures how spread out the values are from the mean.',
        xpReward: 15,
      },
      {
        question: 'What is a normal distribution?',
        options: [
          'A distribution that is skewed',
          'A bell-shaped distribution where most values cluster around the mean',
          'A distribution with two peaks',
          'A uniform distribution',
        ],
        correctAnswer: 1,
        explanation:
          'A normal distribution is symmetric around the mean, with most values concentrated near the center.',
        xpReward: 15,
      },
      {
        question: 'What is hypothesis testing?',
        options: [
          'Creating hypotheses',
          'A statistical method to test claims about populations using sample data',
          'Analyzing hypotheses',
          'Rejecting all hypotheses',
        ],
        correctAnswer: 1,
        explanation:
          'Hypothesis testing uses statistical methods to determine if there is enough evidence to reject a null hypothesis.',
        xpReward: 15,
      },
      {
        question: 'What is correlation?',
        options: [
          'When two variables are related',
          'A statistical measure of the relationship between two variables',
          'When variables are independent',
          'A type of distribution',
        ],
        correctAnswer: 1,
        explanation:
          'Correlation measures the strength and direction of the linear relationship between two variables.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Data Science Fundamentals',
    skillName: 'Machine Learning Basics',
    skillIcon: '🤖',
    category: 'Data',
    difficulty: 'Intermediate',
    description:
      'Introduction to machine learning concepts including supervised and unsupervised learning.',
    duration: '20 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is machine learning?',
        options: [
          'Programming computers to learn from data',
          'Manually writing algorithms',
          'Storing data in computers',
          'Creating computer hardware',
        ],
        correctAnswer: 0,
        explanation:
          'Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed.',
        xpReward: 20,
      },
      {
        question: 'What is supervised learning?',
        options: [
          'Learning without guidance',
          'Learning with labeled training data',
          'Learning from unstructured data',
          'Learning from computer games',
        ],
        correctAnswer: 1,
        explanation:
          'Supervised learning uses labeled data to train models that can make predictions on new, unseen data.',
        xpReward: 20,
      },
      {
        question: 'What is unsupervised learning?',
        options: [
          'Learning with teacher supervision',
          'Finding patterns in data without labeled examples',
          'Learning from video games',
          'Learning with full supervision',
        ],
        correctAnswer: 1,
        explanation:
          'Unsupervised learning finds hidden patterns or groupings in data without predefined labels.',
        xpReward: 20,
      },
      {
        question: 'What is a training set?',
        options: [
          'Data used to test models',
          'Data used to train machine learning models',
          'Data used for validation',
          'Data used for deployment',
        ],
        correctAnswer: 1,
        explanation:
          'A training set is the data used to teach a machine learning algorithm to recognize patterns.',
        xpReward: 20,
      },
      {
        question: 'What is overfitting in machine learning?',
        options: [
          'When a model performs well on training data but poorly on new data',
          'When a model is too simple',
          'When training takes too long',
          'When data is insufficient',
        ],
        correctAnswer: 0,
        explanation:
          'Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize to new data.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Data Science Fundamentals',
    skillName: 'Data Wrangling',
    skillIcon: '🔧',
    category: 'Data',
    difficulty: 'Intermediate',
    description:
      'Clean and transform raw data into analysis-ready formats using advanced techniques.',
    duration: '22 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is data wrangling?',
        options: [
          'Creating data visualizations',
          'Cleaning and transforming raw data into usable formats',
          'Analyzing data statistically',
          'Storing data in databases',
        ],
        correctAnswer: 1,
        explanation:
          'Data wrangling involves cleaning, structuring, and enriching raw data into a desired format for analysis.',
        xpReward: 20,
      },
      {
        question: 'What is data normalization?',
        options: [
          'Making data smaller',
          'Scaling data to a standard range or distribution',
          'Removing data duplicates',
          'Converting data types',
        ],
        correctAnswer: 1,
        explanation:
          'Data normalization scales numeric data to a standard range, often between 0 and 1, to prevent features with larger ranges from dominating.',
        xpReward: 20,
      },
      {
        question: 'What are outliers in data?',
        options: [
          'Data points that are exactly average',
          'Data points that differ significantly from other observations',
          'Data points that are missing',
          'Data points that are duplicated',
        ],
        correctAnswer: 1,
        explanation:
          'Outliers are data points that lie far outside the normal range of other data points.',
        xpReward: 20,
      },
      {
        question: 'What is feature engineering?',
        options: [
          'Creating new features from existing data',
          'Removing features from datasets',
          'Engineering software features',
          'Creating data visualizations',
        ],
        correctAnswer: 0,
        explanation:
          'Feature engineering involves creating new input features from existing data to improve model performance.',
        xpReward: 20,
      },
      {
        question: 'What is data imputation?',
        options: [
          'Removing missing data',
          'Filling in missing values with estimated values',
          'Creating new data',
          'Analyzing missing data patterns',
        ],
        correctAnswer: 1,
        explanation:
          'Data imputation replaces missing values with substituted values based on other available data.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Data Science Fundamentals',
    skillName: 'Predictive Modeling',
    skillIcon: '🔮',
    category: 'Data',
    difficulty: 'Intermediate',
    description:
      'Build and evaluate predictive models using regression and classification techniques.',
    duration: '25 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is regression analysis?',
        options: [
          'Classifying data into categories',
          'Predicting continuous numerical values',
          'Finding data patterns',
          'Analyzing data distributions',
        ],
        correctAnswer: 1,
        explanation:
          'Regression analysis predicts continuous outcomes by modeling the relationship between variables.',
        xpReward: 20,
      },
      {
        question: 'What is classification in machine learning?',
        options: [
          'Sorting data alphabetically',
          'Predicting categorical outcomes or class labels',
          'Analyzing data trends',
          'Creating data categories',
        ],
        correctAnswer: 1,
        explanation:
          'Classification assigns data points to predefined categories or classes based on their features.',
        xpReward: 20,
      },
      {
        question: 'What is the confusion matrix?',
        options: [
          'A matrix showing model errors',
          'A table showing correct and incorrect predictions',
          'A matrix of feature correlations',
          'A matrix of model weights',
        ],
        correctAnswer: 1,
        explanation:
          'A confusion matrix shows the number of correct and incorrect predictions made by a classification model.',
        xpReward: 20,
      },
      {
        question: 'What does R-squared measure?',
        options: [
          'Model accuracy',
          'The proportion of variance explained by the model',
          'Model speed',
          'Data correlation',
        ],
        correctAnswer: 1,
        explanation:
          'R-squared indicates how well the regression model fits the data, ranging from 0 to 1.',
        xpReward: 20,
      },
      {
        question: 'What is cross-validation?',
        options: [
          'Validating data across different systems',
          'A technique to assess model performance on unseen data',
          'Comparing different models',
          'Validating data types',
        ],
        correctAnswer: 1,
        explanation:
          'Cross-validation splits data into training and testing sets multiple times to evaluate model performance.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Data Science Fundamentals',
    skillName: 'Deep Learning Fundamentals',
    skillIcon: '🧠',
    category: 'Data',
    difficulty: 'Advanced',
    description:
      'Explore neural networks and deep learning architectures for complex pattern recognition.',
    duration: '28 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is deep learning?',
        options: [
          'Learning deeply about data',
          'A subset of machine learning using neural networks with multiple layers',
          'Learning from big data only',
          'Advanced statistical analysis',
        ],
        correctAnswer: 1,
        explanation:
          'Deep learning uses artificial neural networks with multiple layers to learn complex patterns in data.',
        xpReward: 25,
      },
      {
        question: 'What is a neural network?',
        options: [
          'A computer network',
          'A computing system inspired by biological neural networks',
          'A type of database',
          'A programming language',
        ],
        correctAnswer: 1,
        explanation:
          'Neural networks are computing systems modeled after the human brain, consisting of interconnected nodes (neurons).',
        xpReward: 25,
      },
      {
        question: 'What is backpropagation?',
        options: [
          'Moving data backwards',
          'An algorithm for training neural networks by calculating gradients',
          'A data preprocessing technique',
          'A type of neural network',
        ],
        correctAnswer: 1,
        explanation:
          'Backpropagation is the algorithm used to calculate the gradient of the loss function and update network weights.',
        xpReward: 25,
      },
      {
        question: 'What is a convolutional neural network (CNN)?',
        options: [
          'A network for conversations',
          'A neural network designed for processing grid-like data like images',
          'A network for text processing',
          'A simple feedforward network',
        ],
        correctAnswer: 1,
        explanation:
          'CNNs are specialized neural networks that use convolutional layers to automatically learn spatial features from images.',
        xpReward: 25,
      },
      {
        question: 'What is overfitting in deep learning?',
        options: [
          'When training takes too long',
          'When a model memorizes training data but fails on new data',
          'When the model is too simple',
          'When data is insufficient',
        ],
        correctAnswer: 1,
        explanation:
          'Overfitting occurs when a deep learning model learns the training data too well, including noise, leading to poor generalization.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Data Science Fundamentals',
    skillName: 'Big Data Analytics',
    skillIcon: '📊',
    category: 'Data',
    difficulty: 'Advanced',
    description:
      'Handle and analyze massive datasets using distributed computing frameworks.',
    duration: '30 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is big data?',
        options: [
          'Data that is very large',
          'Data characterized by volume, velocity, and variety (the 3Vs)',
          'Data from big companies',
          'Old data',
        ],
        correctAnswer: 1,
        explanation:
          'Big data is characterized by the 3Vs: Volume (large amounts), Velocity (fast generation), and Variety (different types).',
        xpReward: 25,
      },
      {
        question: 'What is Hadoop?',
        options: [
          'A programming language',
          'An open-source framework for distributed storage and processing of big data',
          'A database system',
          'A data visualization tool',
        ],
        correctAnswer: 1,
        explanation:
          'Hadoop is an open-source framework that allows for the distributed processing of large datasets across clusters of computers.',
        xpReward: 25,
      },
      {
        question: 'What is MapReduce?',
        options: [
          'A mapping application',
          'A programming model for processing large datasets in parallel',
          'A data reduction technique',
          'A mapping function',
        ],
        correctAnswer: 1,
        explanation:
          'MapReduce is a programming model that allows processing of large datasets by dividing work into map and reduce functions.',
        xpReward: 25,
      },
      {
        question: 'What is Apache Spark?',
        options: [
          'A type of engine',
          'A unified analytics engine for big data processing',
          'A database query language',
          'A data storage system',
        ],
        correctAnswer: 1,
        explanation:
          'Apache Spark is an open-source unified analytics engine for large-scale data processing with built-in modules for SQL, streaming, and machine learning.',
        xpReward: 25,
      },
      {
        question: 'What is data streaming?',
        options: [
          'Playing music online',
          'Processing continuous streams of data in real-time',
          'Downloading data slowly',
          'Storing data in streams',
        ],
        correctAnswer: 1,
        explanation:
          'Data streaming involves processing and analyzing data as it is generated, rather than in batches.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Data Science Fundamentals',
    skillName: 'Data Ethics & Privacy',
    skillIcon: '🔒',
    category: 'Data',
    difficulty: 'Advanced',
    description:
      'Understand ethical considerations and privacy regulations in data science and AI.',
    duration: '30 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is data privacy?',
        options: [
          'Keeping data secret',
          'The right of individuals to control their personal information',
          'Encrypting all data',
          'Deleting old data',
        ],
        correctAnswer: 1,
        explanation:
          'Data privacy refers to the protection of personal information and the right of individuals to control how their data is collected and used.',
        xpReward: 25,
      },
      {
        question: 'What is GDPR?',
        options: [
          'A data storage format',
          'General Data Protection Regulation - EU privacy law',
          'A data analysis technique',
          'A programming language',
        ],
        correctAnswer: 1,
        explanation:
          'GDPR is a comprehensive data protection law in the European Union that regulates how personal data is collected, stored, and processed.',
        xpReward: 25,
      },
      {
        question: 'What is algorithmic bias?',
        options: [
          'Bias in programming algorithms',
          'When AI systems reflect or amplify societal biases in their training data',
          'Bias against certain algorithms',
          'Mathematical bias in calculations',
        ],
        correctAnswer: 1,
        explanation:
          'Algorithmic bias occurs when AI systems perpetuate or amplify existing biases present in their training data.',
        xpReward: 25,
      },
      {
        question: 'What is data anonymization?',
        options: [
          'Making data anonymous by removing personal identifiers',
          'Hiding data from view',
          'Encrypting data completely',
          'Deleting data permanently',
        ],
        correctAnswer: 0,
        explanation:
          'Data anonymization removes or modifies personal identifiers so that individuals cannot be identified from the data.',
        xpReward: 25,
      },
      {
        question: 'What is informed consent in data collection?',
        options: [
          'Getting permission without explanation',
          'Obtaining permission from individuals after clearly explaining how their data will be used',
          'Assuming consent by default',
          'Getting consent through complex legal documents',
        ],
        correctAnswer: 1,
        explanation:
          'Informed consent requires clear communication about data collection purposes, usage, and rights before obtaining permission.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },

  // BUSINESS LESSONS (10 lessons)
  {
    topic: 'Business Strategy',
    skillName: 'Strategic Planning',
    skillIcon: '🎯',
    category: 'Business',
    difficulty: 'Beginner',
    description:
      'Learn the fundamentals of business strategy and strategic planning for organizational success.',
    duration: '10 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is business strategy?',
        options: [
          'Daily operations',
          'A long-term plan for achieving business goals and objectives',
          'Financial planning only',
          'Marketing tactics',
        ],
        correctAnswer: 1,
        explanation:
          'Business strategy is a comprehensive plan that outlines how a company will achieve its goals and compete in the market.',
        xpReward: 15,
      },
      {
        question: 'What is a SWOT analysis?',
        options: [
          'Sales analysis',
          'Evaluating Strengths, Weaknesses, Opportunities, and Threats',
          'Website optimization',
          'Workforce planning',
        ],
        correctAnswer: 1,
        explanation:
          'SWOT analysis is a strategic planning tool that helps identify internal strengths/weaknesses and external opportunities/threats.',
        xpReward: 15,
      },
      {
        question: 'What is a mission statement?',
        options: [
          'Company profits',
          "A declaration of a company's purpose and reason for existing",
          'Company location',
          'Employee handbook',
        ],
        correctAnswer: 1,
        explanation:
          'A mission statement defines what a company does, who it serves, and how it provides value.',
        xpReward: 15,
      },
      {
        question: 'What are SMART goals?',
        options: [
          'Simple goals',
          'Goals that are Specific, Measurable, Achievable, Relevant, and Time-bound',
          'Marketing goals',
          'Financial goals',
        ],
        correctAnswer: 1,
        explanation:
          'SMART goals provide a framework for setting clear, actionable objectives that can be tracked and achieved.',
        xpReward: 15,
      },
      {
        question: 'What is competitive advantage?',
        options: [
          'Having more competitors',
          'Unique strengths that allow a company to outperform competitors',
          'High prices',
          'Large market share',
        ],
        correctAnswer: 1,
        explanation:
          'Competitive advantage refers to factors that allow a company to produce goods or services better or more cheaply than competitors.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Business Strategy',
    skillName: 'Financial Management',
    skillIcon: '💰',
    category: 'Business',
    difficulty: 'Beginner',
    description:
      'Master basic financial concepts including budgeting, cash flow, and financial statement analysis.',
    duration: '12 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is a balance sheet?',
        options: [
          'A record of revenues and expenses',
          "A snapshot of a company's financial position at a specific point in time",
          'A cash flow statement',
          'An income statement',
        ],
        correctAnswer: 1,
        explanation:
          "A balance sheet shows a company's assets, liabilities, and equity at a specific moment.",
        xpReward: 15,
      },
      {
        question: 'What is profit margin?',
        options: [
          'Total sales',
          'The percentage of revenue that becomes profit',
          'Total expenses',
          'Cash in bank',
        ],
        correctAnswer: 1,
        explanation:
          'Profit margin shows what percentage of revenue remains as profit after all expenses are paid.',
        xpReward: 15,
      },
      {
        question: 'What is cash flow?',
        options: [
          'Money in the bank',
          'The movement of money in and out of a business',
          'Company profits',
          'Bank loans',
        ],
        correctAnswer: 1,
        explanation:
          'Cash flow tracks the inflow and outflow of cash from operating, investing, and financing activities.',
        xpReward: 15,
      },
      {
        question: 'What is ROI?',
        options: [
          'Return On Investment measuring profitability of investments',
          'Rate Of Interest on loans',
          'Revenue Over Income',
          'Return On Inventory',
        ],
        correctAnswer: 0,
        explanation:
          'ROI measures the efficiency of an investment by comparing the gain or loss relative to the cost.',
        xpReward: 15,
      },
      {
        question: 'What is depreciation?',
        options: [
          'Asset value increase',
          'The gradual reduction in the value of assets over time',
          'Employee salaries',
          'Tax payments',
        ],
        correctAnswer: 1,
        explanation:
          'Depreciation allocates the cost of tangible assets over their useful life.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Business Strategy',
    skillName: 'Marketing Fundamentals',
    skillIcon: '📢',
    category: 'Business',
    difficulty: 'Beginner',
    description:
      'Understand core marketing principles and develop effective marketing strategies.',
    duration: '15 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is the marketing mix?',
        options: [
          'Product, Price, Place, Promotion (4Ps)',
          'People, Process, Physical evidence, Productivity',
          'Planning, Positioning, Performance, Profit',
          'Product, People, Price, Positioning',
        ],
        correctAnswer: 0,
        explanation:
          'The marketing mix consists of the 4Ps: Product, Price, Place (distribution), and Promotion.',
        xpReward: 15,
      },
      {
        question: 'What is market segmentation?',
        options: [
          'Dividing markets into smaller groups',
          'Targeting the entire market',
          'Ignoring market differences',
          'Focusing on competitors',
        ],
        correctAnswer: 0,
        explanation:
          'Market segmentation divides a broad market into subsets of consumers with common needs or characteristics.',
        xpReward: 15,
      },
      {
        question: 'What is a target market?',
        options: [
          'All potential customers',
          'A specific group of customers most likely to buy your product',
          'Competitor customers',
          'Random customers',
        ],
        correctAnswer: 1,
        explanation:
          'A target market is a specific group of consumers that a business aims to reach with its marketing efforts.',
        xpReward: 15,
      },
      {
        question: 'What is branding?',
        options: [
          'Company logo only',
          'Creating a distinct identity and image for a product or company',
          'Product packaging',
          'Advertising campaigns',
        ],
        correctAnswer: 1,
        explanation:
          'Branding involves creating a unique identity that differentiates a product or company from competitors.',
        xpReward: 15,
      },
      {
        question: 'What is market research?',
        options: [
          'Selling market products',
          'Systematically gathering and analyzing information about markets and customers',
          'Creating new markets',
          'Researching competitors only',
        ],
        correctAnswer: 1,
        explanation:
          'Market research involves collecting and analyzing data about target markets, customers, and competitors.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Business Strategy',
    skillName: 'Operations Management',
    skillIcon: '⚙️',
    category: 'Business',
    difficulty: 'Beginner',
    description:
      'Learn how to manage business operations efficiently and effectively.',
    duration: '15 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is operations management?',
        options: [
          'Managing company finances',
          'Planning, organizing, and controlling business operations',
          'Marketing products',
          'Human resources',
        ],
        correctAnswer: 1,
        explanation:
          'Operations management involves designing, overseeing, and controlling business operations to ensure efficient production of goods and services.',
        xpReward: 15,
      },
      {
        question: 'What is supply chain management?',
        options: [
          'Managing retail stores',
          'Coordinating the flow of goods, services, and information from suppliers to customers',
          'Managing employee supplies',
          'Controlling inventory only',
        ],
        correctAnswer: 1,
        explanation:
          'Supply chain management oversees the entire process of producing and delivering goods to customers.',
        xpReward: 15,
      },
      {
        question: 'What is quality control?',
        options: [
          'Controlling product prices',
          'Ensuring products meet quality standards',
          'Managing production speed',
          'Controlling employee behavior',
        ],
        correctAnswer: 1,
        explanation:
          'Quality control involves monitoring and maintaining the quality of products or services throughout production.',
        xpReward: 15,
      },
      {
        question: 'What is inventory management?',
        options: [
          'Managing employee records',
          'Controlling stock levels and ordering supplies',
          'Managing financial inventories',
          'Tracking customer data',
        ],
        correctAnswer: 1,
        explanation:
          'Inventory management involves overseeing stock levels, ordering, storage, and tracking of goods.',
        xpReward: 15,
      },
      {
        question: 'What is lean manufacturing?',
        options: [
          'Manufacturing with few employees',
          'A methodology that focuses on minimizing waste and maximizing efficiency',
          'Manufacturing cheap products',
          'Manufacturing with minimal materials',
        ],
        correctAnswer: 1,
        explanation:
          'Lean manufacturing aims to eliminate waste and improve efficiency in production processes.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Business Strategy',
    skillName: 'Leadership & Management',
    skillIcon: '👔',
    category: 'Business',
    difficulty: 'Intermediate',
    description:
      'Develop essential leadership and management skills for effective team management.',
    duration: '20 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is the difference between leadership and management?',
        options: [
          'They are the same',
          'Leadership inspires and motivates, management organizes and controls',
          'Leadership is for executives only',
          'Management is more important',
        ],
        correctAnswer: 1,
        explanation:
          'Leadership focuses on vision and inspiration, while management focuses on planning, organizing, and controlling.',
        xpReward: 20,
      },
      {
        question: 'What is emotional intelligence?',
        options: [
          'Being emotional at work',
          'The ability to understand and manage emotions in oneself and others',
          'Having high IQ',
          'Being sensitive to criticism',
        ],
        correctAnswer: 1,
        explanation:
          'Emotional intelligence involves self-awareness, self-regulation, motivation, empathy, and social skills.',
        xpReward: 20,
      },
      {
        question: 'What is transformational leadership?',
        options: [
          'Changing company direction frequently',
          'Inspiring followers to achieve extraordinary outcomes',
          'Focusing on day-to-day operations',
          'Maintaining status quo',
        ],
        correctAnswer: 1,
        explanation:
          'Transformational leadership motivates followers to perform beyond expectations through inspiration and intellectual stimulation.',
        xpReward: 20,
      },
      {
        question: 'What is delegation?',
        options: [
          'Giving work to others without responsibility',
          'Assigning tasks and authority to team members',
          'Avoiding responsibility',
          'Doing all work yourself',
        ],
        correctAnswer: 1,
        explanation:
          'Delegation involves assigning tasks to others while providing the necessary authority and resources to complete them.',
        xpReward: 20,
      },
      {
        question: 'What is conflict resolution?',
        options: [
          'Avoiding all conflicts',
          'Finding solutions to disagreements that satisfy all parties',
          'Winning arguments',
          'Ignoring problems',
        ],
        correctAnswer: 1,
        explanation:
          'Conflict resolution involves addressing disagreements constructively to reach mutually beneficial solutions.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Business Strategy',
    skillName: 'Project Management',
    skillIcon: '📋',
    category: 'Business',
    difficulty: 'Intermediate',
    description:
      'Master project management methodologies and tools for successful project delivery.',
    duration: '22 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is project management?',
        options: [
          'Managing company projects only',
          'Planning, executing, and controlling projects to achieve specific goals',
          'Managing employee projects',
          'Creating project timelines',
        ],
        correctAnswer: 1,
        explanation:
          'Project management involves applying knowledge, skills, tools, and techniques to meet project requirements.',
        xpReward: 20,
      },
      {
        question: 'What are the triple constraints in project management?',
        options: [
          'Time, Cost, Scope',
          'Quality, Time, Cost',
          'Scope, Quality, Resources',
          'Time, Quality, Resources',
        ],
        correctAnswer: 0,
        explanation:
          'The triple constraints (iron triangle) are Time, Cost, and Scope - changes to one affect the others.',
        xpReward: 20,
      },
      {
        question: 'What is a Gantt chart?',
        options: [
          'A chart showing project costs',
          'A visual timeline showing project tasks and schedules',
          'A chart of team members',
          'A financial chart',
        ],
        correctAnswer: 1,
        explanation:
          'A Gantt chart is a bar chart that illustrates a project schedule, showing tasks, durations, and dependencies.',
        xpReward: 20,
      },
      {
        question: 'What is risk management?',
        options: [
          'Avoiding all risks',
          'Identifying, assessing, and controlling risks that could affect project success',
          'Ignoring potential problems',
          'Creating risk reports only',
        ],
        correctAnswer: 1,
        explanation:
          'Risk management involves proactively identifying potential issues and developing strategies to minimize their impact.',
        xpReward: 20,
      },
      {
        question: 'What is Agile methodology?',
        options: [
          'A rigid project approach',
          'An iterative approach to project management emphasizing flexibility and customer collaboration',
          'A traditional waterfall method',
          'A cost-cutting technique',
        ],
        correctAnswer: 1,
        explanation:
          'Agile is an iterative approach that emphasizes flexibility, collaboration, and rapid delivery of working software.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Business Strategy',
    skillName: 'Digital Transformation',
    skillIcon: '💻',
    category: 'Business',
    difficulty: 'Intermediate',
    description:
      'Navigate digital transformation and leverage technology for business growth.',
    duration: '25 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is digital transformation?',
        options: [
          'Buying new computers',
          'Fundamentally changing how businesses operate using digital technologies',
          'Creating a website',
          'Using social media',
        ],
        correctAnswer: 1,
        explanation:
          'Digital transformation involves using digital technologies to create new or modify existing business processes, culture, and customer experiences.',
        xpReward: 20,
      },
      {
        question: 'What is cloud computing?',
        options: [
          'Weather forecasting',
          'Delivering computing services over the internet',
          'Local data storage',
          'Physical servers',
        ],
        correctAnswer: 1,
        explanation:
          'Cloud computing provides on-demand access to computing resources without direct management by the user.',
        xpReward: 20,
      },
      {
        question: 'What is artificial intelligence in business?',
        options: [
          'Replacing all employees',
          'Using machines to perform tasks that typically require human intelligence',
          'Creating robots',
          'Automating simple tasks only',
        ],
        correctAnswer: 1,
        explanation:
          'AI involves machines performing tasks that usually require human intelligence, such as pattern recognition and decision-making.',
        xpReward: 20,
      },
      {
        question: 'What is data analytics?',
        options: [
          'Collecting data only',
          'Examining data to draw conclusions and make informed decisions',
          'Storing data',
          'Deleting old data',
        ],
        correctAnswer: 1,
        explanation:
          'Data analytics involves examining raw data to find patterns, draw conclusions, and support decision-making.',
        xpReward: 20,
      },
      {
        question: 'What is cybersecurity?',
        options: [
          'Creating computer viruses',
          'Protecting systems, networks, and data from digital attacks',
          'Hacking systems',
          'Ignoring security threats',
        ],
        correctAnswer: 1,
        explanation:
          'Cybersecurity involves protecting digital assets from unauthorized access, theft, or damage.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Business Strategy',
    skillName: 'Entrepreneurship',
    skillIcon: '🚀',
    category: 'Business',
    difficulty: 'Advanced',
    description:
      'Learn the essentials of starting and running a successful business venture.',
    duration: '28 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is entrepreneurship?',
        options: [
          'Working for a large company',
          'Creating and managing a business venture with financial risk',
          'Investing in stocks',
          'Managing personal finances',
        ],
        correctAnswer: 1,
        explanation:
          'Entrepreneurship involves identifying opportunities, creating businesses, and assuming financial risks to pursue those opportunities.',
        xpReward: 25,
      },
      {
        question: 'What is a business plan?',
        options: [
          'A daily schedule',
          'A document outlining business goals, strategies, and financial projections',
          'An employee handbook',
          'A marketing brochure',
        ],
        correctAnswer: 1,
        explanation:
          "A business plan is a comprehensive document that outlines a business's goals, strategies, market analysis, and financial projections.",
        xpReward: 25,
      },
      {
        question: 'What is a minimum viable product (MVP)?',
        options: [
          'The cheapest product possible',
          'A basic version of a product with enough features to satisfy early customers',
          'A prototype that costs minimum',
          'The smallest product in a lineup',
        ],
        correctAnswer: 1,
        explanation:
          'An MVP is the simplest version of a product that can be released to test market assumptions with minimal resources.',
        xpReward: 25,
      },
      {
        question: 'What is a pitch deck?',
        options: [
          'A presentation tool',
          'A visual presentation to attract investors and stakeholders',
          'A product catalog',
          'A financial report',
        ],
        correctAnswer: 1,
        explanation:
          'A pitch deck is a brief presentation that tells the story of a business to potential investors.',
        xpReward: 25,
      },
      {
        question: 'What is bootstrapping?',
        options: [
          'Starting a business with external funding',
          'Building a company using personal savings and revenue',
          'Getting loans from banks',
          'Crowdfunding campaigns',
        ],
        correctAnswer: 1,
        explanation:
          'Bootstrapping involves starting and growing a business using personal finances and business revenues, without external funding.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Business Strategy',
    skillName: 'Change Management',
    skillIcon: '🔄',
    category: 'Business',
    difficulty: 'Advanced',
    description:
      'Lead organizational change effectively and manage resistance to transformation.',
    duration: '30 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is change management?',
        options: [
          'Preventing all changes',
          'The approach to transitioning individuals and organizations from current to desired future states',
          'Managing daily changes only',
          'Changing management teams',
        ],
        correctAnswer: 1,
        explanation:
          'Change management is a structured approach to transitioning people, teams, and organizations from a current state to a desired future state.',
        xpReward: 25,
      },
      {
        question: 'What is organizational culture?',
        options: [
          'Company location',
          'The shared values, beliefs, and behaviors within an organization',
          'Company size',
          'Office layout',
        ],
        correctAnswer: 1,
        explanation:
          'Organizational culture encompasses the shared values, beliefs, attitudes, and behaviors that characterize a company.',
        xpReward: 25,
      },
      {
        question: 'What causes resistance to change?',
        options: [
          'Employee laziness',
          'Fear of the unknown, loss of control, and disruption of routines',
          'Lack of information',
          'Poor communication only',
        ],
        correctAnswer: 1,
        explanation:
          'Resistance to change often stems from fear of the unknown, concerns about job security, and disruption of established routines.',
        xpReward: 25,
      },
      {
        question: 'What is stakeholder analysis?',
        options: [
          'Analyzing company profits',
          'Identifying and assessing individuals or groups affected by organizational changes',
          'Analyzing competitors',
          'Financial analysis',
        ],
        correctAnswer: 1,
        explanation:
          'Stakeholder analysis identifies people affected by change and assesses their interests, influence, and potential impact.',
        xpReward: 25,
      },
      {
        question: 'What is a change management plan?',
        options: [
          'A plan to avoid change',
          'A structured approach outlining how change will be implemented',
          'A list of changes to make',
          'A timeline of changes',
        ],
        correctAnswer: 1,
        explanation:
          'A change management plan outlines the strategy, timeline, communication, and support needed to implement organizational changes.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Business Strategy',
    skillName: 'Strategic Innovation',
    skillIcon: '💡',
    category: 'Business',
    difficulty: 'Advanced',
    description:
      'Foster innovation and develop strategies for sustainable competitive advantage.',
    duration: '30 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is innovation?',
        options: [
          'Creating new ideas only',
          'The process of translating ideas into new products, services, or processes',
          'Copying competitors',
          'Making small improvements',
        ],
        correctAnswer: 1,
        explanation:
          'Innovation involves creating new value through the development and implementation of new ideas, products, or processes.',
        xpReward: 25,
      },
      {
        question: 'What is disruptive innovation?',
        options: [
          'Innovation that disrupts company operations',
          'Innovation that creates new markets by displacing established products',
          'Innovation that fails',
          'Any new technology',
        ],
        correctAnswer: 1,
        explanation:
          'Disruptive innovation creates new markets and value networks, eventually displacing established market leaders.',
        xpReward: 25,
      },
      {
        question: 'What is design thinking?',
        options: [
          'Thinking about product design',
          'A human-centered approach to innovation and problem-solving',
          'Graphic design principles',
          'Logical thinking only',
        ],
        correctAnswer: 1,
        explanation:
          'Design thinking is a methodology that provides a solution-based approach to solving problems with a focus on human needs.',
        xpReward: 25,
      },
      {
        question: 'What is a innovation ecosystem?',
        options: [
          'A garden for planting ideas',
          'A network of organizations, individuals, and resources that support innovation',
          "A single company's R&D department",
          'Innovation software tools',
        ],
        correctAnswer: 1,
        explanation:
          'An innovation ecosystem includes startups, corporations, universities, and government entities that collaborate on innovation.',
        xpReward: 25,
      },
      {
        question: 'What is intellectual property?',
        options: [
          'Smart employees',
          'Legal rights protecting creations of the mind',
          'Company patents only',
          'Trade secrets and copyrights',
        ],
        correctAnswer: 1,
        explanation:
          'Intellectual property includes patents, copyrights, trademarks, and trade secrets that protect creative and innovative work.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },

  // DESIGN LESSONS (10 lessons)
  {
    topic: 'Design Principles',
    skillName: 'Visual Design Basics',
    skillIcon: '🎨',
    category: 'Design',
    difficulty: 'Beginner',
    description:
      'Learn fundamental visual design principles including color, typography, and composition.',
    duration: '10 min',
    totalXP: 75,
    questions: [
      {
        question: 'What are the basic elements of design?',
        options: [
          'Line, shape, color, texture, space',
          'Paint, canvas, brushes, colors',
          'Software tools, computers, screens',
          'Rulers, pencils, paper',
        ],
        correctAnswer: 0,
        explanation:
          'The basic elements of design are line, shape/form, color, texture, and space - the building blocks of all visual compositions.',
        xpReward: 15,
      },
      {
        question: 'What is the color wheel?',
        options: [
          'A bicycle wheel',
          'A circular diagram showing color relationships',
          'A paint mixing tool',
          'A color printing device',
        ],
        correctAnswer: 1,
        explanation:
          'The color wheel is a circular diagram that shows the relationships between primary, secondary, and tertiary colors.',
        xpReward: 15,
      },
      {
        question: 'What is typography?',
        options: [
          'The study of typewriters',
          'The art and technique of arranging type to make written language readable and appealing',
          'Writing by hand',
          'Printing press operation',
        ],
        correctAnswer: 1,
        explanation:
          'Typography involves the design and use of typefaces, spacing, and layout to make text visually appealing and readable.',
        xpReward: 15,
      },
      {
        question: 'What is contrast in design?',
        options: [
          'Making everything the same',
          'The difference between elements to create visual interest',
          'Using similar colors',
          'Avoiding differences',
        ],
        correctAnswer: 1,
        explanation:
          'Contrast creates visual interest by using opposing elements like light/dark, large/small, or rough/smooth.',
        xpReward: 15,
      },
      {
        question: 'What is balance in composition?',
        options: [
          'Making designs heavier on one side',
          'The distribution of visual weight in a design',
          'Using scales to measure design',
          'Balancing design costs',
        ],
        correctAnswer: 1,
        explanation:
          'Balance refers to the distribution of visual elements to create a sense of equilibrium in a design.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Design Principles',
    skillName: 'UX/UI Design Fundamentals',
    skillIcon: '📱',
    category: 'Design',
    difficulty: 'Beginner',
    description:
      'Understand user experience and user interface design principles for digital products.',
    duration: '12 min',
    totalXP: 75,
    questions: [
      {
        question: 'What does UX stand for?',
        options: [
          'User Experience',
          'User Extension',
          'Universal Experience',
          'User Experiment',
        ],
        correctAnswer: 0,
        explanation:
          "UX stands for User Experience, which encompasses all aspects of a user's interaction with a product or service.",
        xpReward: 15,
      },
      {
        question: 'What does UI stand for?',
        options: [
          'User Interface',
          'User Interaction',
          'Universal Interface',
          'User Information',
        ],
        correctAnswer: 0,
        explanation:
          'UI stands for User Interface, referring to the visual elements users interact with in digital products.',
        xpReward: 15,
      },
      {
        question: 'What is a user persona?',
        options: [
          "A user's social media profile",
          'A fictional representation of a target user group',
          "A user's personal information",
          'A user interface element',
        ],
        correctAnswer: 1,
        explanation:
          'A user persona is a fictional character representing a user group, based on research and data about real users.',
        xpReward: 15,
      },
      {
        question: 'What is a wireframe?',
        options: [
          'An electrical diagram',
          'A low-fidelity blueprint of a digital interface',
          'A final design mockup',
          'A user flow diagram',
        ],
        correctAnswer: 1,
        explanation:
          'A wireframe is a basic visual guide that represents the skeletal framework of a website or application.',
        xpReward: 15,
      },
      {
        question: 'What is usability testing?',
        options: [
          'Testing software performance',
          'Evaluating how easily users can accomplish tasks with a product',
          'Testing visual appeal',
          'Testing technical functionality',
        ],
        correctAnswer: 1,
        explanation:
          'Usability testing involves observing real users as they attempt to complete tasks with a product to identify usability issues.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Design Principles',
    skillName: 'Graphic Design Tools',
    skillIcon: '🖌️',
    category: 'Design',
    difficulty: 'Beginner',
    description:
      'Master essential design tools and software for creating professional graphics.',
    duration: '15 min',
    totalXP: 75,
    questions: [
      {
        question: 'What is Adobe Photoshop primarily used for?',
        options: [
          'Writing code',
          'Photo editing and raster graphics',
          'Creating 3D models',
          'Writing documents',
        ],
        correctAnswer: 1,
        explanation:
          'Photoshop is a raster graphics editor used for photo editing, digital art, and graphic design.',
        xpReward: 15,
      },
      {
        question: 'What is Adobe Illustrator used for?',
        options: [
          'Photo editing',
          'Vector graphics and illustrations',
          'Video editing',
          '3D modeling',
        ],
        correctAnswer: 1,
        explanation:
          'Illustrator is a vector graphics editor used for creating logos, illustrations, and scalable graphics.',
        xpReward: 15,
      },
      {
        question: 'What is the difference between raster and vector graphics?',
        options: [
          'Vector is older technology',
          'Raster uses pixels (resolution-dependent), vector uses mathematical paths (scalable)',
          'Raster is for print, vector for web',
          'No real difference',
        ],
        correctAnswer: 1,
        explanation:
          'Raster graphics are made of pixels and can become pixelated when scaled, while vector graphics use mathematical paths and remain crisp at any size.',
        xpReward: 15,
      },
      {
        question: 'What is Figma?',
        options: [
          'A photo editor',
          'A collaborative interface design tool',
          'A video editor',
          'A 3D modeling software',
        ],
        correctAnswer: 1,
        explanation:
          'Figma is a web-based collaborative interface design tool used for creating user interfaces and prototypes.',
        xpReward: 15,
      },
      {
        question: 'What is a design system?',
        options: [
          'A single design tool',
          'A collection of reusable components, patterns, and guidelines',
          'A design education program',
          'A design competition',
        ],
        correctAnswer: 1,
        explanation:
          'A design system is a comprehensive guide of design standards, components, and patterns that ensure consistency across products.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Design Principles',
    skillName: 'Color Theory',
    skillIcon: '🌈',
    category: 'Design',
    difficulty: 'Beginner',
    description:
      'Master color theory and psychology to create effective and emotionally resonant designs.',
    duration: '15 min',
    totalXP: 75,
    questions: [
      {
        question: 'What are primary colors?',
        options: [
          'Red, blue, yellow',
          'Colors made by mixing other colors',
          'Pastel colors',
          'Earth tones',
        ],
        correctAnswer: 0,
        explanation:
          'Primary colors (red, blue, yellow) cannot be created by mixing other colors and are the foundation of all other colors.',
        xpReward: 15,
      },
      {
        question: 'What are complementary colors?',
        options: [
          'Colors that match perfectly',
          'Colors opposite each other on the color wheel that create contrast',
          'Colors from the same family',
          'Light and dark versions of the same color',
        ],
        correctAnswer: 1,
        explanation:
          'Complementary colors are located opposite each other on the color wheel and create strong visual contrast when used together.',
        xpReward: 15,
      },
      {
        question: 'What is color psychology?',
        options: [
          'The study of color blindness',
          'How colors affect human emotions and behavior',
          'The science of color mixing',
          'Color naming conventions',
        ],
        correctAnswer: 1,
        explanation:
          'Color psychology studies how colors influence human emotions, perceptions, and decision-making.',
        xpReward: 15,
      },
      {
        question: 'What does red typically symbolize?',
        options: [
          'Calm and peace',
          'Energy, passion, and urgency',
          'Growth and health',
          'Trust and reliability',
        ],
        correctAnswer: 1,
        explanation:
          'Red is associated with energy, passion, excitement, and can also convey urgency or danger.',
        xpReward: 15,
      },
      {
        question: 'What is color harmony?',
        options: [
          'Using only one color',
          'The pleasing arrangement of colors in a design',
          'Using bright colors only',
          'Avoiding color contrast',
        ],
        correctAnswer: 1,
        explanation:
          'Color harmony refers to the aesthetically pleasing combination of colors that work well together.',
        xpReward: 15,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Design Principles',
    skillName: 'Interaction Design',
    skillIcon: '👆',
    category: 'Design',
    difficulty: 'Intermediate',
    description:
      'Design intuitive interactions and user flows for digital products and services.',
    duration: '20 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is interaction design?',
        options: [
          'Designing physical products',
          'Designing the behavior of interactive systems',
          'Designing websites only',
          'Designing user interfaces',
        ],
        correctAnswer: 1,
        explanation:
          'Interaction design focuses on creating meaningful relationships between people and the products they use.',
        xpReward: 20,
      },
      {
        question: 'What is a user journey?',
        options: [
          'A travel itinerary',
          'The path a user takes to accomplish a goal',
          "A user's daily routine",
          'A website navigation menu',
        ],
        correctAnswer: 1,
        explanation:
          'A user journey maps out all the steps and touchpoints a user experiences when interacting with a product.',
        xpReward: 20,
      },
      {
        question: 'What is affordance in design?',
        options: [
          'The cost of design',
          'Visual cues that indicate how an object should be used',
          'Design complexity',
          'User preferences',
        ],
        correctAnswer: 1,
        explanation:
          'Affordance refers to the properties of an object that suggest how it can be used, like a button that looks pressable.',
        xpReward: 20,
      },
      {
        question: 'What is feedback in interaction design?',
        options: [
          'User complaints',
          'Visual or auditory responses that confirm user actions',
          'Design criticism',
          'User testing results',
        ],
        correctAnswer: 1,
        explanation:
          'Feedback provides users with information about the results of their actions, like button animations or success messages.',
        xpReward: 20,
      },
      {
        question: 'What is a microinteraction?',
        options: [
          'A small conversation',
          'A contained moment of user interaction with a single use case',
          'A tiny design element',
          'A brief user test',
        ],
        correctAnswer: 1,
        explanation:
          'Microinteractions are small, focused interactions that accomplish a single task, like liking a post or toggling a switch.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Design Principles',
    skillName: 'Responsive Design',
    skillIcon: '📐',
    category: 'Design',
    difficulty: 'Intermediate',
    description:
      'Create designs that work seamlessly across all devices and screen sizes.',
    duration: '22 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is responsive design?',
        options: [
          'Design that responds to user feedback',
          'Design that adapts to different screen sizes and devices',
          'Design that changes colors',
          'Design that loads quickly',
        ],
        correctAnswer: 1,
        explanation:
          'Responsive design ensures websites and applications adapt their layout and content to different screen sizes and devices.',
        xpReward: 20,
      },
      {
        question: 'What is a breakpoint in responsive design?',
        options: [
          'A design flaw',
          'A specific screen width where the layout changes',
          'A loading delay',
          'A user interaction point',
        ],
        correctAnswer: 1,
        explanation:
          'Breakpoints are specific screen widths where the design layout adjusts to provide optimal viewing on different devices.',
        xpReward: 20,
      },
      {
        question: 'What is mobile-first design?',
        options: [
          'Designing for phones before computers',
          'Starting design with mobile screens and scaling up',
          'Designing mobile apps only',
          'Prioritizing mobile users',
        ],
        correctAnswer: 1,
        explanation:
          'Mobile-first design starts with the smallest screen size and progressively enhances the design for larger screens.',
        xpReward: 20,
      },
      {
        question: 'What is a media query?',
        options: [
          'A question about media content',
          'CSS code that applies styles based on device characteristics',
          'A user survey',
          'A content strategy',
        ],
        correctAnswer: 1,
        explanation:
          'Media queries allow CSS to adapt styles based on device properties like screen width, height, and orientation.',
        xpReward: 20,
      },
      {
        question: 'What is progressive enhancement?',
        options: [
          'Gradually improving design quality',
          'Starting with basic functionality and adding advanced features for capable devices',
          'Making designs more complex over time',
          'Enhancing user progress tracking',
        ],
        correctAnswer: 1,
        explanation:
          'Progressive enhancement builds a basic experience that works for all users, then adds enhancements for more capable devices.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Design Principles',
    skillName: 'Design Systems',
    skillIcon: '📚',
    category: 'Design',
    difficulty: 'Intermediate',
    description:
      'Build and maintain scalable design systems for consistent user experiences.',
    duration: '25 min',
    totalXP: 100,
    questions: [
      {
        question: 'What is a design system?',
        options: [
          'A single design tool',
          'A comprehensive set of design standards, components, and guidelines',
          'A design education curriculum',
          'A collection of design software',
        ],
        correctAnswer: 1,
        explanation:
          'A design system is a centralized collection of reusable components, patterns, and guidelines that ensure design consistency.',
        xpReward: 20,
      },
      {
        question: 'What are design tokens?',
        options: [
          'Cryptocurrency for designers',
          'Named entities that store visual design attributes',
          'Design contest prizes',
          'User authentication tokens',
        ],
        correctAnswer: 1,
        explanation:
          'Design tokens are the smallest pieces of a design system, storing values like colors, spacing, and typography as reusable variables.',
        xpReward: 20,
      },
      {
        question: 'What is component documentation?',
        options: [
          'Writing about design history',
          'Detailed guides explaining how to use design components',
          'Legal documents for design',
          'User manuals for software',
        ],
        correctAnswer: 1,
        explanation:
          'Component documentation provides usage guidelines, code examples, and best practices for design system components.',
        xpReward: 20,
      },
      {
        question: 'What is design system governance?',
        options: [
          'Government control of design',
          'Processes and guidelines for maintaining design system consistency',
          'Design copyright laws',
          'Quality control procedures',
        ],
        correctAnswer: 1,
        explanation:
          'Design system governance establishes rules, processes, and responsibilities for maintaining and evolving the design system.',
        xpReward: 20,
      },
      {
        question: 'What is a component library?',
        options: [
          'A library of design books',
          'A collection of reusable UI components with their code and documentation',
          'A software library for designers',
          'A collection of design patterns',
        ],
        correctAnswer: 1,
        explanation:
          'A component library contains all the reusable UI components of a design system, including their code implementations.',
        xpReward: 20,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Design Principles',
    skillName: 'Motion Design',
    skillIcon: '🎭',
    category: 'Design',
    difficulty: 'Advanced',
    description:
      'Create engaging animations and micro-interactions that enhance user experience.',
    duration: '28 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is motion design?',
        options: [
          'Designing physical movement',
          'Using animation to enhance user interfaces and experiences',
          'Designing exercise programs',
          'Creating moving graphics',
        ],
        correctAnswer: 1,
        explanation:
          'Motion design uses animation principles to create meaningful movement in digital interfaces that guides users and provides feedback.',
        xpReward: 25,
      },
      {
        question: 'What is easing in animation?',
        options: [
          'Making animations slower',
          'The acceleration and deceleration of motion to make it more natural',
          'Simplifying animations',
          'Removing animation effects',
        ],
        correctAnswer: 1,
        explanation:
          'Easing controls the acceleration and deceleration of animations to create more natural, lifelike motion.',
        xpReward: 25,
      },
      {
        question: 'What is a transition in UI design?',
        options: [
          'Changing design jobs',
          'The animation between different states of an interface element',
          'Moving between pages',
          'User onboarding process',
        ],
        correctAnswer: 1,
        explanation:
          'Transitions are animations that occur when an element changes from one state to another, like a button hover effect.',
        xpReward: 25,
      },
      {
        question: 'What is the 12 principles of animation?',
        options: [
          'Disney animation rules',
          'Fundamental principles created by Disney animators for realistic movement',
          'Modern animation software features',
          'Animation timing guidelines',
        ],
        correctAnswer: 1,
        explanation:
          'The 12 principles of animation are fundamental guidelines for creating lifelike and appealing animation, developed by Disney animators.',
        xpReward: 25,
      },
      {
        question: 'What is a loading animation?',
        options: [
          'An animation that loads content',
          'Visual feedback indicating that content is being loaded',
          'An animation tutorial',
          'A progress indicator',
        ],
        correctAnswer: 1,
        explanation:
          'Loading animations provide visual feedback to users during wait times, making the experience feel faster and more engaging.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Design Principles',
    skillName: 'Accessibility Design',
    skillIcon: '♿',
    category: 'Design',
    difficulty: 'Advanced',
    description:
      'Design inclusive experiences that work for users with diverse abilities and needs.',
    duration: '30 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is web accessibility?',
        options: [
          'Making websites accessible only to certain users',
          'Designing websites and digital content usable by people with disabilities',
          'Website security',
          'Making websites load faster',
        ],
        correctAnswer: 1,
        explanation:
          'Web accessibility ensures that websites and digital content are usable by people with various disabilities, including visual, motor, and cognitive impairments.',
        xpReward: 25,
      },
      {
        question: 'What does WCAG stand for?',
        options: [
          'Web Content Accessibility Guidelines',
          'Worldwide Content Accessibility Group',
          'Web Compliance Accessibility Guide',
          'World Content Accessibility Guidelines',
        ],
        correctAnswer: 0,
        explanation:
          'WCAG (Web Content Accessibility Guidelines) are internationally recognized standards for web accessibility.',
        xpReward: 25,
      },
      {
        question: 'What is alt text?',
        options: [
          'Alternative text for images',
          'Text that describes images for screen readers and when images fail to load',
          'Backup text for websites',
          'Alternative website content',
        ],
        correctAnswer: 1,
        explanation:
          'Alt text provides textual descriptions of images, making content accessible to users with visual impairments and improving SEO.',
        xpReward: 25,
      },
      {
        question: 'What is color contrast?',
        options: [
          'Using many different colors',
          'The difference in brightness between text and background colors',
          'Color psychology',
          'Color theory application',
        ],
        correctAnswer: 1,
        explanation:
          'Color contrast ensures that text is readable against its background, particularly important for users with visual impairments.',
        xpReward: 25,
      },
      {
        question: 'What is keyboard navigation?',
        options: [
          'Typing on a keyboard',
          'The ability to navigate websites using only a keyboard, without a mouse',
          'Keyboard shortcuts',
          'Text input methods',
        ],
        correctAnswer: 1,
        explanation:
          'Keyboard navigation allows users to access all website functionality using only keyboard inputs, essential for users with motor disabilities.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
  {
    topic: 'Design Principles',
    skillName: 'Design Leadership',
    skillIcon: '👑',
    category: 'Design',
    difficulty: 'Advanced',
    description:
      'Lead design teams and establish design culture within organizations.',
    duration: '30 min',
    totalXP: 125,
    questions: [
      {
        question: 'What is design leadership?',
        options: [
          'Being the best designer',
          'Leading design teams and integrating design into business strategy',
          'Managing design projects',
          'Teaching design skills',
        ],
        correctAnswer: 1,
        explanation:
          'Design leadership involves guiding design teams, advocating for design in business decisions, and building design culture within organizations.',
        xpReward: 25,
      },
      {
        question: 'What is design thinking?',
        options: [
          'Thinking about design aesthetics',
          'A human-centered approach to problem-solving and innovation',
          'Logical design processes',
          'Creative thinking techniques',
        ],
        correctAnswer: 1,
        explanation:
          "Design thinking is a methodology that uses designer's sensibility and methods to match people's needs with what is technologically feasible.",
        xpReward: 25,
      },
      {
        question: 'What is a design brief?',
        options: [
          'A short design presentation',
          'A document outlining project goals, requirements, and constraints',
          'A design contract',
          'A design portfolio',
        ],
        correctAnswer: 1,
        explanation:
          'A design brief is a document that clearly outlines the project objectives, target audience, requirements, and success criteria.',
        xpReward: 25,
      },
      {
        question: 'What is stakeholder management in design?',
        options: [
          'Managing design team members',
          'Identifying and engaging people affected by design decisions',
          'Managing design budgets',
          'Managing design tools',
        ],
        correctAnswer: 1,
        explanation:
          'Stakeholder management involves identifying, understanding, and engaging all parties affected by or affecting design decisions.',
        xpReward: 25,
      },
      {
        question: 'What is design culture?',
        options: [
          'A collection of design artifacts',
          'The shared values, beliefs, and practices around design within an organization',
          'Design team traditions',
          'Design office decor',
        ],
        correctAnswer: 1,
        explanation:
          'Design culture encompasses the organizational values, processes, and behaviors that support design thinking and innovation.',
        xpReward: 25,
      },
    ],
    isFullyGenerated: true,
    placeholder: false,
  },
];
