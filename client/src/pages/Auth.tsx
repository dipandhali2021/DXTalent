import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // Clear error for this field
    setErrors({
      ...errors,
      [e.target.id]: '',
    });
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!isLogin && !formData.username) {
      newErrors.username = t('auth.error.username_required');
    }

    if (!formData.email) {
      newErrors.email = t('auth.error.email_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.error.email_invalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.error.password_required');
    } else if (formData.password.length < 6 && !isLogin) {
      newErrors.password = t('auth.error.password_min');
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.error.passwords_mismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        // Get user data to determine redirect
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Redirect based on role
          switch (userData.role) {
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
          navigate('/dashboard');
        }
      } else {
        await register(formData.username, formData.email, formData.password);
        // Show success message and switch to login
        setIsLogin(true);
        setFormData({
          username: '',
          email: formData.email,
          password: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);

        // Get user info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const { email, name, picture, sub } = userInfo.data;

        // Create a mock credential for backend compatibility
        await googleLogin(tokenResponse.access_token, email, name, picture);

        // Redirect based on role
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          switch (userData.role) {
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
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Google login error:', error);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.error('Google login failed');
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Playful background decorations */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 rotate-12">
        ✨
      </div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-20 -rotate-12">
        🎯
      </div>
      <div className="absolute top-40 right-20 text-4xl opacity-20">⭐</div>
      <div className="absolute bottom-40 left-20 text-4xl opacity-20">🚀</div>

      <div className="w-full max-w-md relative">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 font-handwritten text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('auth.back_home')}
        </Link>

        <div className="relative rotate-[-1deg]">
          <Card className="border-[3px] border-border shadow-brutal">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary border-[3px] border-border rounded-full flex items-center justify-center rotate-12">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-3xl font-handwritten">
                {isLogin ? t('auth.welcome_back') : t('auth.join_fun')}
              </CardTitle>
              <CardDescription className="font-handwritten text-lg">
                {isLogin ? t('auth.login_desc') : t('auth.signup_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="font-handwritten text-lg"
                    >
                      {t('auth.username')}
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder={t('auth.placeholder.username')}
                      value={formData.username}
                      onChange={handleChange}
                      className={`border-[3px] border-border font-handwritten ${
                        errors.username ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500 font-handwritten">
                        {errors.username}
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-handwritten text-lg">
                    {t('auth.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.placeholder.email')}
                    value={formData.email}
                    onChange={handleChange}
                    className={`border-[3px] border-border font-handwritten ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 font-handwritten">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="font-handwritten text-lg"
                  >
                    {t('auth.password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.placeholder.password')}
                    value={formData.password}
                    onChange={handleChange}
                    className={`border-[3px] border-border font-handwritten ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 font-handwritten">
                      {errors.password}
                    </p>
                  )}
                </div>
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="font-handwritten text-lg"
                      >
                        {t('auth.confirm_password')}
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder={t('auth.placeholder.confirm_password')}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`border-[3px] border-border font-handwritten ${
                          errors.confirmPassword ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500 font-handwritten">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Info message for sign up */}
                {!isLogin && (
                  <div className="bg-accent/10 brutal-border p-3 rounded-lg">
                    <p
                      className="text-sm text-muted-foreground font-handwritten"
                      dangerouslySetInnerHTML={{
                        __html: t('auth.info_signup'),
                      }}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  variant="hero"
                  size="lg"
                  disabled={loading}
                >
                  {loading
                    ? t('auth.processing')
                    : isLogin
                    ? t('auth.login_btn')
                    : t('auth.signup_btn')}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card font-handwritten">
                    {t('auth.or')}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="w-full bg-white hover:bg-[#fbdc61] text-foreground border-[3px] border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold text-lg h-12 rounded-xl"
                size="lg"
                disabled={loading}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {t('auth.continue_with_google')}
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-handwritten text-foreground hover:text-primary transition-colors underline"
                >
                  {isLogin
                    ? t('auth.toggle_to_signup')
                    : t('auth.toggle_to_login')}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
