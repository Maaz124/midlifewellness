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

  // Check if we're in development mode (for bypassing auth)
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

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
    mutationFn: async (keys: { publishableKey: string; secretKey: string }) => {
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
        secretKey: currentKeys.secretKey === "***hidden***" ? "" : (currentKeys.secretKey || ""),
      });
    }
  }, [currentKeys]);

  // Redirect if not authenticated (only in production) - must be before any conditional returns
  useEffect(() => {
    if (!isDev && !isLoadingUser && !adminUser && !adminUserError) {
      // Wait a moment to see if user data loads
      const timer = setTimeout(() => {
        if (!adminUser) {
          setLocation("/admin/login");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [adminUser, isLoadingUser, adminUserError, setLocation, isDev]);

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
    if (!stripeKeys.publishableKey || !stripeKeys.secretKey) {
      toast({
        title: "Validation Error",
        description: "Both publishable and secret keys are required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateKeysMutation.mutateAsync(stripeKeys);
    } finally {
      setIsSaving(false);
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

  // Show error state (only in production)
  if (adminUserError && !isDev) {
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

  // If no admin user but not loading, show error (only in production)
  if (!isDev && !adminUser && !isLoadingUser && !adminUserError) {
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

  // Use mock admin user in development if needed
  const displayUser = adminUser || (isDev ? {
    id: "dev-admin",
    email: "admin@dev.local",
    firstName: "Admin",
    lastName: "User",
    isAdmin: true
  } : null);

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        {statsError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Error loading statistics:</strong> {statsError instanceof Error ? statsError.message : "Unknown error"}
            </p>
          </div>
        )}

        {keysError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Error loading Stripe keys:</strong> {keysError instanceof Error ? keysError.message : "Unknown error"}
            </p>
          </div>
        )}

        {usersError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Error loading users:</strong> {usersError instanceof Error ? usersError.message : "Unknown error"}
            </p>
          </div>
        )}

        {/* Refresh Stats Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => {
              refetchStats();
              refetchKeys();
              refetchUsers();
            }}
            disabled={isLoadingStats || isLoadingKeys || isLoadingUsers}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingStats || isLoadingKeys || isLoadingUsers ? "animate-spin" : ""}`} />
            Refresh All Data
          </Button>
        </div>

        {/* Users List */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-purple-600" />
                  All Users
                </CardTitle>
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
            ) : allUsers && allUsers.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
                                Premium
                              </span>
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
                        </div>
                      </div>
                    </div>
                  ))}
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

        {/* Stripe Keys Configuration */}
        <Card className="mb-6">
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
      </div>
    </div>
  );
}

export default AdminDashboard;
