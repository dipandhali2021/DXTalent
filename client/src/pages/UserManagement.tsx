import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserCog, Mail, Calendar, Shield, Ban, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "learner" | "recruiter";
  status: "active" | "suspended" | "pending";
  joinedDate: string;
  lastActive: string;
  xp: number;
  avatar?: string;
}

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock user data
  const mockUsers: User[] = [
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah@example.com",
      role: "learner",
      status: "active",
      joinedDate: "2024-01-15",
      lastActive: "2 hours ago",
      xp: 4500,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      id: "2",
      name: "Mike Ross",
      email: "mike@techcorp.com",
      role: "recruiter",
      status: "active",
      joinedDate: "2024-02-20",
      lastActive: "1 day ago",
      xp: 1200,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
    },
    {
      id: "3",
      name: "Admin User",
      email: "admin@devlearn.com",
      role: "admin",
      status: "active",
      joinedDate: "2023-12-01",
      lastActive: "5 minutes ago",
      xp: 15000,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
    },
    {
      id: "4",
      name: "Jessica Park",
      email: "jessica@example.com",
      role: "learner",
      status: "suspended",
      joinedDate: "2024-03-10",
      lastActive: "1 week ago",
      xp: 800,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica"
    },
    {
      id: "5",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "learner",
      status: "pending",
      joinedDate: "2024-11-04",
      lastActive: "Never",
      xp: 0,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    },
    {
      id: "6",
      name: "TechCorp HR",
      email: "hr@techcorp.com",
      role: "recruiter",
      status: "active",
      joinedDate: "2024-01-25",
      lastActive: "3 hours ago",
      xp: 2300,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp"
    },
    {
      id: "7",
      name: "Emma Wilson",
      email: "emma@example.com",
      role: "learner",
      status: "active",
      joinedDate: "2024-02-14",
      lastActive: "30 minutes ago",
      xp: 7800,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
    },
    {
      id: "8",
      name: "David Kim",
      email: "david@example.com",
      role: "learner",
      status: "active",
      joinedDate: "2024-03-05",
      lastActive: "1 hour ago",
      xp: 12500,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
    }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "recruiter":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case "suspended":
        return <Badge variant="destructive"><Ban className="w-3 h-3 mr-1" />Suspended</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === "active").length,
    admins: mockUsers.filter(u => u.role === "admin").length,
    learners: mockUsers.filter(u => u.role === "learner").length,
    recruiters: mockUsers.filter(u => u.role === "recruiter").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-[3px] border-border bg-card p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="font-handwritten text-2xl font-bold flex items-center gap-2">
              <UserCog className="w-6 h-6 text-primary" />
              User Management
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="brutal-border brutal-shadow rotate-[-1deg]">
            <CardContent className="p-4 text-center">
              <p className="font-handwritten text-3xl font-bold text-primary">{stats.total}</p>
              <p className="font-handwritten text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card className="brutal-border brutal-shadow rotate-[1deg]">
            <CardContent className="p-4 text-center">
              <p className="font-handwritten text-3xl font-bold text-green-600">{stats.active}</p>
              <p className="font-handwritten text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="brutal-border brutal-shadow rotate-[-1deg]">
            <CardContent className="p-4 text-center">
              <p className="font-handwritten text-3xl font-bold text-accent">{stats.admins}</p>
              <p className="font-handwritten text-sm text-muted-foreground">Admins</p>
            </CardContent>
          </Card>
          <Card className="brutal-border brutal-shadow rotate-[1deg]">
            <CardContent className="p-4 text-center">
              <p className="font-handwritten text-3xl font-bold text-secondary">{stats.learners}</p>
              <p className="font-handwritten text-sm text-muted-foreground">Learners</p>
            </CardContent>
          </Card>
          <Card className="brutal-border brutal-shadow rotate-[-1deg]">
            <CardContent className="p-4 text-center">
              <p className="font-handwritten text-3xl font-bold text-primary">{stats.recruiters}</p>
              <p className="font-handwritten text-sm text-muted-foreground">Recruiters</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="brutal-border brutal-shadow mb-6">
          <CardHeader>
            <CardTitle className="font-handwritten text-xl">Filters</CardTitle>
            <CardDescription className="font-handwritten">Search and filter users</CardDescription>
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
                  <SelectItem value="learner">Learner</SelectItem>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="brutal-border brutal-shadow hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-handwritten font-bold text-lg">{user.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Role</span>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      {getStatusBadge(user.status)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">XP</span>
                      <span className="font-handwritten font-bold text-primary text-lg">
                        {user.xp.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Joined</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {user.joinedDate}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Active</span>
                      <span className="text-sm">{user.lastActive}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button 
                      variant={user.status === "suspended" ? "default" : "destructive"} 
                      size="sm"
                      className="flex-1"
                    >
                      {user.status === "suspended" ? "Activate" : "Suspend"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
