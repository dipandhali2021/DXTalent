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
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

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
      newErrors.username = 'Username is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6 && !isLogin) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        navigate('/profile');
      } else {
        await register(
          formData.username,
          formData.email,
          formData.password,
          formData.role
        );
        // Show success message and switch to login
        setIsLogin(true);
        setFormData({
          username: '',
          email: formData.email,
          password: '',
          confirmPassword: '',
          role: 'user',
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const decoded: any = jwtDecode(credentialResponse.credential);

      await googleLogin(
        credentialResponse.credential,
        decoded.email,
        decoded.name,
        decoded.picture
      );

      navigate('/profile');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

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
          Back to Home
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
                {isLogin ? 'Welcome Back!' : 'Join the Fun!'}
              </CardTitle>
              <CardDescription className="font-handwritten text-lg">
                {isLogin
                  ? 'Login to continue your journey'
                  : 'Create your account and start learning'}
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
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
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
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
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
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
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
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
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
                    <div className="space-y-2">
                      <Label
                        htmlFor="role"
                        className="font-handwritten text-lg"
                      >
                        I am a...
                      </Label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full border-[3px] border-border font-handwritten rounded-md p-2"
                      >
                        <option value="user">Learner</option>
                        <option value="recruiter">Recruiter</option>
                      </select>
                    </div>
                  </>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  variant="hero"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card font-handwritten">or</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                  text={isLogin ? 'signin_with' : 'signup_with'}
                  width="100%"
                />
              </div>

              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-handwritten text-foreground hover:text-primary transition-colors underline"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Login'}
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
