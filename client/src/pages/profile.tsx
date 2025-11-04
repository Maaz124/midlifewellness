import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Lock,
  Save,
  Loader2,
  CheckCircle,
  CreditCard,
  Crown,
  Eye,
  EyeOff
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  profileImageUrl: string | null;
  hasCoachingAccess: boolean;
  coachingAccessGrantedAt: string | null;
  createdAt: string;
}

export default function ProfileSettings() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch full user profile
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['/api/users/me'],
    enabled: isAuthenticated
  });

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Password change dialog states
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      return await apiRequest('PUT', '/api/users/me', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setSaveStatus('saved');
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: (error: any) => {
      setSaveStatus('idle');
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    setSaveStatus('saving');
    updateProfileMutation.mutate({
      firstName: firstName.trim() || null,
      lastName: lastName.trim() || null,
      phone: phone.trim() || null,
    });
  };

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return await apiRequest('PUT', '/api/users/me/password', data);
    },
    onSuccess: () => {
      setPasswordChangeSuccess(true);
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Close dialog after 2 seconds
      setTimeout(() => {
        setIsPasswordDialogOpen(false);
        setPasswordChangeSuccess(false);
      }, 2000);
    },
    onError: (error: any) => {
      setIsChangingPassword(false);
      toast({
        title: "Password change failed",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChangePassword = () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "All password fields are required",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New password and confirm password do not match",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  const handleOpenPasswordDialog = () => {
    setIsPasswordDialogOpen(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordChangeSuccess(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Please log in to view your profile settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Account Status Banner */}
      {profile?.hasCoachingAccess && (
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-pink-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  Full Access
                  <Badge variant="default" className="bg-primary">Active</Badge>
                </h3>
                <p className="text-sm text-gray-600">
                  Access granted on {new Date(profile.coachingAccessGrantedAt || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Information */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Separator />

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={saveStatus === 'saving'}
              className="min-w-[120px]"
            >
              {saveStatus === 'saving' && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {saveStatus === 'saved' && (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              {saveStatus === 'idle' && (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>View your account details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-gray-500 text-sm">Account ID</Label>
              <p className="font-mono text-sm">{profile?.id}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-500 text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member Since
              </Label>
              <p className="text-sm">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-gray-700 font-semibold">Account Status</Label>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Coaching Access</p>
                  <p className="text-xs text-gray-500">
                    {profile?.hasCoachingAccess ? 'Full access to all features' : 'Basic access'}
                  </p>
                </div>
              </div>
              <Badge variant={profile?.hasCoachingAccess ? "default" : "secondary"}>
                {profile?.hasCoachingAccess ? 'Full Access' : 'Free'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Lock className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-gray-500">Last changed recently</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleOpenPasswordDialog}>
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Section (if no coaching access) */}
      {!profile?.hasCoachingAccess && (
        <Card className="mt-6 border-primary/30 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">Unlock Full Access</h3>
                <p className="text-sm text-gray-600">
                  Get full access to coaching programs, journal features, and exclusive content
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => window.location.href = '/checkout'}
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password
            </DialogDescription>
          </DialogHeader>
          
          {passwordChangeSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900">Password successfully changed and saved</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isChangingPassword}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isChangingPassword}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {passwordChangeSuccess ? (
              <Button onClick={() => setIsPasswordDialogOpen(false)}>
                Close
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordDialogOpen(false)}
                  disabled={isChangingPassword}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

