import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4" />
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className={language === 'en' ? 'bg-primary text-white' : ''}
      >
        ENG
      </Button>
      <Button
        variant={language === 'jp' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('jp')}
        className={language === 'jp' ? 'bg-primary text-white' : ''}
      >
        JYP
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
