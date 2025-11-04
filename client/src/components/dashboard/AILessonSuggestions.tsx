import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, BookOpen, ArrowRight } from 'lucide-react';

interface LessonSuggestion {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  xpReward: number;
  reason: string;
}

interface AILessonSuggestionsProps {
  suggestions: LessonSuggestion[];
  onStartLesson?: (lessonId: string) => void;
}

export const AILessonSuggestions = ({
  suggestions,
  onStartLesson,
}: AILessonSuggestionsProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-500';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-500';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-500';
      default:
        return '';
    }
  };

  return (
    <Card className="brutal-border brutal-shadow bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI-Powered Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((lesson) => (
          <div
            key={lesson.id}
            className="p-4 bg-white brutal-border brutal-shadow-sm rounded-lg hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h4 className="font-bold">{lesson.title}</h4>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className={`brutal-border ${getDifficultyColor(
                      lesson.difficulty
                    )}`}
                  >
                    {lesson.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="brutal-border">
                    {lesson.category}
                  </Badge>
                  <Badge variant="outline" className="brutal-border">
                    ⏱️ {lesson.estimatedTime}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  <Sparkles className="w-4 h-4 inline mr-1 text-purple-600" />
                  {lesson.reason}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-primary">
                +{lesson.xpReward} XP
              </span>
              {onStartLesson && (
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => onStartLesson(lesson.id)}
                  className="gap-2"
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
