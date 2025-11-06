import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  FileText,
  RefreshCw,
  Award,
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
  isDefault?: boolean;
  completionStatus?: {
    isCompleted: boolean;
    completionCount: number;
    bestScore?: {
      accuracy: number;
      correctAnswers: number;
      totalQuestions: number;
    };
    lastCompletionDate?: string;
  };
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
  const [showDefaultLessons, setShowDefaultLessons] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [topicCategories, setTopicCategories] = useState<TopicCategory[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isGeneratingTest, setIsGeneratingTest] = useState<string | null>(null);

  // Test options dialog state
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [testDialogData, setTestDialogData] = useState<{
    lesson: Lesson;
    hasPassed: boolean;
    totalAttempts: number;
    bestScore: any;
  } | null>(null);

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
        const creditsRemaining = response.creditsRemaining;
        toast({
          title: 'Lesson generated! 🎉',
          description: `Your lesson is now ready to take. Used 0.5 credit. ${creditsRemaining} credits remaining.`,
        });
        // Refresh lessons
        fetchLessons();
      }
    } catch (error: any) {
      console.error('Error generating placeholder:', error);
      const errorData = error.response?.data?.data;
      const errorMessage = error.response?.data?.message;

      if (
        errorData &&
        errorData.required &&
        errorData.available !== undefined
      ) {
        toast({
          title: 'Insufficient credits',
          description: `Need ${
            errorData.required
          } credit but only ${errorData.available.toFixed(1)} available. ${
            errorData.upgradeMessage
          }`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Generation failed',
          description: errorMessage || 'Please try again.',
          variant: 'destructive',
        });
      }
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

  // Handle take test click
  const handleTakeTest = async (
    lessonOrTopic: Lesson | TopicCategory,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent card click

    // If it's a topic, get the first ready lesson
    let lesson: Lesson;
    if ('lessons' in lessonOrTopic) {
      // It's a TopicCategory
      const readyLesson = lessonOrTopic.lessons.find((l) => l.isFullyGenerated);
      if (!readyLesson) {
        toast({
          title: 'No lessons ready',
          description:
            'Please generate at least one lesson in this topic before taking the test.',
          variant: 'destructive',
        });
        return;
      }
      lesson = readyLesson;
    } else {
      // It's a Lesson
      lesson = lessonOrTopic;
      if (lesson.placeholder && !lesson.isFullyGenerated) {
        toast({
          title: 'Lesson not ready',
          description:
            'Please generate this lesson first before taking the test.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsGeneratingTest(lesson._id);

    try {
      // Check test status first
      const statusResponse = await lessonAPI.getTestStatus(lesson._id);

      if (statusResponse.success && statusResponse.data.hasTest) {
        const { hasPassed, totalAttempts, bestScore } = statusResponse.data;

        // Show dialog with options
        setTestDialogData({
          lesson,
          hasPassed,
          totalAttempts,
          bestScore,
        });
        setShowTestDialog(true);
        setIsGeneratingTest(null);
        return;
      }

      // No existing test, generate new one
      await generateAndStartTest(lesson, false);
    } catch (error: any) {
      console.error('Error checking test status:', error);
      toast({
        title: 'Error',
        description: 'Failed to check test status. Please try again.',
        variant: 'destructive',
      });
      setIsGeneratingTest(null);
    }
  };

  // Generate and start test
  const generateAndStartTest = async (lesson: Lesson, forceNew: boolean) => {
    setIsGeneratingTest(lesson._id);
    setShowTestDialog(false);

    try {
      const response = await lessonAPI.generateTest(lesson._id, 20, forceNew);
      if (response.success) {
        const creditsUsed = response.creditsUsed || 0;
        const creditsRemaining = response.creditsRemaining;
        const isFirstTest = response.isFirstTest;

        let xpMessage = response.data.isNewTest
          ? 'New test generated! Pass for 100 XP!'
          : response.data.totalAttempts > 0 && response.data.bestScore
          ? 'Retaking test - earn 20 XP!'
          : 'Your test is ready. Good luck!';

        // Add credit info to message
        if (isFirstTest) {
          xpMessage += ' First test is free!';
        } else if (creditsUsed > 0) {
          xpMessage += ` Used ${creditsUsed} credit. ${creditsRemaining} credits remaining.`;
        }

        toast({
          title: 'Test generated! 📝',
          description: xpMessage,
        });

        // Navigate to test page with test data
        navigate('/test', {
          state: {
            testData: response.data,
            testId: response.data.testId,
          },
        });
      }
    } catch (error: any) {
      console.error('Error generating test:', error);
      const errorData = error.response?.data?.data;
      const errorMessage = error.response?.data?.message;

      if (
        errorData &&
        errorData.required &&
        errorData.available !== undefined
      ) {
        toast({
          title: 'Insufficient credits',
          description: `Need ${
            errorData.required
          } credit but only ${errorData.available.toFixed(1)} available. ${
            errorData.upgradeMessage
          }`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Test generation failed',
          description: errorMessage || 'Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsGeneratingTest(null);
    }
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

    // Filter by default lessons toggle
    const matchesDefaultFilter = showDefaultLessons
      ? true
      : topic.lessons.some((lesson) => !lesson.isDefault);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDifficulty &&
      matchesDefaultFilter
    );
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

            {/* Default Lessons Toggle */}
            <div className="flex justify-center">
              <Button
                onClick={() => setShowDefaultLessons(!showDefaultLessons)}
                variant={showDefaultLessons ? 'default' : 'outline'}
                size="sm"
                className="font-handwritten brutal-border px-6 py-2"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {showDefaultLessons
                  ? 'Showing All Lessons'
                  : 'Showing My Lessons'}
              </Button>
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
          {!selectedTopic && (
            <GenerateLessonDialog onLessonsGenerated={fetchLessons} />
          )}
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
              {selectedTopic.lessons
                .filter((lesson) => showDefaultLessons || !lesson.isDefault)
                .map((lesson, index) => (
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
                          {lesson.completionStatus?.isCompleted && (
                            <Badge className="brutal-border text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completed{' '}
                              {lesson.completionStatus.completionCount}x
                            </Badge>
                          )}
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

                      {/* Show best score if completed */}
                      {lesson.completionStatus?.isCompleted &&
                        lesson.completionStatus.bestScore && (
                          <div className="bg-blue-50 dark:bg-blue-900/10 brutal-border p-2 mb-3 text-center">
                            <p className="text-xs text-muted-foreground mb-1">
                              Best Score
                            </p>
                            <p className="text-sm font-handwritten font-bold text-blue-700 dark:text-blue-400">
                              {lesson.completionStatus.bestScore.accuracy}% (
                              {lesson.completionStatus.bestScore.correctAnswers}
                              /
                              {lesson.completionStatus.bestScore.totalQuestions}
                              )
                            </p>
                          </div>
                        )}

                      {lesson.placeholder && !lesson.isFullyGenerated ? (
                        <div className="space-y-2">
                          <div className="text-xs text-center text-muted-foreground font-handwritten">
                            💳 Cost: 0.5 credit
                          </div>
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
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          size="sm"
                          variant={
                            lesson.completionStatus?.isCompleted
                              ? 'outline'
                              : 'default'
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLessonClick(lesson);
                          }}
                        >
                          {lesson.completionStatus?.isCompleted ? (
                            <>
                              <BookOpen className="mr-2 h-4 w-4" />
                              Retake (10 XP)
                            </>
                          ) : (
                            <>
                              <BookOpen className="mr-2 h-4 w-4" />
                              Start Learning
                            </>
                          )}
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

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          className="w-full"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTopicClick(topic);
                          }}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Lessons
                        </Button>
                        <Button
                          className="w-full"
                          size="sm"
                          variant="secondary"
                          onClick={(e) => handleTakeTest(topic, e)}
                          disabled={
                            isGeneratingTest !== null ||
                            !topic.lessons.some((l) => l.isFullyGenerated)
                          }
                        >
                          {isGeneratingTest !== null ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <FileText className="mr-2 h-4 w-4" />
                              Take Test
                            </>
                          )}
                        </Button>
                      </div>
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
                      setShowDefaultLessons(true);
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

      {/* Test Options Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="brutal-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-handwritten text-2xl flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Test Options
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              {testDialogData?.hasPassed ? (
                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    🎉 You've passed this test before!
                  </p>
                  <div className="bg-accent/10 brutal-border p-3 rounded">
                    <p className="text-sm">
                      <span className="font-bold">Best Score:</span>{' '}
                      {testDialogData.bestScore?.accuracy}%
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">Total Attempts:</span>{' '}
                      {testDialogData.totalAttempts}
                    </p>
                  </div>
                </div>
              ) : (
                <p>
                  You've attempted this test {testDialogData?.totalAttempts}{' '}
                  time(s).
                  {testDialogData?.totalAttempts &&
                  testDialogData.totalAttempts > 0
                    ? ' Keep trying or try new questions!'
                    : ' Choose your test option below.'}
                </p>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {/* Retake Same Test Option */}
            <button
              onClick={() =>
                testDialogData &&
                generateAndStartTest(testDialogData.lesson, false)
              }
              className="w-full brutal-border bg-card hover:bg-muted p-4 text-left transition-all hover:shadow-brutal-hover hover:-translate-y-1"
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 brutal-border p-2 rounded">
                  <RefreshCw className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-handwritten font-bold text-lg mb-1">
                    Retake Same Test
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Same questions, test your memory and consistency
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="brutal-border bg-accent/20 text-accent-foreground">
                      <Zap className="w-3 h-3 mr-1" />
                      {testDialogData?.hasPassed ? '20 XP' : 'Practice'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      • 20 questions
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Generate New Test Option */}
            <button
              onClick={() =>
                testDialogData &&
                generateAndStartTest(testDialogData.lesson, true)
              }
              className="w-full brutal-border bg-primary/5 hover:bg-primary/10 p-4 text-left transition-all hover:shadow-brutal-hover hover:-translate-y-1"
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary brutal-border p-2 rounded">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-handwritten font-bold text-lg mb-1">
                    Generate New Test
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fresh questions, new challenge to master the topic
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="brutal-border bg-primary text-primary-foreground">
                      <Award className="w-3 h-3 mr-1" />
                      100 XP
                    </Badge>
                    <Badge className="brutal-border bg-yellow-500 text-white">
                      💳 0.5 credit
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      • 20 new questions
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTestDialog(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonsLibrary;
