import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Home,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { lessonAPI } from '@/lib/api';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// Mock test data (fallback if no data is passed)
const mockTest = {
  testName: 'Marketing Mastery Test',
  timeLimit: 1800, // 30 minutes in seconds
  passingScore: 70,
  totalXP: 500,
  questions: [
    {
      id: 1,
      question: 'What is the primary goal of content marketing?',
      options: [
        'To increase website traffic',
        'To provide value and build trust with audience',
        'To sell products directly',
        'To create viral videos',
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: 'Which metric measures customer engagement on social media?',
      options: [
        'Cost per click',
        'Bounce rate',
        'Engagement rate (likes, comments, shares)',
        'Page views',
      ],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: 'What does SEO stand for?',
      options: [
        'Social Engine Optimization',
        'Search Engine Optimization',
        'Sales Engagement Optimization',
        'Secure Email Operations',
      ],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: 'Which platform is best for B2B marketing?',
      options: ['TikTok', 'Instagram', 'LinkedIn', 'Snapchat'],
      correctAnswer: 2,
    },
    {
      id: 5,
      question: 'What is A/B testing used for?',
      options: [
        'Testing server performance',
        'Comparing two versions to see which performs better',
        'Checking grammar errors',
        'Measuring loading speed',
      ],
      correctAnswer: 1,
    },
  ],
};

const Test = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { width, height } = useWindowSize();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const testContainerRef = useRef<HTMLDivElement>(null);

  // Get test data from navigation state or use mock data
  const testData = location.state?.testData || mockTest;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(testData.questions.length).fill(null)
  );
  const [timeRemaining, setTimeRemaining] = useState(testData.timeLimit);
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number>(Date.now());

  const currentQuestion = testData.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / testData.questions.length) * 100;
  const answeredCount = answers.filter((a) => a !== null).length;

  useEffect(() => {
    if (!hasStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation('tab_switch');
      }
    };

    const handleBlur = () => {
      handleViolation('focus_lost');
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && hasStarted && !showResults) {
        handleViolation('fullscreen_exit');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [hasStarted, showResults]);

  const handleViolation = (type: string) => {
    const newViolations = violations + 1;
    setViolations(newViolations);
    setShowWarning(true);

    toast({
      title: '⚠️ Focus Lost!',
      description: `Violation ${newViolations}/3 logged. Test will auto-submit at 3 violations.`,
      variant: 'destructive',
    });

    setTimeout(() => setShowWarning(false), 3000);

    if (newViolations >= 3) {
      handleAutoSubmit();
    }
  };

  const handleStartTest = async () => {
    try {
      await testContainerRef.current?.requestFullscreen();
      setIsFullScreen(true);
      setHasStarted(true);
      setTestStartTime(Date.now());
    } catch (error) {
      toast({
        title: 'Full-screen Required',
        description: 'Please allow full-screen mode to start the test.',
        variant: 'destructive',
      });
    }
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFlagQuestion = () => {
    if (flaggedQuestions.includes(currentQuestionIndex)) {
      setFlaggedQuestions((prev) =>
        prev.filter((i) => i !== currentQuestionIndex)
      );
    } else {
      setFlaggedQuestions((prev) => [...prev, currentQuestionIndex]);
    }
  };

  const handleAutoSubmit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    calculateResults();
  };

  const handleSubmitTest = () => {
    const unanswered = answers.filter((a) => a === null).length;
    if (unanswered > 0) {
      toast({
        title: 'Unanswered Questions',
        description: `You have ${unanswered} unanswered questions. Submit anyway?`,
        action: (
          <Button onClick={confirmSubmit} size="sm">
            Submit
          </Button>
        ),
      });
    } else {
      confirmSubmit();
    }
  };

  const confirmSubmit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    calculateResults();
  };

  const calculateResults = async () => {
    setIsSubmitting(true);

    // Calculate time taken
    const timeTaken = Math.floor((Date.now() - testStartTime) / 1000);

    try {
      // Submit test to backend
      const testId = testData.testId || location.state?.testId;

      if (testId) {
        const response = await lessonAPI.submitTest(testId, answers, timeTaken);

        if (response.success) {
          toast({
            title: response.data.attempt.passed
              ? 'Test Passed! 🎉'
              : 'Test Complete',
            description: response.data.message,
          });
        }
      }
    } catch (error: any) {
      console.error('Error submitting test:', error);
      toast({
        title: 'Submission Error',
        description: 'Failed to save your test results. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setShowResults(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getResults = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === testData.questions[index].correctAnswer) {
        correct++;
      }
    });
    const score = Math.round((correct / testData.questions.length) * 100);
    const passed = score >= testData.passingScore;
    const xpEarned = passed
      ? testData.totalXP
      : Math.floor(testData.totalXP * 0.5);

    return { correct, score, passed, xpEarned };
  };

  if (!hasStarted) {
    return (
      <div
        ref={testContainerRef}
        className="min-h-screen bg-background p-4 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full bg-card brutal-border brutal-shadow-lg p-8 rotate-playful-1"
        >
          <div className="text-center mb-8">
            <Trophy className="w-20 h-20 text-accent mx-auto mb-4" />
            <h1 className="text-4xl font-handwritten font-bold mb-4">
              {testData.testName}
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to prove your skills?
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-muted brutal-border p-4">
              <p className="font-handwritten font-bold mb-2">
                📋 Test Overview
              </p>
              <ul className="space-y-2 text-sm">
                <li>• {testData.questions.length} multiple choice questions</li>
                <li>• {testData.timeLimit / 60} minutes time limit</li>
                <li>• Passing score: {testData.passingScore}%</li>
                <li>• XP reward: {testData.totalXP} XP</li>
              </ul>
            </div>

            <div className="bg-destructive/10 brutal-border border-destructive p-4">
              <p className="font-handwritten font-bold mb-2 text-destructive">
                ⚠️ Test Rules
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Full-screen mode required (cannot exit)</li>
                <li>• No tab switching or window switching</li>
                <li>• 3 violations = automatic test submission</li>
                <li>• Timer starts immediately upon starting</li>
              </ul>
            </div>
          </div>

          <Button onClick={handleStartTest} size="lg" className="w-full">
            Start Test in Full-Screen
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showResults) {
    const { correct, score, passed, xpEarned } = getResults();

    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        {passed && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
        )}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-3xl w-full bg-card brutal-border brutal-shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              {passed ? (
                <Trophy className="w-24 h-24 text-accent mx-auto mb-4" />
              ) : (
                <RotateCcw className="w-24 h-24 text-destructive mx-auto mb-4" />
              )}
            </motion.div>
            <h1 className="text-4xl font-handwritten font-bold mb-4">
              {passed ? 'Test Passed! 🎉' : 'Keep Practicing! 💪'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {passed
                ? "Excellent work! You've mastered this skill!"
                : "Don't give up! Review and try again."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div
              className={`brutal-border p-6 text-center ${
                passed ? 'bg-accent/10' : 'bg-destructive/10'
              }`}
            >
              <div className="text-4xl font-handwritten font-bold mb-2">
                {score}%
              </div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="bg-primary/10 brutal-border p-6 text-center">
              <div className="text-4xl font-handwritten font-bold text-primary mb-2">
                {correct}/{testData.questions.length}
              </div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>{' '}
            <div className="bg-secondary/20 brutal-border p-6 text-center">
              <div className="text-4xl font-handwritten font-bold mb-2">
                +{xpEarned}
              </div>
              <div className="text-sm text-muted-foreground">XP Earned</div>
            </div>
            <div className="bg-muted brutal-border p-6 text-center">
              <div className="text-4xl font-handwritten font-bold text-destructive mb-2">
                {violations}
              </div>
              <div className="text-sm text-muted-foreground">Violations</div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full"
              size="lg"
            >
              <Home className="mr-2" />
              Back to Dashboard
            </Button>
            {!passed && (
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <RotateCcw className="mr-2" />
                Retake Test
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={testContainerRef} className="min-h-screen bg-background">
      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground brutal-border brutal-shadow-lg p-4 max-w-md"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <p className="font-handwritten font-bold">⚠️ Focus Lost!</p>
                <p className="text-sm">
                  Violation {violations}/3 logged. Return to test immediately.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-card brutal-border-b p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-handwritten font-bold">
              {testData.testName}
            </h1>
            <div
              className={`flex items-center gap-2 px-3 py-1 brutal-border ${
                timeRemaining < 300
                  ? 'bg-destructive/20 text-destructive'
                  : 'bg-muted'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="font-handwritten font-bold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-handwritten font-bold">
                {answeredCount}/{testData.questions.length}
              </span>
              <span className="text-muted-foreground"> answered</span>
            </div>
            <Button onClick={handleSubmitTest} variant="destructive" size="sm">
              Submit Test
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 py-8">
        <div className="mb-6">
          <Progress value={progress} className="h-2 brutal-border mb-2" />
          <div className="flex justify-center gap-2 flex-wrap">
            {testData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 brutal-border font-handwritten font-bold text-sm ${
                  index === currentQuestionIndex
                    ? 'bg-primary text-primary-foreground'
                    : answers[index] !== null
                    ? 'bg-accent text-accent-foreground'
                    : flaggedQuestions.includes(index)
                    ? 'bg-destructive/20 text-destructive'
                    : 'bg-muted'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card brutal-border brutal-shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold flex-1">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </h2>
            <Button
              onClick={handleFlagQuestion}
              variant={
                flaggedQuestions.includes(currentQuestionIndex)
                  ? 'destructive'
                  : 'outline'
              }
              size="sm"
            >
              Flag
            </Button>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestionIndex] === index;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full text-left p-4 brutal-border transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-background hover:bg-muted hover:shadow-brutal-hover hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 brutal-border rounded-full flex items-center justify-center font-handwritten font-bold ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === testData.questions.length - 1}
            className="flex-1"
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Test;
