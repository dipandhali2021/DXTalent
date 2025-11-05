import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Trophy,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
  Home,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { lessonAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useBadgeNotifications } from '@/hooks/use-badge-notifications';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  xpReward: number;
}

interface LessonData {
  _id: string;
  skillName: string;
  skillIcon: string;
  questions: Question[];
}

const Lesson = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { width, height } = useWindowSize();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const { checkForNewBadges } = useBadgeNotifications();

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isRetake, setIsRetake] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<any>(null);

  // Fetch lesson data and completion status
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        toast({
          title: 'Error',
          description: 'No lesson ID provided',
          variant: 'destructive',
        });
        navigate('/lessons');
        return;
      }

      setIsLoading(true);
      try {
        const [lessonResponse, statusResponse] = await Promise.all([
          lessonAPI.getLessonById(lessonId),
          lessonAPI.getLessonCompletionStatus(lessonId),
        ]);

        if (lessonResponse.success) {
          setLesson(lessonResponse.data);
        }

        if (statusResponse.success) {
          setCompletionStatus(statusResponse.data);
          setIsRetake(statusResponse.data.isCompleted);

          // Show warning if lesson was already completed
          if (statusResponse.data.isCompleted) {
            toast({
              title: '⚠️ Lesson Already Completed',
              description: `You've completed this lesson ${statusResponse.data.completionCount} time(s). You'll earn only 10 XP for retaking it.`,
              duration: 5000,
            });
          }
        }
      } catch (error: any) {
        console.error('Error fetching lesson:', error);
        toast({
          title: 'Failed to load lesson',
          description: error.response?.data?.message || 'Please try again.',
          variant: 'destructive',
        });
        navigate('/lessons');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, navigate, toast]);

  if (isLoading || !lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your lesson...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / lesson.questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (!hasAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setHasAnswered(true);

    if (correct) {
      setEarnedXP(currentQuestion.xpReward);
      setCorrectCount((prev) => prev + 1);
      setShowXPAnimation(true);
      setTimeout(() => setShowXPAnimation(false), 1000);
    }
  };

  const handleContinue = async () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setIsCorrect(false);
    } else {
      // Last question - save progress and show summary
      setIsSavingProgress(true);
      try {
        const response = await lessonAPI.completeLesson(
          lessonId!,
          correctCount,
          lesson.questions.length
        );

        // Refresh user data to update XP in header
        await refreshUser();

        // Check for newly earned badges
        await checkForNewBadges();

        // Set totalXP with actual XP earned from backend
        if (response.success) {
          setTotalXP(response.data.xpEarned);
          setIsRetake(!response.data.isFirstCompletion);
        }

        toast({
          title: response.data.isFirstCompletion
            ? '🎉 Lesson Completed!'
            : '✅ Lesson Retaken!',
          description: `You earned ${response.data.xpEarned} XP!`,
        });
      } catch (error: any) {
        console.error('Error saving lesson progress:', error);
        toast({
          title: '⚠️ Progress Saved Locally',
          description: "We couldn't sync your progress, but your XP is saved!",
          variant: 'default',
        });
      } finally {
        setIsSavingProgress(false);
        setShowSummary(true);
      }
    }
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  if (showSummary) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full bg-card brutal-border brutal-shadow-lg p-8 rotate-playful-1"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <Trophy className="w-24 h-24 text-accent mx-auto" />
            </motion.div>
            <h1 className="text-4xl font-handwritten font-bold mb-4">
              {isRetake ? 'Lesson Retaken! 🔄' : 'Lesson Complete! 🎉'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isRetake
                ? 'Practice makes perfect! Keep improving!'
                : 'Amazing work! Keep up the streak!'}
            </p>
            {isRetake && (
              <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/20 brutal-border border-yellow-500 p-3 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ℹ️ Retakes earn 10 XP to prevent XP farming. First completions
                  earn full XP!
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-accent/10 brutal-border p-6 text-center">
              <div className="text-4xl font-handwritten font-bold text-accent mb-2">
                {correctCount}/{lesson.questions.length}
              </div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>

            <div className="bg-primary/10 brutal-border p-6 text-center">
              <div className="text-4xl font-handwritten font-bold text-primary mb-2">
                +{totalXP} XP
              </div>
              <div className="text-sm text-muted-foreground">
                {isRetake ? 'Retake XP' : 'XP Earned'}
              </div>
            </div>

            <div className="bg-secondary/20 brutal-border p-6 text-center">
              <div className="text-4xl font-handwritten font-bold mb-2">
                {Math.round((correctCount / lesson.questions.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>

            <div className="bg-muted brutal-border p-6 text-center">
              <div className="text-4xl font-handwritten font-bold mb-2">
                <Flame className="w-8 h-8 text-orange-500 inline-block" />
              </div>
              <div className="text-sm text-muted-foreground">Streak Active</div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleReturnToDashboard}
              className="w-full"
              size="lg"
            >
              <Home className="mr-2" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => navigate('/lessons')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Browse More Lessons
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card brutal-border-b p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Skill Name */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/lessons')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{lesson.skillIcon}</span>
            <h1 className="text-lg font-handwritten font-bold hidden sm:block">
              {lesson.skillName}
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-handwritten font-bold">
                {currentQuestionIndex + 1}/{lesson.questions.length}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3 brutal-border" />
          </div>

          {/* XP Counter - Shows estimated XP based on correct answers */}
          <div className="flex items-center gap-2 bg-accent/10 brutal-border px-4 py-2 relative">
            <Zap className="w-5 h-5 text-accent" />
            <span className="font-handwritten font-bold text-lg">
              {correctCount * currentQuestion.xpReward} XP
            </span>

            <AnimatePresence>
              {showXPAnimation && (
                <motion.div
                  initial={{ y: 0, opacity: 1, scale: 1 }}
                  animate={{ y: -50, opacity: 0, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute -top-8 right-4 text-accent font-handwritten font-bold text-xl"
                >
                  +{earnedXP} XP
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 py-8">
        <motion.div
          key={currentQuestionIndex}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          {/* Question Card */}
          <div className="bg-card brutal-border brutal-shadow-lg p-8 mb-6 relative rotate-playful-1">
            {/* Question Number Badge */}
            <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground brutal-border w-12 h-12 flex items-center justify-center rounded-full font-handwritten font-bold text-lg rotate-playful-2 shadow-brutal">
              {currentQuestionIndex + 1}
            </div>

            {/* Question Text */}
            <h2 className="text-2xl font-bold mb-8 mt-4">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption = index === currentQuestion.correctAnswer;
                const showCorrect = hasAnswered && isCorrectOption;
                const showWrong = hasAnswered && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={hasAnswered}
                    whileHover={!hasAnswered ? { scale: 1.02, rotate: 1 } : {}}
                    whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                    className={`w-full text-left p-4 brutal-border transition-all ${
                      showCorrect
                        ? 'bg-green-100 dark:bg-green-900/20 border-green-500'
                        : showWrong
                        ? 'bg-red-100 dark:bg-red-900/20 border-red-500'
                        : isSelected
                        ? 'bg-primary/10 border-primary'
                        : 'bg-background hover:bg-muted'
                    } ${
                      !hasAnswered
                        ? 'hover:shadow-brutal-hover hover:-translate-y-1'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 brutal-border rounded-full flex items-center justify-center font-handwritten font-bold ${
                          showCorrect
                            ? 'bg-green-500 text-white'
                            : showWrong
                            ? 'bg-red-500 text-white'
                            : isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1 font-medium">{option}</span>
                      {showCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      )}
                      {showWrong && (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Feedback Panel */}
          <AnimatePresence>
            {hasAnswered && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className={`brutal-border brutal-shadow-lg p-6 mb-6 ${
                  isCorrect
                    ? 'bg-green-100 dark:bg-green-900/20 border-green-500'
                    : 'bg-red-100 dark:bg-red-900/20 border-red-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-handwritten font-bold text-xl mb-2">
                      {isCorrect ? 'Correct! 🎉' : 'Not quite right 🤔'}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {currentQuestion.explanation}
                    </p>
                    {isCorrect && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-handwritten font-bold">
                        <Zap className="w-5 h-5" />
                        <span>+{currentQuestion.xpReward} XP earned!</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <div className="flex justify-center">
            {!hasAnswered ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                size="lg"
                className="px-12"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleContinue}
                size="lg"
                className="px-12"
                disabled={isSavingProgress}
              >
                {isSavingProgress ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Lesson;
