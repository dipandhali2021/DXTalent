import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { lessonAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface GenerateLessonDialogProps {
  onLessonsGenerated?: () => void;
}

const GenerateLessonDialog = ({
  onLessonsGenerated,
}: GenerateLessonDialogProps) => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Topic required',
        description: 'Please enter a topic to generate lessons.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await lessonAPI.generateLessonStructure(topic);

      if (response.success) {
        const creditsRemaining = response.data.creditsRemaining;
        toast({
          title: 'Lessons generated! 🎉',
          description: `Created ${response.data.fullyGenerated.length} lessons with ${response.data.placeholders.length} more available. Used 1 credit. ${creditsRemaining} credits remaining.`,
        });

        setOpen(false);
        setTopic('');

        // Callback to refresh lessons list
        if (onLessonsGenerated) {
          onLessonsGenerated();
        }
      }
    } catch (error: any) {
      console.error('Error generating lessons:', error);
      toast({
        title: 'Generation failed',
        description:
          error.response?.data?.message ||
          'Failed to generate lessons. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="font-handwritten">
          <Sparkles className="mr-2" />
          Generate New Lessons
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md brutal-border">
        <DialogHeader>
          <DialogTitle className="font-handwritten text-2xl">
            Generate AI Lessons ✨
          </DialogTitle>
          <DialogDescription>
            Enter a topic and we'll create 10 progressive lessons (Beginner to
            Advanced). The first 3 will be ready immediately!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Topic Input */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="font-handwritten">
              What do you want to learn?
            </Label>
            <Input
              id="topic"
              placeholder="e.g., Digital Marketing, React.js, Data Analytics"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="brutal-border"
              disabled={isGenerating}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              {topic.length}/200 characters
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-muted brutal-border p-4 rounded-none">
            <p className="text-sm text-muted-foreground">
              <strong className="font-handwritten text-foreground">
                What you'll get:
              </strong>
              <br />
              • 10 lessons with progressive difficulty (Beginner → Advanced)
              <br />
              • 3 complete lessons ready immediately
              <br />
              • 7 additional lessons (generate on-demand for 0.5 credit each)
              <br />
              • Lessons 1-4: Beginner level
              <br />
              • Lessons 5-7: Intermediate level
              <br />
              • Lessons 8-10: Advanced level
              <br />• Progress tracking and XP rewards
            </p>
          </div>

          {/* Credit Cost Info */}
          <div className="bg-primary/10 brutal-border p-3 rounded-none">
            <p className="text-sm font-handwritten">
              <strong className="text-primary">💳 Cost: 1 Credit</strong>
              <br />
              <span className="text-xs text-muted-foreground">
                Individual lesson generations cost 0.5 credit each
              </span>
            </p>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2" />
                Generate Lessons
              </>
            )}
          </Button>
        </div>

        {isGenerating && (
          <div className="text-center text-sm text-muted-foreground">
            <p>🤖 AI is creating your personalized lessons...</p>
            <p className="mt-1">This may take 15-30 seconds</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateLessonDialog;
