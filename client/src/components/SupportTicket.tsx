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
import { useLanguage } from '@/context/LanguageContext';

export default function SupportTicket() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
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
      const subject = encodeURIComponent(
        `${t('support.email.subject_prefix')} ${formData.subject}`
      );
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );

      // Open Gmail compose in new tab
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=buemethyl68@gmail.com&su=${subject}&body=${body}`,
        '_blank'
      );

      toast({
        title: t('support.toast.opened_title'),
        description: t('support.toast.opened_description'),
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
        title: t('support.toast.error_title'),
        description: t('support.toast.error_description'),
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
            {t('support.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('support.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Support Form */}
          <Card className="brutal-border brutal-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t('support.form.title')}
              </CardTitle>
              <CardDescription>{t('support.form.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('support.form.name')}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('support.form.placeholder.name')}
                    required
                    className="brutal-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('support.form.email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('support.form.placeholder.email')}
                    required
                    className="brutal-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{t('support.form.subject')}</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('support.form.placeholder.subject')}
                    required
                    className="brutal-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t('support.form.message')}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('support.form.placeholder.message')}
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
                    ? t('support.form.sending')
                    : t('support.form.submit')}
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
                  {t('support.email.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('support.email.subtitle')}
                </p>
                <div
                  onClick={() => {
                    window.open(
                      'https://mail.google.com/mail/?view=cm&fs=1&to=buemethyl68@gmail.com',
                      '_blank'
                    );
                  }}
                >
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
                  {t('support.email.response')}
                </p>
              </CardContent>
            </Card>

            <Card className="brutal-border brutal-shadow -rotate-playful-1">
              <CardHeader>
                <CardTitle>{t('support.tips.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{t('support.tips.check')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{t('support.tips.details')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{t('support.tips.helpful')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{t('support.tips.specific')}</span>
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
