import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Mail, 
  BookOpen, 
  Download, 
  DollarSign, 
  Calendar,
  Settings,
  Bell,
  History,
  ShoppingBag,
  Eye,
  Trash2,
  ExternalLink
} from "lucide-react";

export default function Profile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Fetch profile data
  const { data: preferences, isLoading: prefsLoading } = trpc.profile.getPreferences.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: purchaseHistory, isLoading: purchasesLoading } = trpc.profile.getPurchaseHistory.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  const { data: recentlyViewed, isLoading: historyLoading, refetch: refetchHistory } = trpc.profile.getRecentlyViewed.useQuery(
    { limit: 10 },
    { enabled: !!user }
  );
  
  // Mutations
  const updatePrefs = trpc.profile.updatePreferences.useMutation({
    onSuccess: () => {
      alert("Preferences saved successfully!");
    },
  });
  
  const clearHistory = trpc.profile.clearHistory.useMutation({
    onSuccess: () => {
      refetchHistory();
      alert("Browsing history cleared!");
    },
  });
  
  // Local state for form
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    preferredFormat: "epub" as "epub" | "mobi" | "pdf",
    emailNewReleases: true,
    emailNewsletter: true,
    emailPromotions: true,
    emailBlogPosts: false,
  });
  
  // Update form when preferences load
  useState(() => {
    if (preferences) {
      setFormData({
        displayName: preferences.displayName || "",
        bio: preferences.bio || "",
        preferredFormat: (preferences.preferredFormat as "epub" | "mobi" | "pdf") || "epub",
        emailNewReleases: preferences.emailNewReleases ?? true,
        emailNewsletter: preferences.emailNewsletter ?? true,
        emailPromotions: preferences.emailPromotions ?? true,
        emailBlogPosts: preferences.emailBlogPosts ?? false,
      });
    }
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7] flex items-center justify-center">
        <div className="text-[#7A4F4C] text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7] flex items-center justify-center">
        <Card className="max-w-md bg-[#FAF7F7]/80 border-[#B59A6A]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#4A3B3A]">Sign In Required</CardTitle>
            <CardDescription className="text-[#4A3B3A]/60">
              Please sign in to view your profile and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button 
              className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7]"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const handleSavePreferences = () => {
    updatePrefs.mutate(formData);
  };
  
  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const formatCurrency = (cents: number | null) => {
    if (!cents) return "$0.00";
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F7] via-[#F0E6E5] to-[#FAF7F7] py-20">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#4A3B3A] mb-2">My Profile</h1>
          <p className="text-[#4A3B3A]/60">Manage your account settings and preferences</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#FAF7F7]/60 border-[#B59A6A]/20">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-[#7A4F4C] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#4A3B3A]">
                {purchaseHistory?.stats.totalBooks || 0}
              </div>
              <div className="text-sm text-[#4A3B3A]/60">Books Owned</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#FAF7F7]/60 border-[#B59A6A]/20">
            <CardContent className="p-4 text-center">
              <Download className="w-8 h-8 text-[#7A4F4C] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#4A3B3A]">
                {purchaseHistory?.stats.totalDownloads || 0}
              </div>
              <div className="text-sm text-[#4A3B3A]/60">Downloads</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#FAF7F7]/60 border-[#B59A6A]/20">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-[#7A4F4C] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#4A3B3A]">
                {formatCurrency(purchaseHistory?.stats.totalSpent || 0)}
              </div>
              <div className="text-sm text-[#4A3B3A]/60">Total Spent</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#FAF7F7]/60 border-[#B59A6A]/20">
            <CardContent className="p-4 text-center">
              <Eye className="w-8 h-8 text-[#7A4F4C] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#4A3B3A]">
                {recentlyViewed?.length || 0}
              </div>
              <div className="text-sm text-[#4A3B3A]/60">Books Viewed</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-[#FAF7F7]/60 border border-[#B59A6A]/20">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#7A4F4C] data-[state=active]:text-[#FAF7F7]">
              <Settings className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-[#7A4F4C] data-[state=active]:text-[#FAF7F7]">
              <Bell className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-[#7A4F4C] data-[state=active]:text-[#FAF7F7]">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Purchases
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#7A4F4C] data-[state=active]:text-[#FAF7F7]">
              <History className="w-4 h-4 mr-2" />
              Recently Viewed
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Settings Tab */}
          <TabsContent value="profile">
            <Card className="bg-[#FAF7F7]/60 border-[#B59A6A]/20">
              <CardHeader>
                <CardTitle className="text-[#4A3B3A]">Profile Settings</CardTitle>
                <CardDescription className="text-[#4A3B3A]/60">
                  Customize your profile and reading preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[#4A3B3A]">Display Name</Label>
                  <Input
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder={user.name || "Enter display name"}
                    className="bg-[#FAF7F7]/50 border-[#B59A6A]/20 text-[#4A3B3A]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[#4A3B3A]">Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="bg-[#FAF7F7]/50 border-[#B59A6A]/20 text-[#4A3B3A] min-h-[100px]"
                  />
                </div>
                
                <Button 
                  onClick={handleSavePreferences}
                  disabled={updatePrefs.isPending}
                  className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7]"
                >
                  {updatePrefs.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Email Preferences Tab */}
          <TabsContent value="email">
            <Card className="bg-[#FAF7F7]/60 border-[#B59A6A]/20">
              <CardHeader>
                <CardTitle className="text-[#4A3B3A]">Email Preferences</CardTitle>
                <CardDescription className="text-[#4A3B3A]/60">
                  Control what emails you receive from us
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#4A3B3A] font-medium">New Release Announcements</div>
                    <div className="text-sm text-[#4A3B3A]/60">Get notified when new books are released</div>
                  </div>
                  <Switch
                    checked={formData.emailNewReleases}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailNewReleases: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#4A3B3A] font-medium">Newsletter</div>
                    <div className="text-sm text-[#4A3B3A]/60">Monthly updates, behind-the-scenes content</div>
                  </div>
                  <Switch
                    checked={formData.emailNewsletter}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailNewsletter: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#4A3B3A] font-medium">Promotions & Deals</div>
                    <div className="text-sm text-[#4A3B3A]/60">Special offers and discounts</div>
                  </div>
                  <Switch
                    checked={formData.emailPromotions}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailPromotions: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#4A3B3A] font-medium">Blog Post Notifications</div>
                    <div className="text-sm text-[#4A3B3A]/60">Get notified when new blog posts are published</div>
                  </div>
                  <Switch
                    checked={formData.emailBlogPosts}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailBlogPosts: checked })}
                  />
                </div>
                
                <Button 
                  onClick={handleSavePreferences}
                  disabled={updatePrefs.isPending}
                  className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7]"
                >
                  {updatePrefs.isPending ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Purchases Tab */}
          <TabsContent value="purchases">
            <Card className="bg-[#FAF7F7]/60 border-[#B59A6A]/20">
              <CardHeader>
                <CardTitle className="text-[#4A3B3A]">Purchase History</CardTitle>
                <CardDescription className="text-[#4A3B3A]/60">
                  View your purchased books and download them
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchasesLoading ? (
                  <div className="text-center py-8 text-[#4A3B3A]/60">Loading purchases...</div>
                ) : !purchaseHistory?.purchases.length ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-[#7A4F4C]/40 mx-auto mb-4" />
                    <p className="text-[#4A3B3A]/60 mb-4">You haven't purchased any books yet.</p>
                    <Link href="/books">
                      <Button className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7]">
                        Browse Books
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchaseHistory.purchases.map((purchase) => (
                      <div 
                        key={purchase.id}
                        className="flex items-center gap-4 p-4 bg-[#FAF7F7]/30 rounded-lg border border-[#B59A6A]/10"
                      >
                        <img
                          src={purchase.bookCover}
                          alt={purchase.bookTitle}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-[#4A3B3A] font-medium">{purchase.bookTitle}</h4>
                          <p className="text-sm text-[#4A3B3A]/60">
                            Purchased: {formatDate(purchase.purchasedAt)}
                          </p>
                          <p className="text-sm text-[#7A4F4C]">
                            {formatCurrency(purchase.purchasePrice)}
                          </p>
                        </div>
                        <Link href={`/my-purchases`}>
                          <Button size="sm" variant="outline" className="border-[#B59A6A]/30 text-[#7A4F4C]">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Recently Viewed Tab */}
          <TabsContent value="history">
            <Card className="bg-[#FAF7F7]/60 border-[#B59A6A]/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#4A3B3A]">Recently Viewed</CardTitle>
                  <CardDescription className="text-[#4A3B3A]/60">
                    Books you've browsed recently
                  </CardDescription>
                </div>
                {recentlyViewed && recentlyViewed.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                    disabled={clearHistory.isPending}
                    className="border-[#C9A3A0]/30 text-[#7A4F4C] hover:bg-[#7A4F4C]/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="text-center py-8 text-[#4A3B3A]/60">Loading history...</div>
                ) : !recentlyViewed?.length ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-[#7A4F4C]/40 mx-auto mb-4" />
                    <p className="text-[#4A3B3A]/60 mb-4">No browsing history yet.</p>
                    <Link href="/books">
                      <Button className="bg-[#4A3B3A] hover:bg-[#7A4F4C] text-[#FAF7F7]">
                        Browse Books
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentlyViewed.map((item) => (
                      <div 
                        key={item.bookId}
                        className="flex items-center gap-4 p-4 bg-[#FAF7F7]/30 rounded-lg border border-[#B59A6A]/10 hover:border-[#B59A6A]/30 transition-colors"
                      >
                        <img
                          src={item.bookCover}
                          alt={item.bookTitle}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-[#4A3B3A] font-medium">{item.bookTitle}</h4>
                          {item.bookSeries && (
                            <p className="text-sm text-[#7A4F4C]">{item.bookSeries}</p>
                          )}
                          <div className="flex items-center gap-4 mt-1 text-sm text-[#4A3B3A]/60">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {item.viewCount} {item.viewCount === 1 ? "view" : "views"}
                            </span>
                            <span>
                              Last viewed: {formatDate(item.lastViewedAt)}
                            </span>
                          </div>
                        </div>
                        <Link href={`/books/${item.bookSlug}`}>
                          <Button size="sm" variant="outline" className="border-[#B59A6A]/30 text-[#7A4F4C]">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
