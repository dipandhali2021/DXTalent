import { Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t-4 border-foreground shadow-brutal">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black brutal-text">DXTalent ⭐</h3>
            <p className="text-sm font-medium text-foreground/80">
              {t('footer.about')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-black brutal-text">
              {t('footer.quicklinks')}
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link
                  to="/"
                  className="text-foreground/80 hover:text-primary hover:underline transition-colors"
                >
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/lessons"
                  className="text-foreground/80 hover:text-primary hover:underline transition-colors"
                >
                  {t('footer.lessons')}
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-foreground/80 hover:text-primary hover:underline transition-colors"
                >
                  {t('footer.leaderboard')}
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-foreground/80 hover:text-primary hover:underline transition-colors"
                >
                  {t('footer.signup')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-black brutal-text">
              {t('footer.support')}
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <a
                  href="#support"
                  className="text-foreground/80 hover:text-primary hover:underline transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const supportSection = document.getElementById('support');
                    if (supportSection) {
                      supportSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {t('footer.contactsupport')}
                </a>
              </li>
              <li>
                <a
                  href="mailto:buemethyl68@gmail.com"
                  className="text-foreground/80 hover:text-primary hover:underline transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  buemethyl68@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-black brutal-text">
              {t('footer.connect')}
            </h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border-2 border-foreground bg-background hover:bg-primary hover:scale-110 transition-all shadow-brutal-sm"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border-2 border-foreground bg-background hover:bg-primary hover:scale-110 transition-all shadow-brutal-sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border-2 border-foreground bg-background hover:bg-primary hover:scale-110 transition-all shadow-brutal-sm"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-4 border-foreground mt-8 pt-8 text-center">
          <p className="text-sm font-bold text-foreground">
            © {new Date().getFullYear()} DXTalent. {t('footer.rights')}
          </p>
          <p className="text-xs font-medium text-foreground/80 mt-2">
            {t('footer.inquiries')}{' '}
            <a
              href="mailto:buemethyl68@gmail.com"
              className="text-primary hover:underline font-bold"
            >
              buemethyl68@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
