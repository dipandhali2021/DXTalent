import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Zap, Clock, TrendingUp, Award, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';

const lessonsData = [
  {
    id: 1,
    title: 'Marketing Fundamentals',
    category: 'Marketing',
    description:
      'Learn the core principles of modern marketing including content strategy, SEO, and social media.',
    difficulty: 'Beginner',
    duration: '15 min',
    xp: 100,
    lessons: 12,
    icon: '🎨',
  },
  {
    id: 2,
    title: 'Advanced TypeScript Patterns',
    category: 'Development',
    description:
      'Master advanced TypeScript concepts including generics, utility types, and decorators.',
    difficulty: 'Advanced',
    duration: '25 min',
    xp: 200,
    lessons: 18,
    icon: '💻',
  },
  {
    id: 3,
    title: 'Data Analytics Basics',
    category: 'Data',
    description:
      'Introduction to data analysis, visualization, and interpretation for business insights.',
    difficulty: 'Beginner',
    duration: '20 min',
    xp: 150,
    lessons: 15,
    icon: '📊',
  },
  {
    id: 4,
    title: 'Business Strategy 101',
    category: 'Business',
    description:
      'Learn fundamental business strategy concepts, SWOT analysis, and competitive positioning.',
    difficulty: 'Intermediate',
    duration: '18 min',
    xp: 120,
    lessons: 10,
    icon: '💼',
  },
  {
    id: 5,
    title: 'React Performance Optimization',
    category: 'Development',
    description:
      'Optimize your React apps with memoization, lazy loading, and code splitting techniques.',
    difficulty: 'Advanced',
    duration: '30 min',
    xp: 250,
    lessons: 20,
    icon: '⚛️',
  },
  {
    id: 6,
    title: 'Social Media Marketing',
    category: 'Marketing',
    description:
      'Master Instagram, LinkedIn, and TikTok marketing strategies for maximum engagement.',
    difficulty: 'Intermediate',
    duration: '22 min',
    xp: 180,
    lessons: 16,
    icon: '📱',
  },
  {
    id: 7,
    title: 'SQL for Data Science',
    category: 'Data',
    description:
      'Learn SQL queries, joins, aggregations, and window functions for data analysis.',
    difficulty: 'Intermediate',
    duration: '28 min',
    xp: 200,
    lessons: 22,
    icon: '🗄️',
  },
  {
    id: 8,
    title: 'Product Management Essentials',
    category: 'Business',
    description:
      'Learn product lifecycle, roadmapping, and stakeholder management for PMs.',
    difficulty: 'Beginner',
    duration: '20 min',
    xp: 140,
    lessons: 14,
    icon: '📦',
  },
];

const categories = ['All', 'Marketing', 'Development', 'Data', 'Business'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const LessonsLibrary = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const filteredLessons = lessonsData.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || lesson.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' || lesson.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <DashboardHeader role="user" />

      {/* Subheader with back button + title */}
      <div className="border-b-[3px] border-border bg-card"></div>
    
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="font-handwritten text-4xl font-bold mb-4 rotate-[-1deg] inline-block">
            Explore Lessons 📚
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our curated collection of lessons to level up your
            digital skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 brutal-border"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                className="font-handwritten"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {difficulties.map((difficulty) => (
              <Badge
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`cursor-pointer brutal-border px-4 py-2 ${
                  selectedDifficulty === difficulty
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {difficulty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            Showing{' '}
            <span className="font-handwritten font-bold text-foreground">
              {filteredLessons.length}
            </span>{' '}
            lessons
          </p>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => (
            <Card
              key={lesson.id}
              className={`brutal-border brutal-shadow hover:shadow-brutal-hover hover:-translate-y-1 transition-all cursor-pointer ${
                index % 3 === 0
                  ? 'rotate-playful-1'
                  : index % 3 === 1
                  ? 'rotate-playful-2'
                  : 'rotate-playful-3'
              }`}
              onClick={() => navigate('/lesson')}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="text-5xl">{lesson.icon}</div>
                  <Badge
                    className={`brutal-border ${getDifficultyColor(
                      lesson.difficulty
                    )}`}
                  >
                    {lesson.difficulty}
                  </Badge>
                </div>
                <CardTitle className="font-handwritten text-xl">
                  {lesson.title}
                </CardTitle>
                <CardDescription className="font-handwritten">
                  {lesson.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {lesson.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-muted brutal-border px-2 py-2 text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <span className="text-xs font-handwritten font-bold">
                      {lesson.duration}
                    </span>
                  </div>
                  <div className="bg-accent/10 brutal-border px-2 py-2 text-center">
                    <Zap className="w-4 h-4 mx-auto mb-1 text-accent" />
                    <span className="text-xs font-handwritten font-bold">
                      {lesson.xp} XP
                    </span>
                  </div>
                  <div className="bg-primary/10 brutal-border px-2 py-2 text-center">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <span className="text-xs font-handwritten font-bold">
                      {lesson.lessons}
                    </span>
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No lessons found matching your criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonsLibrary;
