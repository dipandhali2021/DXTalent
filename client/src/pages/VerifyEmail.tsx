import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/lib/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await authAPI.verifyEmail(token);
        if (response.success) {
          setStatus('success');
          setMessage(response.message);
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed');
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Playful background decorations */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 rotate-12">
        ✉️
      </div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-20 -rotate-12">
        ✅
      </div>
      <div className="absolute top-40 right-20 text-4xl opacity-20">⭐</div>
      <div className="absolute bottom-40 left-20 text-4xl opacity-20">🎉</div>

      <div className="w-full max-w-md">
        <Card className="border-[3px] border-border shadow-brutal">
          <CardHeader className="text-center">
            {status === 'loading' && (
              <div className="flex justify-center mb-4">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            )}
            {status === 'error' && (
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
            )}

            <CardTitle className="text-3xl font-handwritten">
              {status === 'loading' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
            <CardDescription className="font-handwritten text-lg">
              {message || 'Please wait while we verify your email address.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'success' && (
              <Button
                variant="hero"
                className="w-full"
                onClick={() => navigate('/auth')}
              >
                Go to Login
              </Button>
            )}
            {status === 'error' && (
              <div className="space-y-2">
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={() => navigate('/auth')}
                >
                  Back to Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Go to Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
