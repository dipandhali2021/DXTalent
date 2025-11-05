import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  LogOut,
  Camera,
  Mail,
  User,
  AlertCircle,
  Trophy,
  Target,
  Zap,
  Lock,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authAPI, userAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser, updateProfile } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const params = useParams();
  const viewedUserId = params.id;
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [loadingPublic, setLoadingPublic] = useState(false);
  const [publicUser, setPublicUser] = useState<any>(null);

  useEffect(() => {
    // If route has an id param and it's not current user, we'll fetch public profile
    if (viewedUserId) {
      // If current user exists and matches param, show own profile
      if (user && user.id === viewedUserId) {
        setIsOwnProfile(true);
        refreshUser();
        return;
      }

      // Otherwise load public profile
      const fetchPublic = async () => {
        try {
          setLoadingPublic(true);
          const resp = await userAPI.getUserPublic(viewedUserId as string);
          if (resp.success) {
            const pu = resp.data.user;
            setPublicUser(pu);
            setIsOwnProfile(false);
            setUsername(pu.username || '');
            setEmail('');
            setProfilePicture(pu.profilePicture || '');
          }
        } catch (err) {
          console.error('Failed to load public profile', err);
        } finally {
          setLoadingPublic(false);
        }
      };

      fetchPublic();
      return;
    }

    // No id param: show current user's profile
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) {
      // If viewing own profile or no viewedUserId, populate fields
      if (!viewedUserId || (user && user.id === viewedUserId)) {
        setIsOwnProfile(true);
        setUsername(user.username);
        setEmail(user.email);
        setProfilePicture(user.profilePicture || '');
      }
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);

      const updates: any = {};

      if (username !== user.username) {
        updates.username = username;
      }

      if (email !== user.email) {
        updates.email = email;
      }

      if (profilePicture !== (user.profilePicture || '')) {
        updates.profilePicture = profilePicture;
      }

      if (Object.keys(updates).length === 0) {
        setIsEditing(false);
        return;
      }

      await updateProfile(updates);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setProfilePicture(user.profilePicture || '');
    }
    setIsEditing(false);
  };

  const handleResetPassword = async () => {
    if (!user) return;

    try {
      setIsSendingReset(true);
      const response = await authAPI.forgotPassword(user.email);

      if (response.success) {
        toast({
          title: '✅ Password Reset Email Sent!',
          description:
            'Please check your email for password reset instructions.',
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to send reset email. Please try again.';
      toast({
        title: '❌ Failed to Send Reset Email',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  if (viewedUserId && loadingPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 font-handwritten text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If no user (not logged in) and not viewing a public profile, prompt to login
  if (!user && !viewedUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-handwritten text-lg">
            Please login to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const badges: any = {
      user: { emoji: '🎓', label: 'Learner' },
      recruiter: { emoji: '💼', label: 'Recruiter' },
      admin: { emoji: '👑', label: 'Admin' },
    };
    return badges[role] || badges.user;
  };

  const roleForBadge = isOwnProfile ? user?.role : publicUser?.role;
  const roleBadge = getRoleBadge(roleForBadge || 'user');

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
      {/* Playful background decorations */}
      <div className="absolute top-20 left-10 text-6xl opacity-10 rotate-12">
        🎓
      </div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-10 -rotate-12">
        🏆
      </div>
      <div className="absolute top-40 right-20 text-4xl opacity-10">⚡</div>
      <div className="absolute bottom-40 left-20 text-4xl opacity-10">🎯</div>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <div className="rotate-[-1deg]">
            <Card className="border-[3px] border-border shadow-brutal">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-[3px] border-border">
                      <AvatarImage
                        src={profilePicture || 'https://github.com/shadcn.png'}
                      />
                      <AvatarFallback className="font-handwritten text-2xl">
                        {getInitials(username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground w-8 h-8 rounded-full border-[3px] border-border flex items-center justify-center rotate-12">
                      {roleBadge.emoji}
                    </div>
                    {isEditing && isOwnProfile && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <CardTitle className="text-2xl font-handwritten">
                  {username}
                </CardTitle>
                <CardDescription className="font-handwritten text-lg">
                  Level{' '}
                  {isOwnProfile ? user?.stats.level : publicUser?.stats?.level}{' '}
                  {roleBadge.label}
                  {!isOwnProfile && publicUser?.isEmailVerified === false ? (
                    <span className="block text-yellow-600 mt-1">
                      ⚠️ Email not verified
                    </span>
                  ) : null}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isOwnProfile
                  ? null
                  : !user.isEmailVerified && (
                      <Alert className="border-[3px] bg-yellow-50 text-yellow-800 border-yellow-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="font-handwritten">
                          Please verify your email address
                        </AlertDescription>
                      </Alert>
                    )}

                {/* Profile Picture */}
                {isEditing && isOwnProfile && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="profilePicture"
                      className="font-handwritten text-lg flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      Profile Picture URL
                    </Label>
                    <Input
                      id="profilePicture"
                      type="url"
                      value={profilePicture}
                      onChange={(e) => setProfilePicture(e.target.value)}
                      placeholder="https://example.com/your-picture.jpg"
                      className="border-[3px] border-border font-handwritten"
                    />
                    <p className="text-sm text-muted-foreground font-handwritten">
                      Enter a URL to your profile picture or leave blank to use
                      initials
                    </p>
                  </div>
                )}

                {/* Username */}
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="font-handwritten text-lg"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-[3px] border-border font-handwritten"
                    disabled={!isEditing}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-handwritten text-lg">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-[3px] border-border font-handwritten"
                    disabled={!isEditing}
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="font-handwritten text-lg">
                    Role
                  </Label>
                  <Input
                    id="role"
                    type="text"
                    value={roleBadge.label}
                    className="border-[3px] border-border font-handwritten"
                    disabled
                  />
                </div>

                {/* Password Reset Section */}
                {!isEditing && isOwnProfile && (
                  <div className="space-y-2 pt-2 border-t-[3px] border-border">
                    <Label className="font-handwritten text-lg flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <p className="text-sm text-muted-foreground font-handwritten mb-2">
                      Reset your password via email
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-[3px]"
                      onClick={handleResetPassword}
                      disabled={isSendingReset}
                    >
                      {isSendingReset
                        ? '📧 Sending...'
                        : '🔑 Send Password Reset Email'}
                    </Button>
                  </div>
                )}

                {/* Action Buttons - only show for own profile */}
                <div className="flex gap-3 pt-2">
                  {isOwnProfile &&
                    (!isEditing ? (
                      <Button
                        variant="hero"
                        className="w-full"
                        onClick={() => setIsEditing(true)}
                      >
                        Update Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="hero"
                          className="flex-1"
                          onClick={handleUpdateProfile}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-[3px]"
                          onClick={handleCancel}
                          disabled={isUpdating}
                        >
                          Cancel
                        </Button>
                      </>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats and Badges */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="rotate-[1deg]">
              <Card className="border-[3px] border-border shadow-brutal">
                <CardHeader>
                  <CardTitle className="font-handwritten text-2xl">
                    Your Stats
                  </CardTitle>
                  <CardDescription className="font-handwritten text-lg">
                    Keep up the great work!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted border-[3px] border-border rounded-lg rotate-[-1deg]">
                    <div className="w-12 h-12 bg-primary border-[3px] border-border rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-handwritten text-lg font-bold">
                        {isOwnProfile
                          ? user?.stats.skillsMastered
                          : publicUser?.stats?.skillsMastered || 0}
                      </p>
                      <p className="font-handwritten text-muted-foreground">
                        Skills Mastered
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-muted border-[3px] border-border rounded-lg rotate-[1deg]">
                    <div className="w-12 h-12 bg-accent border-[3px] border-border rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-handwritten text-lg font-bold">
                        {isOwnProfile
                          ? user?.stats.challengesCompleted
                          : publicUser?.stats?.challengesCompleted || 0}
                      </p>
                      <p className="font-handwritten text-muted-foreground">
                        Challenges Completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-muted border-[3px] border-border rounded-lg rotate-[-1deg]">
                    <div className="w-12 h-12 bg-secondary border-[3px] border-border rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-handwritten text-lg font-bold">
                        {(isOwnProfile
                          ? user?.stats.xpPoints
                          : publicUser?.stats?.xpPoints || 0
                        )?.toLocaleString()}
                      </p>
                      <p className="font-handwritten text-muted-foreground">
                        XP Points
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <div className="rotate-[-1deg]">
              <Card className="border-[3px] border-border shadow-brutal">
                <CardHeader>
                  <CardTitle className="font-handwritten text-2xl">
                    Recent Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 flex-wrap">
                    {['🏆', '⭐', '🎯', '🚀', '💡', '🔥'].map((emoji, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 bg-accent border-[3px] border-border rounded-lg flex items-center justify-center text-3xl hover:rotate-12 transition-transform cursor-pointer"
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
