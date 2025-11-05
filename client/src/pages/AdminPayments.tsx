import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { adminAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  RefreshCcw,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';

interface Payment {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };
  amount: number;
  currency: string;
  paymentType: string;
  plan: string;
  role: string;
  status: string;
  paymentMethod: string;
  transactionId: string;
  description: string;
  refundAmount: number;
  createdAt: string;
}

const AdminPayments = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalRefunds: 0,
    netRevenue: 0,
    transactionCount: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPayments: 0,
    limit: 5,
  });

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    paymentType: 'all',
    plan: 'all',
    search: '',
    minAmount: '',
    maxAmount: '',
    month: 'all',
  });

  const [tempFilters, setTempFilters] = useState(filters);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        tempFilters.search !== filters.search &&
        tempFilters.search.length > 0
      ) {
        setFilters({ ...filters, search: tempFilters.search });
        setPagination({ ...pagination, currentPage: 1 });
      } else if (tempFilters.search === '' && filters.search !== '') {
        setFilters({ ...filters, search: '' });
        setPagination({ ...pagination, currentPage: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [tempFilters.search]);

  useEffect(() => {
    fetchPayments();
  }, [pagination.currentPage, filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      // Convert 'all' to empty string for API
      const apiFilters = {
        status: filters.status === 'all' ? '' : filters.status,
        paymentType: filters.paymentType === 'all' ? '' : filters.paymentType,
        plan: filters.plan === 'all' ? '' : filters.plan,
        search: filters.search,
      };

      const response = await adminAPI.getAllPayments({
        page: pagination.currentPage,
        limit: 5,
        ...apiFilters,
      });

      if (response.success) {
        setPayments(response.payments);
        setPagination({
          ...pagination,
          totalPages: response.pagination.totalPages,
          totalPayments: response.pagination.totalPayments,
        });
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getPaymentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      subscription: 'bg-blue-100 text-blue-800',
      role_upgrade: 'bg-purple-100 text-purple-800',
      renewal: 'bg-green-100 text-green-800',
      refund: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const handleExport = () => {
    try {
      // Convert payments data to CSV format
      const headers = [
        'Date',
        'Username',
        'Email',
        'Amount',
        'Currency',
        'Type',
        'Plan',
        'Status',
        'Method',
        'Transaction ID',
        'Description',
        'Refund Amount',
      ];

      const csvData = payments.map((payment) => [
        new Date(payment.createdAt).toLocaleDateString(),
        payment.user.username,
        payment.user.email,
        payment.amount,
        payment.currency,
        payment.paymentType.replace('_', ' '),
        payment.plan,
        payment.status,
        payment.paymentMethod,
        payment.transactionId,
        payment.description || '',
        payment.refundAmount || 0,
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          row
            .map((cell) => {
              // Escape commas and quotes in cell content
              const cellStr = String(cell);
              if (
                cellStr.includes(',') ||
                cellStr.includes('"') ||
                cellStr.includes('\n')
              ) {
                return `"${cellStr.replace(/"/g, '""')}"`;
              }
              return cellStr;
            })
            .join(',')
        ),
      ].join('\n');

      // Add summary statistics at the end
      const summary = [
        '',
        'Summary Statistics',
        `Total Payments: ${pagination.totalPayments}`,
        `Total Revenue: $${stats.totalRevenue}`,
        `Total Refunds: $${stats.totalRefunds}`,
        `Net Revenue: $${stats.netRevenue}`,
        `Transaction Count: ${stats.transactionCount}`,
      ].join('\n');

      const fullCsv = csvContent + '\n' + summary;

      // Create blob and download
      const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `payments_export_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export Successful',
        description: `Exported ${payments.length} payments to CSV file`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export payment data',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader role="admin" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">
            Payment Management 💳
          </h1>
          <p className="text-lg text-muted-foreground">
            Track all payments and revenue across the platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="brutal-border brutal-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary border-[3px] border-border rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    {(() => {
                      const raw = Number(stats.totalRevenue) || 0;
                      if (raw >= 1000) return `$${(raw / 1000).toFixed(1)}K`;
                      return `$${raw.toFixed(0)}`;
                    })()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="brutal-border brutal-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent border-[3px] border-border rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Revenue</p>
                  <p className="text-2xl font-bold">
                    {(() => {
                      const raw = Number(stats.netRevenue) || 0;
                      if (raw >= 1000) return `$${(raw / 1000).toFixed(1)}K`;
                      return `$${raw.toFixed(0)}`;
                    })()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="brutal-border brutal-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary border-[3px] border-border rounded-full flex items-center justify-center">
                  <RefreshCcw className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Refunds</p>
                  <p className="text-2xl font-bold">
                    {(() => {
                      const raw = Number(stats.totalRefunds || 0);
                      if (raw >= 1000) return `$${(raw / 1000).toFixed(1)}K`;
                      return `$${raw.toFixed(0)}`;
                    })()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="brutal-border brutal-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent border-[3px] border-border rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{stats.transactionCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="brutal-border brutal-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email or username..."
                    className="pl-10"
                    value={tempFilters.search}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, search: e.target.value })
                    }
                  />
                </div>

                <Select
                  value={tempFilters.status}
                  onValueChange={(value) =>
                    setTempFilters({ ...tempFilters, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={tempFilters.paymentType}
                  onValueChange={(value) =>
                    setTempFilters({ ...tempFilters, paymentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Payment Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="role_upgrade">Role Upgrade</SelectItem>
                    <SelectItem value="renewal">Renewal</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={tempFilters.plan}
                  onValueChange={(value) =>
                    setTempFilters({ ...tempFilters, plan: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Plans" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input
                  type="number"
                  placeholder="Min Amount ($)"
                  value={tempFilters.minAmount}
                  onChange={(e) =>
                    setTempFilters({
                      ...tempFilters,
                      minAmount: e.target.value,
                    })
                  }
                />

                <Input
                  type="number"
                  placeholder="Max Amount ($)"
                  value={tempFilters.maxAmount}
                  onChange={(e) =>
                    setTempFilters({
                      ...tempFilters,
                      maxAmount: e.target.value,
                    })
                  }
                />

                <Select
                  value={tempFilters.month}
                  onValueChange={(value) =>
                    setTempFilters({ ...tempFilters, month: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="0">This Month</SelectItem>
                    <SelectItem value="1">Last Month</SelectItem>
                    <SelectItem value="2">2 Months Ago</SelectItem>
                    <SelectItem value="3">3 Months Ago</SelectItem>
                    <SelectItem value="6">Last 6 Months</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="default"
                  onClick={() => {
                    setFilters(tempFilters);
                    setPagination({ ...pagination, currentPage: 1 });
                  }}
                >
                  Apply Filters
                </Button>

                <Button
                  variant="outline-brutal"
                  onClick={() => {
                    const resetFilters = {
                      status: 'all',
                      paymentType: 'all',
                      plan: 'all',
                      search: '',
                      minAmount: '',
                      maxAmount: '',
                      month: 'all',
                    };
                    setTempFilters(resetFilters);
                    setFilters(resetFilters);
                    setPagination({ ...pagination, currentPage: 1 });
                  }}
                >
                  Reset
                </Button>
              </div>

              {/* Export Button Row */}
              <div className="flex justify-end">
                <Button variant="outline-brutal" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export to CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="brutal-border brutal-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              All Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Transaction ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment._id}>
                          <TableCell>
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {payment.user.username}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {payment.user.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">
                            ${payment.amount}
                            {payment.refundAmount > 0 && (
                              <span className="text-red-500 text-sm ml-2">
                                (-${payment.refundAmount})
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {getPaymentTypeBadge(payment.paymentType)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {payment.plan.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payment.status)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {payment.paymentMethod}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {payment.transactionId.substring(0, 16)}...
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {payments.length} of {pagination.totalPayments}{' '}
                    payments
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline-brutal"
                      size="sm"
                      disabled={pagination.currentPage === 1}
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          currentPage: pagination.currentPage - 1,
                        })
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline-brutal"
                      size="sm"
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          currentPage: pagination.currentPage + 1,
                        })
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPayments;
