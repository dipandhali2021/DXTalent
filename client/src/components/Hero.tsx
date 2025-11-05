import { Button } from '@/components/ui/button';
import { Sparkles, Trophy, Target } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

export default function Hero() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (isAuthenticated && user) {
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'recruiter':
          navigate('/recruiter/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  const handleForRecruiters = () => {
    if (isAuthenticated && user) {
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'recruiter':
          navigate('/recruiter/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Top-left logo (home link) */}
      <Link
        to="/"
        aria-label="Home"
        className="flex items-center absolute left-4 top-4"
      >
        <img src={logo} alt="DXTalent" className="h-16 ml-4 object-contain" />
      </Link>
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 text-6xl rotate-12 opacity-30">
          ✏️
        </div>
        <div className="absolute top-40 right-20 text-5xl -rotate-12 opacity-30">
          📚
        </div>
        <div className="absolute bottom-40 left-20 text-5xl rotate-6 opacity-30">
          🎯
        </div>
        <div className="absolute bottom-20 right-10 text-6xl -rotate-6 opacity-30">
          🏆
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Tag */}
        <div className="inline-block">
          <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full brutal-border brutal-shadow rotate-playful-1 inline-block text-sm font-bold">
            🚀 Level Up Your DX Skills
          </span>
        </div>

        {/* Main Heading */}
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground rotate-playful-1 leading-tight">
            Master Digital Skills
            <br />
            Through{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Gamified Learning</span>
              <div className="absolute -bottom-2 left-0 right-0 h-4 bg-accent -rotate-1 -z-0"></div>
            </span>
          </h1>
          <div className="absolute -right-8 top-0 text-5xl rotate-12 animate-bounce-slow">
            ⭐
          </div>
          <div className="absolute -left-8 bottom-0 text-5xl -rotate-12 animate-bounce-slow animation-delay-300">
            ✨
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto rotate-playful-2">
          Discover motivated talent by teaching and evaluating DX-related skills
          through our gamified e-learning platform. Recruiters discover top
          performers. Learners earn recognition.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            variant="hero"
            size="lg"
            className="group"
            onClick={handleStartLearning}
          >
            <Target className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            Start Learning
          </Button>
          <Button
            variant="outline-brutal"
            size="lg"
            className="group"
            onClick={handleForRecruiters}
          >
            <Trophy className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            For Recruiters
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
          {[
            { icon: '🎮', label: 'Gamified Challenges', value: '50+' },
            { icon: '👨‍💻', label: 'Active Learners', value: '10K+' },
            { icon: '🏢', label: 'Recruiting Partners', value: '200+' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-card brutal-border brutal-shadow rounded-xl p-6 hover:brutal-shadow-lg hover:-translate-y-1 transition-all ${
                i === 0
                  ? 'rotate-playful-1'
                  : i === 1
                  ? 'rotate-playful-2'
                  : 'rotate-playful-3'
              }`}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
