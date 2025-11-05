import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Users as UsersIcon,
  CreditCard,
  DollarSign,
  Key,
  LogOut,
  ArrowLeft,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  Mail,
  User as UserIcon,
  Tag,
  Search,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  usersWithPayments: number;
  usersWithoutPayments: number;
  usersWithCoachingAccess: number;
  usersWithResourcePurchases: number;
}

interface StripeKeys {
  publishableKey: string;
  secretKey: string;
  source: string;
}

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  emailVerified: boolean | null;
  hasCoachingAccess: boolean | null;
  isAdmin: boolean | null;
  createdAt: Date | string;
}

function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [stripeKeys, setStripeKeys] = useState({
    publishableKey: "",
    secretKey: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [coachingCurrentPrice, setCoachingCurrentPrice] = useState<string>("");
  const [coachingRegularPrice, setCoachingRegularPrice] = useState<string>("");
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [emailConfig, setEmailConfig] = useState({
    gmailUser: "",
    gmailAppPassword: "",
    coachingInbox: "",
  });
  const [showGmailPassword, setShowGmailPassword] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [inquiriesSearch, setInquiriesSearch] = useState("");
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'prices' | 'email' | 'inquiries' | 'stripe'>("overview");

  // Enforce admin-only access regardless of environment
  const isDev = false;

  // Debug logging (remove in production)
  useEffect(() => {
    console.log("[AdminDashboard] Component mounted");
  }, []);

  // Check admin authentication (bypassed in development)
  const { 
    data: adminUser, 
    isLoading: isLoadingUser, 
    error: adminUserError 
  } = useQuery({
    queryKey: ["/api/admin/user"],
    queryFn: async () => {
      console.log("[AdminDashboard] Fetching admin user...");
      try {
        const res = await fetch("/api/admin/user", { credentials: "include" });
        console.log("[AdminDashboard] Admin user response:", res.status, res.ok);
        if (!res.ok) {
          // In development, allow access even without authentication
          if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
            console.log("[AdminDashboard] Development mode: Using mock admin user");
            return {
              id: "dev-admin",
              email: "admin@dev.local",
              firstName: "Admin",
              lastName: "User",
              isAdmin: true
            };
          }
          if (res.status === 401 || res.status === 403) {
            console.log("[AdminDashboard] Not authenticated, redirecting...");
            setLocation("/admin/login");
            throw new Error("Not authenticated as admin");
          }
          const errorText = await res.text().catch(() => res.statusText);
          throw new Error(`Failed to fetch admin user: ${errorText}`);
        }
        const userData = await res.json();
        console.log("[AdminDashboard] Admin user data:", userData);
        return userData;
      } catch (error) {
        // In development, allow access even if there's an error
        if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
          console.log("[AdminDashboard] Development mode: Using mock admin user (error occurred)");
          return {
            id: "dev-admin",
            email: "admin@dev.local",
            firstName: "Admin",
            lastName: "User",
            isAdmin: true
          };
        }
        console.error("[AdminDashboard] Error fetching admin user:", error);
        throw error;
      }
    },
    retry: false,
    enabled: true,
  });

  // Fetch coaching inquiries for admin
  const { data: inquiries = [], isLoading: isLoadingInquiries, refetch: refetchInquiries } = useQuery({
    queryKey: ["/api/admin/coaching-inquiries"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/coaching-inquiries");
      return res.json();
    },
  });

  // Debug logging for admin user state
  useEffect(() => {
    console.log("[AdminDashboard] Admin user state:", { 
      adminUser, 
      isLoadingUser, 
      adminUserError 
    });
  }, [adminUser, isLoadingUser, adminUserError]);

  // Fetch admin statistics
  const { 
    data: stats, 
    isLoading: isLoadingStats, 
    error: statsError,
    refetch: refetchStats 
  } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (!res.ok) {
        const errorText = await res.text().catch(() => res.statusText);
        throw new Error(`Failed to fetch stats: ${errorText}`);
      }
      return res.json();
    },
    enabled: true, // Allow fetching even without adminUser in dev mode
    retry: false,
  });

  // Fetch Stripe keys
  const { 
    data: currentKeys, 
    isLoading: isLoadingKeys, 
    error: keysError,
    refetch: refetchKeys 
  } = useQuery<StripeKeys>({
    queryKey: ["/api/admin/stripe-keys"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stripe-keys", { credentials: "include" });
      if (!res.ok) {
        const errorText = await res.text().catch(() => res.statusText);
        throw new Error(`Failed to fetch Stripe keys: ${errorText}`);
      }
      return res.json();
    },
    enabled: true, // Allow fetching even without adminUser in dev mode
    retry: false,
  });

  // Fetch coaching price
  const { 
    data: priceData, 
    isLoading: isLoadingPrice, 
    error: priceError,
    refetch: refetchPrice 
  } = useQuery<{ currentPrice: number; regularPrice: number }>({
    queryKey: ["/api/admin/coaching-price"],
    queryFn: async () => {
      const res = await fetch("/api/admin/coaching-price", { credentials: "include" });
      if (!res.ok) {
        const errorText = await res.text().catch(() => res.statusText);
        throw new Error(`Failed to fetch coaching price: ${errorText}`);
      }
      return res.json();
    },
    enabled: true,
    retry: false,
  });

  // Fetch all users
  const { 
    data: allUsers, 
    isLoading: isLoadingUsers, 
    error: usersError,
    refetch: refetchUsers 
  } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      
      // Check if response is HTML (error page) instead of JSON
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
          throw new Error("Server returned HTML instead of JSON. The API endpoint may not be available.");
        }
        throw new Error(`Unexpected response type: ${contentType}`);
      }
      
      if (!res.ok) {
        // Try to parse as JSON, fallback to text
        let errorMessage = res.statusText;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
        }
        throw new Error(errorMessage || `Failed to fetch users: ${res.status} ${res.statusText}`);
      }
      
      // Parse JSON response
      try {
        return await res.json();
      } catch (error) {
        throw new Error("Failed to parse JSON response from server");
      }
    },
    enabled: true,
    retry: 1, // Retry once in case of transient errors
  });

  // Update Stripe keys mutation
  const updateKeysMutation = useMutation({
    mutationFn: async (keys: { publishableKey: string; secretKey?: string }) => {
      return apiRequest("PUT", "/api/admin/stripe-keys", keys);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Stripe keys updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stripe-keys"] });
      refetchKeys();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update Stripe keys",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (currentKeys) {
      setStripeKeys({
        publishableKey: currentKeys.publishableKey || "",
        // Keep masked value so field appears populated; we'll ignore it on save
        secretKey: currentKeys.secretKey ? currentKeys.secretKey : "",
      });
    }
  }, [currentKeys]);

  useEffect(() => {
    if (priceData) {
      setCoachingCurrentPrice(String(priceData.currentPrice ?? ""));
      setCoachingRegularPrice(String(priceData.regularPrice ?? ""));
    }
  }, [priceData]);

  // Fetch email configuration
  const { data: emailConfigData, isLoading: isLoadingEmailConfig, refetch: refetchEmailConfig } = useQuery({
    queryKey: ["/api/admin/email-config"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/email-config");
      return res.json();
    },
  });

  useEffect(() => {
    if (emailConfigData) {
      setEmailConfig({
        gmailUser: emailConfigData.gmailUser || "",
        // Preserve masked value so the field shows as populated without exposing secret
        gmailAppPassword: emailConfigData.gmailAppPassword || "",
        coachingInbox: emailConfigData.coachingInbox || "",
      });
    }
  }, [emailConfigData]);

  const handleSaveEmailConfig = async () => {
    try {
      setIsSaving(true);
      // Build payload; if password is masked, omit to keep existing
      const payload: any = {
        gmailUser: emailConfig.gmailUser,
        coachingInbox: emailConfig.coachingInbox,
      };
      if (emailConfig.gmailAppPassword && emailConfig.gmailAppPassword !== "***hidden***") {
        payload.gmailAppPassword = emailConfig.gmailAppPassword;
      }
      await apiRequest("PUT", "/api/admin/email-config", payload);
      toast({ title: "Email settings updated" });
      await refetchEmailConfig();
    } catch (e: any) {
      toast({ title: "Failed to update email settings", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Redirect if not authenticated (only in production) - must be before any conditional returns
  useEffect(() => {
    if (!isLoadingUser && (!adminUser || !adminUser.isAdmin)) {
      // Wait a moment to see if user data loads
      const timer = setTimeout(() => {
        if (!adminUser || !adminUser.isAdmin) {
          setLocation("/admin/login");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [adminUser, isLoadingUser, adminUserError, setLocation]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout", {});
      queryClient.clear();
      setLocation("/admin/login");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const handleSaveKeys = async () => {
    if (!stripeKeys.publishableKey) {
      toast({
        title: "Validation Error",
        description: "Publishable key is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = { publishableKey: stripeKeys.publishableKey };
      // Only send secret if user provided a new one (not masked placeholder)
      if (stripeKeys.secretKey && stripeKeys.secretKey !== "***hidden***") {
        payload.secretKey = stripeKeys.secretKey;
      }
      await updateKeysMutation.mutateAsync(payload);
    } finally {
      setIsSaving(false);
    }
  };

  // Update coaching price mutation
  const updatePriceMutation = useMutation({
    mutationFn: async (payload: { currentPrice: number; regularPrice?: number }) => {
      return apiRequest("PUT", "/api/admin/coaching-price", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Coaching price updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coaching-price"] });
      queryClient.invalidateQueries({ queryKey: ["/api/coaching-price"] }); // Also invalidate public endpoint cache
      refetchPrice();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update coaching price",
        variant: "destructive",
      });
    },
  });

  const handleSavePrice = async () => {
    const current = parseFloat(coachingCurrentPrice);
    const regular = coachingRegularPrice ? parseFloat(coachingRegularPrice) : undefined;
    if (!coachingCurrentPrice || isNaN(current) || current <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid positive number for the current price",
        variant: "destructive",
      });
      return;
    }

    setIsSavingPrice(true);
    try {
      await updatePriceMutation.mutateAsync({ currentPrice: current, regularPrice: regular });
    } finally {
      setIsSavingPrice(false);
    }
  };

  // Show loading state
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (adminUserError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Authentication Error</CardTitle>
            <CardDescription>
              {adminUserError instanceof Error ? adminUserError.message : "Failed to authenticate"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/admin/login")} className="w-full">
              Return to Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no admin user or not an admin and not loading, show access denied
  if ((!adminUser || !adminUser.isAdmin) && !isLoadingUser && !adminUserError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You must be logged in as an administrator to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/admin/login")} className="w-full">
              Go to Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only show the real authenticated admin user
  const displayUser = adminUser;

  // Filter users based on search term (searches both name and email)
  const filteredUsers = allUsers && allUsers.length > 0 ? allUsers.filter((user) => {
    if (!userSearch) return true;
    const searchTerm = userSearch.toLowerCase();
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim().toLowerCase();
    const email = user.email?.toLowerCase() || "";
    return fullName.includes(searchTerm) || email.includes(searchTerm);
  }) : [];

  // Check if a user matches the search criteria (for highlighting)
  const isMatchingUser = (user: User) => {
    if (!userSearch) return false;
    const searchTerm = userSearch.toLowerCase();
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim().toLowerCase();
    const email = user.email?.toLowerCase() || "";
    return fullName.includes(searchTerm) || email.includes(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-8 h-8 text-purple-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {displayUser?.firstName || displayUser?.email || "Admin"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Layout with left sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Admin Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant={activeSection==='overview' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setActiveSection('overview')}>Dashboard Overview</Button>
                <Button variant={activeSection==='users' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setActiveSection('users')}>Users</Button>
                <Button variant={activeSection==='prices' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setActiveSection('prices')}>Pricing</Button>
                <Button variant={activeSection==='stripe' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setActiveSection('stripe')}>Stripe Settings</Button>
                <Button variant={activeSection==='email' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setActiveSection('email')}>Email Settings</Button>
                <Button variant={activeSection==='inquiries' ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setActiveSection('inquiries')}>Coaching Inquiries</Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-9">

        {/* Stats Cards */}
        <div className={`${activeSection==='overview' ? '' : 'hidden'} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : stats?.totalUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users with Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {isLoadingStats ? "..." : stats?.usersWithPayments || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Coaching access: {stats?.usersWithCoachingAccess || 0} | Purchases: {stats?.usersWithResourcePurchases || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users without Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {isLoadingStats ? "..." : stats?.usersWithoutPayments || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Free tier users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {isLoadingStats || !stats?.totalUsers
                  ? "..."
                  : `${Math.round(((stats?.usersWithPayments || 0) / stats.totalUsers) * 100)}%`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Conversion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Error Messages */}
        {activeSection==='overview' && statsError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Error loading statistics:</strong> {statsError instanceof Error ? statsError.message : "Unknown error"}
            </p>
          </div>
        )}

        {activeSection==='overview' && keysError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Error loading Stripe keys:</strong> {keysError instanceof Error ? keysError.message : "Unknown error"}
            </p>
          </div>
        )}

        {activeSection==='overview' && priceError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Error loading coaching price:</strong> {priceError instanceof Error ? priceError.message : "Unknown error"}
            </p>
          </div>
        )}

        {activeSection==='overview' && usersError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Error loading users:</strong> {usersError instanceof Error ? usersError.message : "Unknown error"}
            </p>
          </div>
        )}

        {/* Refresh Stats Button */}
        <div className={`${activeSection==='overview' ? '' : 'hidden'} mb-6`}>
          <Button
            variant="outline"
            onClick={() => {
              refetchStats();
              refetchKeys();
              refetchPrice();
              refetchUsers();
            }}
            disabled={isLoadingStats || isLoadingKeys || isLoadingPrice || isLoadingUsers}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingStats || isLoadingKeys || isLoadingPrice || isLoadingUsers ? "animate-spin" : ""}`} />
            Refresh All Data
          </Button>
        </div>

        {/* Coaching Price Management */}
        <Card className={`${activeSection==='prices' ? '' : 'hidden'} mb-6`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-600" />
                  Coaching Program Price Management
                </CardTitle>
                <CardDescription className="mt-2">
                  Set both Regular/List price and Current price. The discount is automatically calculated.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingPrice ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="w-5 h-5 animate-spin text-purple-600 mr-2" />
                <p className="text-gray-600">Loading price...</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="regular-price">Regular/List Price (USD)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-700">$</span>
                    <Input
                      id="regular-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="297.00"
                      value={coachingRegularPrice}
                      onChange={(e) => setCoachingRegularPrice(e.target.value)}
                      disabled={isLoadingPrice || isSavingPrice}
                      className="text-lg font-semibold"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Displayed as the crossed-out price</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-price">Current Price (USD)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-700">$</span>
                    <Input
                      id="current-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="150.00"
                      value={coachingCurrentPrice}
                      onChange={(e) => setCoachingCurrentPrice(e.target.value)}
                      disabled={isLoadingPrice || isSavingPrice}
                      className="text-lg font-semibold"
                    />
                  </div>
                  {priceData && (
                    <p className="text-sm text-gray-600">
                      Current: <span className="font-semibold">${priceData.currentPrice.toFixed(2)}</span>{' '}
                      {priceData.regularPrice ? (
                        <>
                          | Regular: <span className="font-semibold">${priceData.regularPrice.toFixed(2)}</span>
                        </>
                      ) : null}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSavePrice}
                    disabled={isLoadingPrice || isSavingPrice}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSavingPrice ? "Saving..." : "Save Prices"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => refetchPrice()}
                    disabled={isLoadingPrice || isSavingPrice}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingPrice ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Changes to the price will be reflected immediately across all pages. 
                    The price update affects all new checkout sessions and payment intents.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className={`${activeSection==='users' ? '' : 'hidden'} mb-6`}>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="w-5 h-5 text-purple-600" />
                    All Users
                  </CardTitle>
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <CardDescription className="mt-2">
                  View all registered users with their contact information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                <p className="ml-2 text-gray-600">Loading users...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {filteredUsers.map((user) => {
                    const isHighlighted = isMatchingUser(user);
                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                          isHighlighted
                            ? "border-purple-500 bg-purple-50 shadow-md ring-2 ring-purple-200"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">
                                {user.firstName || user.lastName
                                  ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                                  : "No name"}
                              </p>
                              {user.isAdmin && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                  Admin
                                </span>
                              )}
                              {user.hasCoachingAccess && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                Full Access
                              </span>
                            )}
                              {typeof (user as any).amountPaidUsdCents === 'number' && (user as any).amountPaidUsdCents > 0 && (
                                <>
                                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    ${(((user as any).amountPaidUsdCents || 0) / 100).toFixed(2)} paid
                                  </span>
                                  {user.hasCoachingAccess && user.coachingAccessGrantedAt && (
                                    <span className="ml-2 text-xs text-gray-500">
                                      Paid on {new Date(user.coachingAccessGrantedAt).toLocaleDateString()} at {new Date(user.coachingAccessGrantedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-1" />
                              <span className="truncate">{user.email}</span>
                              {user.emailVerified && (
                                <span className="ml-2 text-green-600 text-xs">✓ Verified</span>
                              )}
                            </div>
                            {user.phone && (
                              <p className="text-xs text-gray-500 mt-1">{user.phone}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Joined: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 break-all">
                              ID: {user.id}
                            </p>
                            {/* Payment time shown inline with the paid badge above */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UsersIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No users found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coaching Inquiries */}
        <Card className={`${activeSection==='inquiries' ? '' : 'hidden'} mb-6`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-600" />
                <div>
                  <CardTitle>Personal Coaching Inquiries</CardTitle>
                  <CardDescription>Submissions from the public form (email also sent)</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name or email"
                  value={inquiriesSearch}
                  onChange={(e) => setInquiriesSearch(e.target.value)}
                />
                <Button variant="outline" onClick={() => refetchInquiries()}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingInquiries ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingInquiries ? (
              <div className="flex items-center justify-center py-8 text-gray-600">Loading inquiries…</div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No inquiries yet.</div>
            ) : (
              <div className="space-y-3">
                {inquiries
                  .filter((inq: any) => {
                    const q = inquiriesSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      (inq.name || '').toLowerCase().includes(q) ||
                      (inq.email || '').toLowerCase().includes(q)
                    );
                  })
                  .map((inq: any) => (
                    <div key={inq.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{inq.name}</div>
                          <div className="text-sm text-gray-600">{inq.email}{inq.phone ? ` • ${inq.phone}` : ''}</div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : ''}
                        </div>
                      </div>
                      <div className="mt-2 grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                        <div><span className="font-medium">Coaching Interest:</span> {inq.coachingType}</div>
                        {inq.preferredSchedule && (
                          <div><span className="font-medium">Preferred Schedule:</span> {inq.preferredSchedule}</div>
                        )}
                        {inq.goals && (
                          <div className="md:col-span-2"><span className="font-medium">Goals:</span> {inq.goals}</div>
                        )}
                        {inq.challenges && (
                          <div className="md:col-span-2"><span className="font-medium">Challenges:</span> {inq.challenges}</div>
                        )}
                        {inq.experience && (
                          <div className="md:col-span-2"><span className="font-medium">Previous Experience:</span> {inq.experience}</div>
                        )}
                        {inq.additionalInfo && (
                          <div className="md:col-span-2"><span className="font-medium">Additional Info:</span> {inq.additionalInfo}</div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stripe Keys Configuration */}
        <Card className={`${activeSection==='stripe' ? '' : 'hidden'} mb-6`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-600" />
                  Stripe Keys Configuration
                </CardTitle>
                <CardDescription className="mt-2">
                  Manage your Stripe API keys. Keys are stored securely in the database.
                  {currentKeys?.source && (
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                      Source: {currentKeys.source}
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="publishable-key">Stripe Publishable Key</Label>
              <Input
                id="publishable-key"
                type="text"
                placeholder="pk_test_..."
                value={stripeKeys.publishableKey}
                onChange={(e) =>
                  setStripeKeys((prev) => ({ ...prev, publishableKey: e.target.value }))
                }
                disabled={isLoadingKeys || isSaving}
              />
              <p className="text-xs text-muted-foreground">
                Public key that can be safely used in client-side code
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret-key">Stripe Secret Key</Label>
              <div className="relative">
                <Input
                  id="secret-key"
                  type={showSecretKey ? "text" : "password"}
                  placeholder="sk_test_..."
                  value={stripeKeys.secretKey}
                  onChange={(e) =>
                    setStripeKeys((prev) => ({ ...prev, secretKey: e.target.value }))
                  }
                  disabled={isLoadingKeys || isSaving}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Secret key - keep this secure and never expose it publicly
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveKeys}
                disabled={isLoadingKeys || isSaving}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Keys"}
              </Button>
              <Button
                variant="outline"
                onClick={() => refetchKeys()}
                disabled={isLoadingKeys || isSaving}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingKeys ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> After updating keys, you may need to restart the server for
                changes to take full effect. The secret key will be masked in the database for
                security.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className={`${activeSection==='email' ? '' : 'hidden'} mb-6`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-600" />
                <div>
                  <CardTitle>Email Settings (Gmail)</CardTitle>
                  <CardDescription>Configure Gmail sender and coaching inbox</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gmail-user">Gmail User</Label>
              <Input
                id="gmail-user"
                type="email"
                placeholder="youraccount@gmail.com"
                value={emailConfig.gmailUser}
                onChange={(e) => setEmailConfig((p) => ({ ...p, gmailUser: e.target.value }))}
                disabled={isLoadingEmailConfig || isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gmail-app-password">Gmail App Password</Label>
              <div className="relative">
                <Input
                  id="gmail-app-password"
                  type={showGmailPassword ? "text" : "password"}
                  placeholder="16-character app password"
                  value={emailConfig.gmailAppPassword}
                  onChange={(e) => setEmailConfig((p) => ({ ...p, gmailAppPassword: e.target.value }))}
                  disabled={isLoadingEmailConfig || isSaving}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowGmailPassword(!showGmailPassword)}
                >
                  {showGmailPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Use a Gmail App Password (Google Account → Security → App Passwords)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coaching-inbox">Coaching Inbox (Recipient)</Label>
              <Input
                id="coaching-inbox"
                type="email"
                placeholder="coaching@domain.com"
                value={emailConfig.coachingInbox}
                onChange={(e) => setEmailConfig((p) => ({ ...p, coachingInbox: e.target.value }))}
                disabled={isLoadingEmailConfig || isSaving}
              />
              <p className="text-xs text-muted-foreground">Where admin notifications are sent</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveEmailConfig} disabled={isLoadingEmailConfig || isSaving} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Email Settings"}
              </Button>
              <Button variant="outline" onClick={() => refetchEmailConfig()} disabled={isLoadingEmailConfig || isSaving}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingEmailConfig ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-blue-800">
                Changes are stored in the database. The sender uses these values for new emails.
              </p>
            </div>
          </CardContent>
        </Card>
          </div>{/* end main */}
        </div>{/* end grid */}
      </div>
    </div>
  );
}

export default AdminDashboard;
