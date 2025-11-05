import { useState, useEffect } from 'react';
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
import {
  Search,
  Zap,
  Clock,
  TrendingUp,
  Loader2,
  Sparkles,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import GenerateLessonDialog from '@/components/GenerateLessonDialog';
import { lessonAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  _id: string;
  topic?: string;
  skillName: string;
  skillIcon: string;
  category: string;
  description: string;
  difficulty: string;
  duration: string;
  totalXP: number;
  isFullyGenerated: boolean;
  placeholder: boolean;
}

interface TopicCategory {
  topic: string;
  icon: string;
  category: string;
  difficulty: string;
  totalLessons: number;
  generatedLessons: number;
  totalDuration: number;
  totalXP: number;
  lessons: Lesson[];
}

const categories = [
  'All',
  'Marketing',
  'Development',
  'Data',
  'Business',
  'Design',
  'Other',
];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const LessonsLibrary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topicCategories, setTopicCategories] = useState<TopicCategory[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  // Group lessons by their topic (derived from similar skillNames)
  const groupLessonsByTopic = (lessonsList: Lesson[]): TopicCategory[] => {
    const topicsMap = new Map<string, Lesson[]>();

    // Group lessons by topic field first, fallback to category
    lessonsList.forEach((lesson) => {
      const topicKey = lesson.topic || lesson.category;

      if (!topicsMap.has(topicKey)) {
        topicsMap.set(topicKey, []);
      }
      topicsMap.get(topicKey)!.push(lesson);
    });

    // Convert map to TopicCategory array
    const categories: TopicCategory[] = Array.from(topicsMap.entries()).map(
      ([topic, topicLessons]) => {
        const generatedCount = topicLessons.filter(
          (l) => l.isFullyGenerated
        ).length;
        const totalDuration = topicLessons.reduce((sum, l) => {
          const mins = parseInt(l.duration) || 0;
          return sum + mins;
        }, 0);
        const totalXP = topicLessons.reduce((sum, l) => sum + l.totalXP, 0);

        return {
          topic,
          icon: topicLessons[0]?.skillIcon || '📚',
          category: topicLessons[0]?.category || 'Other',
          difficulty: topicLessons[0]?.difficulty || 'Beginner',
          totalLessons: topicLessons.length,
          generatedLessons: generatedCount,
          totalDuration,
          totalXP,
          lessons: topicLessons,
        };
      }
    );

    return categories;
  };

  // Fetch lessons from API
  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      const response = await lessonAPI.getUserLessons();
      if (response.success) {
        setLessons(response.data);
        const grouped = groupLessonsByTopic(response.data);
        setTopicCategories(grouped);
      }
    } catch (error: any) {
      console.error('Error fetching lessons:', error);
      toast({
        title: 'Failed to load lessons',
        description: error.response?.data?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // Generate placeholder content
  const handleGeneratePlaceholder = async (
    lessonId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent card click
    setIsGenerating(lessonId);

    try {
      const response = await lessonAPI.generatePlaceholderContent(lessonId);
      if (response.success) {
        toast({
          title: 'Lesson generated! 🎉',
          description: 'Your lesson is now ready to take.',
        });
        // Refresh lessons
        fetchLessons();
      }
    } catch (error: any) {
      console.error('Error generating placeholder:', error);
      toast({
        title: 'Generation failed',
        description: error.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(null);
    }
  };

  // Handle lesson click
  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.placeholder && !lesson.isFullyGenerated) {
      toast({
        title: 'Lesson not ready',
        description: 'Please generate this lesson first.',
        variant: 'destructive',
      });
      return;
    }
    navigate(`/lesson/${lesson._id}`);
  };

  // Handle topic category click
  const handleTopicClick = (topic: TopicCategory) => {
    setSelectedTopic(topic);
  };

  // Go back to topic view
  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };

  const filteredTopics = topicCategories.filter((topic) => {
    const matchesSearch = topic.topic
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' || topic.difficulty === selectedDifficulty;

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
          {selectedTopic ? (
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToTopics}
                className="brutal-border"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Topics
              </Button>
              <div>
                <h2 className="font-handwritten text-4xl font-bold rotate-[-1deg] inline-block">
                  {selectedTopic.icon} {selectedTopic.topic}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {selectedTopic.generatedLessons} of{' '}
                  {selectedTopic.totalLessons} lessons ready
                </p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-handwritten text-4xl font-bold mb-4 rotate-[-1deg] inline-block">
                Explore Lessons 📚
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose from our curated collection of lessons to level up your
                digital skills
              </p>
            </>
          )}
        </div>

        {/* Search and Filters - Only show when viewing topics */}
        {!selectedTopic && (
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search topics..."
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
                  variant={
                    selectedCategory === category ? 'default' : 'outline'
                  }
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
        )}

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          {selectedTopic ? (
            <p className="text-muted-foreground">
              Showing{' '}
              <span className="font-handwritten font-bold text-foreground">
                {selectedTopic.lessons.length}
              </span>{' '}
              lessons in {selectedTopic.topic}
            </p>
          ) : (
            <p className="text-muted-foreground">
              Showing{' '}
              <span className="font-handwritten font-bold text-foreground">
                {isLoading ? '...' : filteredTopics.length}
              </span>{' '}
              topics
            </p>
          )}
          <GenerateLessonDialog onLessonsGenerated={fetchLessons} />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your lessons...</p>
          </div>
        ) : selectedTopic ? (
          // Individual Lessons View
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedTopic.lessons.map((lesson, index) => (
                <Card
                  key={lesson._id}
                  className={`brutal-border brutal-shadow hover:shadow-brutal-hover hover:-translate-y-1 transition-all cursor-pointer ${
                    index % 3 === 0
                      ? 'rotate-playful-1'
                      : index % 3 === 1
                      ? 'rotate-playful-2'
                      : 'rotate-playful-3'
                  }`}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-5xl">{lesson.skillIcon}</div>
                      <div className="flex flex-col gap-1">
                        <Badge
                          className={`brutal-border ${getDifficultyColor(
                            lesson.difficulty
                          )}`}
                        >
                          {lesson.difficulty}
                        </Badge>
                        {lesson.placeholder && !lesson.isFullyGenerated && (
                          <Badge
                            variant="outline"
                            className="brutal-border text-xs"
                          >
                            Placeholder
                          </Badge>
                        )}
                        {lesson.isFullyGenerated && (
                          <Badge className="brutal-border text-xs bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Ready
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="font-handwritten text-xl">
                      {lesson.skillName}
                    </CardTitle>
                    <CardDescription className="font-handwritten">
                      {lesson.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {lesson.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-muted brutal-border px-2 py-2 text-center">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <span className="text-xs font-handwritten font-bold">
                          {lesson.duration}
                        </span>
                      </div>
                      <div className="bg-accent/10 brutal-border px-2 py-2 text-center">
                        <Zap className="w-4 h-4 mx-auto mb-1 text-accent" />
                        <span className="text-xs font-handwritten font-bold">
                          {lesson.totalXP} XP
                        </span>
                      </div>
                    </div>

                    {lesson.placeholder && !lesson.isFullyGenerated ? (
                      <Button
                        className="w-full"
                        size="sm"
                        variant="outline"
                        onClick={(e) =>
                          handleGeneratePlaceholder(lesson._id, e)
                        }
                        disabled={isGenerating === lesson._id}
                      >
                        {isGenerating === lesson._id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Lesson
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button className="w-full" size="sm">
                        Start Learning
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          // Topic Categories View
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic, index) => (
                <Card
                  key={topic.topic}
                  className={`brutal-border brutal-shadow hover:shadow-brutal-hover hover:-translate-y-1 transition-all cursor-pointer ${
                    index % 3 === 0
                      ? 'rotate-playful-1'
                      : index % 3 === 1
                      ? 'rotate-playful-2'
                      : 'rotate-playful-3'
                  }`}
                  onClick={() => handleTopicClick(topic)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-6xl">{topic.icon}</div>
                      <div className="flex flex-col gap-1">
                        <Badge
                          className={`brutal-border ${getDifficultyColor(
                            topic.difficulty
                          )}`}
                        >
                          {topic.difficulty}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="brutal-border text-xs"
                        >
                          {topic.category}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="font-handwritten text-2xl">
                      {topic.topic}
                    </CardTitle>
                    <CardDescription className="font-handwritten">
                      {topic.totalLessons} lessons available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-handwritten text-muted-foreground">
                            Progress
                          </span>
                          <span className="text-xs font-handwritten font-bold">
                            {topic.generatedLessons}/{topic.totalLessons}
                          </span>
                        </div>
                        <div className="h-2 bg-muted brutal-border overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${
                                (topic.generatedLessons / topic.totalLessons) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted brutal-border px-2 py-2 text-center">
                          <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                          <span className="text-xs font-handwritten font-bold">
                            {topic.totalDuration} min
                          </span>
                        </div>
                        <div className="bg-accent/10 brutal-border px-2 py-2 text-center">
                          <Zap className="w-4 h-4 mx-auto mb-1 text-accent" />
                          <span className="text-xs font-handwritten font-bold">
                            {topic.totalXP} XP
                          </span>
                        </div>
                      </div>

                      <Button className="w-full" size="sm">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Lessons
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredTopics.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">
                  {topicCategories.length === 0
                    ? 'No lessons yet. Generate your first lesson!'
                    : 'No topics found matching your criteria'}
                </p>
                {topicCategories.length === 0 ? (
                  <GenerateLessonDialog onLessonsGenerated={fetchLessons} />
                ) : (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedDifficulty('All');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonsLibrary;
