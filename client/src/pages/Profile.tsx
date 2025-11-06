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
import { authAPI, userAPI, badgeAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import BadgeGrid from '@/components/BadgeGrid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [badges, setBadges] = useState<any[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'earned' | 'locked'>(
    'all'
  );
  const [checkingBadges, setCheckingBadges] = useState(false);

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
            // Set email if it's provided (for recruiters/admins viewing profiles)
            setEmail(pu.email || '');
            setProfilePicture(pu.profilePicture || '');
            // Populate badges for the viewed user (earned badges)
            setBadges(Array.isArray(pu.badges) ? pu.badges : []);
            setLoadingBadges(false);
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

  // Fetch badges when component mounts
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoadingBadges(true);
        const response = await badgeAPI.getAllBadges();
        if (response.success) {
          setBadges(response.data.badges);
        }
      } catch (error) {
        console.error('Error fetching badges:', error);
      } finally {
        setLoadingBadges(false);
      }
    };

    if (user && isOwnProfile) {
      fetchBadges();
    }
  }, [user, isOwnProfile]);

  const handleCheckBadges = async () => {
    try {
      setCheckingBadges(true);
      const response = await badgeAPI.checkBadges();
      if (response.success && response.data.newBadges.length > 0) {
        toast({
          title: `🎉 ${response.data.newBadges.length} New Badge${
            response.data.newBadges.length > 1 ? 's' : ''
          } Earned!`,
          description: response.data.newBadges
            .map((b: any) => `${b.badge.emoji} ${b.badge.name}`)
            .join(', '),
        });
        // Refresh badges
        const badgesResponse = await badgeAPI.getAllBadges();
        if (badgesResponse.success) {
          setBadges(badgesResponse.data.badges);
        }
      } else {
        toast({
          title: '👀 No New Badges',
          description: 'Keep completing lessons to earn more badges!',
        });
      }
    } catch (error) {
      console.error('Error checking badges:', error);
      toast({
        title: '❌ Error',
        description: 'Failed to check for new badges',
        variant: 'destructive',
      });
    } finally {
      setCheckingBadges(false);
    }
  };

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

  // Check if current logged-in user is a recruiter or admin
  const isRecruiterOrAdmin =
    user?.role === 'recruiter' || user?.role === 'admin';

  // Get role-specific dashboard route
  const getDashboardRoute = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'recruiter':
        return '/recruiter/dashboard';
      default:
        return '/dashboard';
    }
  };

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
            onClick={() => navigate(getDashboardRoute())}
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

        <div className={isRecruiterOrAdmin ? '' : 'grid gap-6 md:grid-cols-2'}>
          {/* Profile Card */}
          <div className={isRecruiterOrAdmin ? '' : 'rotate-[-1deg]'}>
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
                  {!isRecruiterOrAdmin && (
                    <>
                      Level{' '}
                      {isOwnProfile
                        ? user?.stats.level
                        : publicUser?.stats?.level}{' '}
                      •{' '}
                      <span className="capitalize">
                        {isOwnProfile
                          ? user?.stats.league
                          : publicUser?.stats?.league}
                      </span>{' '}
                      League •{' '}
                    </>
                  )}
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

                {/* Email - Only show for own profile or if provided (recruiter/admin viewing) */}
                {(isOwnProfile || email) && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-handwritten text-lg">
                      Email
                      {!isOwnProfile && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (Visible to recruiters)
                        </span>
                      )}
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
                )}

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

          {/* Stats and Badges - Hide for recruiter/admin viewing */}
          {!isRecruiterOrAdmin && (
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
                    {loadingBadges ? (
                      <div className="text-center py-4">
                        <p className="font-handwritten">Loading badges...</p>
                      </div>
                    ) : (
                      <BadgeGrid
                        badges={badges.filter((b) => b.earned).slice(0, 6)}
                        compact
                        onBadgeClick={(badge) => {
                          setSelectedBadge(badge);
                          setBadgeDialogOpen(true);
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* All Badges Section - Full Width - Hide for recruiter/admin viewing */}
        {isOwnProfile &&
          !isRecruiterOrAdmin &&
          !loadingBadges &&
          badges.length > 0 && (
            <div className="max-w-4xl mx-auto mt-8">
              <Card className="border-[3px] border-border shadow-brutal rotate-[0.5deg]">
                <CardHeader>
                  <CardTitle className="font-handwritten text-3xl">
                    🏆 All Badges
                  </CardTitle>
                  <CardDescription className="font-handwritten text-lg">
                    Earn badges by completing lessons, maintaining streaks, and
                    achieving milestones!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Filter Tabs */}
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant={badgeFilter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        className="border-[3px]"
                        onClick={() => setBadgeFilter('all')}
                      >
                        All ({badges.length})
                      </Button>
                      <Button
                        variant={
                          badgeFilter === 'earned' ? 'default' : 'outline'
                        }
                        size="sm"
                        className="border-[3px]"
                        onClick={() => setBadgeFilter('earned')}
                      >
                        Earned ({badges.filter((b) => b.earned).length})
                      </Button>
                      <Button
                        variant={
                          badgeFilter === 'locked' ? 'default' : 'outline'
                        }
                        size="sm"
                        className="border-[3px]"
                        onClick={() => setBadgeFilter('locked')}
                      >
                        Locked ({badges.filter((b) => !b.earned).length})
                      </Button>
                      <Button
                        variant="hero"
                        size="sm"
                        className="ml-auto"
                        onClick={handleCheckBadges}
                        disabled={checkingBadges}
                      >
                        {checkingBadges
                          ? '🔄 Checking...'
                          : '🔍 Check for New Badges'}
                      </Button>
                    </div>

                    {/* Badge Grid */}
                    <BadgeGrid
                      badges={
                        badgeFilter === 'all'
                          ? badges
                          : badgeFilter === 'earned'
                          ? badges.filter((b) => b.earned)
                          : badges.filter((b) => !b.earned)
                      }
                      onBadgeClick={(badge) => {
                        setSelectedBadge(badge);
                        setBadgeDialogOpen(true);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        {/* Badge Detail Dialog */}
        <Dialog open={badgeDialogOpen} onOpenChange={setBadgeDialogOpen}>
          <DialogContent className="border-[3px] border-border">
            {selectedBadge && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-accent border-[3px] border-border rounded-2xl flex items-center justify-center text-4xl">
                      {selectedBadge.emoji}
                    </div>
                    <div>
                      <DialogTitle className="font-handwritten text-2xl">
                        {selectedBadge.name}
                      </DialogTitle>
                      <DialogDescription className="font-handwritten">
                        {selectedBadge.rarity.toUpperCase()} Badge •{' '}
                        {selectedBadge.xpReward} XP
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="font-handwritten text-lg">
                    {selectedBadge.description}
                  </p>

                  {selectedBadge.earned ? (
                    <div className="bg-green-100 border-[3px] border-green-500 rounded-lg p-4">
                      <p className="font-handwritten text-green-800 font-bold">
                        ✅ Badge Earned!
                      </p>
                      <p className="font-handwritten text-sm text-green-700">
                        Earned on{' '}
                        {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-100 border-[3px] border-yellow-500 rounded-lg p-4 space-y-3">
                      <p className="font-handwritten text-yellow-800 font-bold">
                        🎯 In Progress
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-handwritten text-sm text-yellow-700">
                            {selectedBadge.current} / {selectedBadge.target}
                          </span>
                          <span className="font-handwritten text-sm font-bold text-yellow-800">
                            {selectedBadge.progress}%
                          </span>
                        </div>
                        <div className="h-3 bg-yellow-200 border-[2px] border-yellow-500 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 transition-all"
                            style={{ width: `${selectedBadge.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={() => setBadgeDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
