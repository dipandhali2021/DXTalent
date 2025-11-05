import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  UserCog,
  Mail,
  Calendar,
  Shield,
  Ban,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import DashboardHeader from '@/components/DashboardHeader';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'recruiter';
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  lastActive: string;
  xp: number;
  avatar?: string;
  subscriptionType?: string;
}

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {};

      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await adminAPI.getAllUsers(params);

      if (response.success) {
        setUsers(response.users);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendActivate = async (
    userId: string,
    currentStatus: string
  ) => {
    try {
      setActionLoading(userId);

      const response =
        currentStatus === 'suspended'
          ? await adminAPI.activateUser(userId)
          : await adminAPI.suspendUser(userId);

      if (response.success) {
        toast({
          title: 'Success',
          description: response.message,
        });
        fetchUsers(); // Refresh the list
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to update user status',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setActionLoading(userId);

      const response = await adminAPI.updateUserRole(userId, newRole);

      if (response.success) {
        toast({
          title: 'Success',
          description: `User role updated to ${newRole}`,
        });
        fetchUsers(); // Refresh the list
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to update user role',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'recruiter':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="destructive">
            <Ban className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        );
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    admins: users.filter((u) => u.role === 'admin').length,
    learners: users.filter((u) => u.role === 'user').length,
    recruiters: users.filter((u) => u.role === 'recruiter').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <DashboardHeader role="admin" />

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="brutal-border brutal-shadow rotate-[-1deg]">
            <CardContent className="p-4 text-center">
              <p className="font-handwritten text-3xl font-bold text-primary">
                {stats.total}
              </p>
              <p className="font-handwritten text-sm text-muted-foreground">
                Total Users
              </p>
            </CardContent>
          </Card>
          <Card className="brutal-border brutal-shadow rotate-[1deg]">
            <CardContent className="p-4 text-center">
              <p className="font-handwritten text-3xl font-bold text-green-600">
                {stats.active}
              </p>
              <p className="font-handwritten text-sm text-muted-foreground">
                Active
              </p>
            </CardContent>
          </Card>
          <Card className="brutal-border brutal-shadow rotate-[-1deg]">
            <CardContent className="p-4 text-center">
              <p className="font-handwritten text-3xl font-bold text-accent">
                {stats.admins}
              </p>
              <p className="font-handwritten text-sm text-muted-foreground">
                Admins
              </p>
            </CardContent>
          </Card>
          <Card className="brutal-border brutal-shadow rotate-[1deg]">
            <CardContent className="p-4 text-center">
              <p className="font-handwritten text-3xl font-bold text-secondary">
                {stats.learners}
              </p>
              <p className="font-handwritten text-sm text-muted-foreground">
                Learners
              </p>
            </CardContent>
          </Card>
          <Card className="brutal-border brutal-shadow rotate-[-1deg]">
            <CardContent className="p-4 text-center">
              <p className="font-handwritten text-3xl font-bold text-primary">
                {stats.recruiters}
              </p>
              <p className="font-handwritten text-sm text-muted-foreground">
                Recruiters
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="brutal-border brutal-shadow mb-6">
          <CardHeader>
            <CardTitle className="font-handwritten text-xl">Filters</CardTitle>
            <CardDescription className="font-handwritten">
              Search and filter users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">Learner</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-handwritten text-2xl font-bold">
              All Users ({filteredUsers.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <Card className="brutal-border brutal-shadow">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  No users found matching your filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <Card
                  key={user.id}
                  className="brutal-border brutal-shadow hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-handwritten font-bold text-lg">
                            {user.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Role
                        </span>
                        <Select
                          value={user.role}
                          onValueChange={(newRole) =>
                            handleRoleChange(user.id, newRole)
                          }
                          disabled={actionLoading === user.id}
                        >
                          <SelectTrigger className="w-[140px] h-7">
                            <SelectValue>
                              <Badge variant={getRoleBadgeVariant(user.role)}>
                                {user.role === 'admin' && (
                                  <Shield className="w-3 h-3 mr-1" />
                                )}
                                {user.role === 'user'
                                  ? 'Learner'
                                  : user.role.charAt(0).toUpperCase() +
                                    user.role.slice(1)}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Learner</SelectItem>
                            <SelectItem value="recruiter">Recruiter</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Status
                        </span>
                        {getStatusBadge(user.status)}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          XP
                        </span>
                        <span className="font-handwritten font-bold text-primary text-lg">
                          {user.xp.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Joined
                        </span>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {user.joinedDate}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Last Active
                        </span>
                        <span className="text-sm">{user.lastActive}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link to={`/profile/${user.id}`}>View</Link>
                      </Button>
                      <Button
                        variant={
                          user.status === 'suspended'
                            ? 'default'
                            : 'destructive'
                        }
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleSuspendActivate(user.id, user.status)
                        }
                        disabled={actionLoading === user.id}
                      >
                        {actionLoading === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : user.status === 'suspended' ? (
                          'Activate'
                        ) : (
                          'Suspend'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
