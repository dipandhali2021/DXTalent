import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LifeBuoy, Mail, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export default function SupportTicket() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create Gmail compose URL with form data
      const subject = encodeURIComponent(`Support Ticket: ${formData.subject}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );

      // Open Gmail compose in new tab
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=buemethyl68@gmail.com&su=${subject}&body=${body}`,
        '_blank'
      );

      toast({
        title: '📧 Gmail opened!',
        description:
          'Gmail compose window opened in a new tab. Please send the email to complete your request.',
      });

      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          name: user?.username || '',
          email: user?.email || '',
          subject: '',
          message: '',
        });
      }, 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'Failed to open Gmail. Please email us directly at buemethyl68@gmail.com',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="support" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-4 brutal-border brutal-shadow rotate-playful-1">
            <LifeBuoy className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Need Help? We're Here! 🚑
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Got questions or running into issues? Submit a support ticket and
            our team will get back to you ASAP!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Support Form */}
          <Card className="brutal-border brutal-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Submit a Support Ticket
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="brutal-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="brutal-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief description of your issue"
                    required
                    className="brutal-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please provide details about your issue..."
                    required
                    rows={6}
                    className="brutal-border"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  variant="hero"
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting
                    ? 'Opening Email Client...'
                    : 'Send Support Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="brutal-border brutal-shadow rotate-playful-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Direct Email Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Prefer to email us directly? Send your questions or issues to:
                </p>
                <div  onClick={() => {
                    window.open(
                      'https://mail.google.com/mail/?view=cm&fs=1&to=buemethyl68@gmail.com',
                      '_blank'
                    );
                  }}>
                <a
                  href="mailto:buemethyl68@gmail.com"
                  className="block p-4 bg-primary/10 rounded-lg brutal-border hover:bg-primary/20 transition-colors"
                >
                  <p className="font-mono text-lg font-bold text-primary break-all">
                    buemethyl68@gmail.com
                  </p>
                </a>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24-48 hours during business days.
                </p>
              </CardContent>
            </Card>

            <Card className="brutal-border brutal-shadow -rotate-playful-1">
              <CardHeader>
                <CardTitle>📋 Before You Submit</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      Check if your question is already answered in our FAQ
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      Include relevant details like your username and any error
                      messages
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>
                      Screenshots can be very helpful for technical issues
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Be as specific as possible about your issue</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
