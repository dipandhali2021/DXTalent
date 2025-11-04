import { useState, useEffect } from 'react';
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
import { ArrowLeft, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!token) {
      toast({
        title: '❌ Invalid Link',
        description: 'Password reset token is missing.',
        variant: 'destructive',
      });
    }
  }, [token]);

  const validateForm = () => {
    const newErrors: any = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: '❌ Invalid Link',
        description: 'Password reset token is missing.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword(token, password);

      if (response.success) {
        setSuccess(true);
        toast({
          title: '✅ Password Reset Successful!',
          description: 'You can now login with your new password.',
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to reset password. The link may have expired.';
      toast({
        title: '❌ Reset Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Playful background decorations */}
      <div className="absolute top-20 left-10 text-6xl opacity-10 rotate-12">
        🔐
      </div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-10 -rotate-12">
        🔑
      </div>
      <div className="absolute top-40 right-20 text-4xl opacity-10">🛡️</div>
      <div className="absolute bottom-40 left-20 text-4xl opacity-10">✨</div>

      <div className="w-full max-w-md">
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 mb-6 font-handwritten text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="rotate-[-1deg]">
          <Card className="border-[3px] border-border shadow-brutal">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary border-[3px] border-border rounded-full flex items-center justify-center rotate-12">
                  {success ? (
                    <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
                  ) : (
                    <Lock className="w-8 h-8 text-primary-foreground" />
                  )}
                </div>
              </div>
              <CardTitle className="text-3xl font-handwritten">
                {success ? 'Password Reset!' : 'Reset Your Password'}
              </CardTitle>
              <CardDescription className="font-handwritten text-lg">
                {success
                  ? 'Redirecting to login page...'
                  : 'Enter your new password below'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!token && (
                    <Alert variant="destructive" className="border-[3px]">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-handwritten">
                        Invalid or missing reset token. Please request a new
                        password reset link.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="font-handwritten text-lg"
                    >
                      New Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: '' });
                      }}
                      className="border-[3px] border-border font-handwritten"
                      disabled={loading || !token}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600 font-handwritten">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
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
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors({ ...errors, confirmPassword: '' });
                      }}
                      className="border-[3px] border-border font-handwritten"
                      disabled={loading || !token}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 font-handwritten">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full text-lg"
                    disabled={loading || !token}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Resetting...
                      </>
                    ) : (
                      '🔑 Reset Password'
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground font-handwritten mt-4">
                    Remember your password?{' '}
                    <Link
                      to="/auth"
                      className="text-primary hover:underline font-bold"
                    >
                      Login here
                    </Link>
                  </p>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <Alert className="border-[3px] bg-green-50 text-green-800 border-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription className="font-handwritten">
                      Your password has been successfully reset! You can now
                      login with your new password.
                    </AlertDescription>
                  </Alert>

                  <Button
                    variant="hero"
                    className="w-full text-lg"
                    onClick={() => navigate('/auth')}
                  >
                    Go to Login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
