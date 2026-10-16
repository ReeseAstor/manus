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
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <div className="text-[#d4af37] text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <Card className="max-w-md bg-[#1a1f3a]/80 border-[#d4af37]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#e5e5e5]">Sign In Required</CardTitle>
            <CardDescription className="text-[#e5e5e5]/60">
              Please sign in to view your profile and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button 
              className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27]"
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] py-20">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#e5e5e5] mb-2">My Profile</h1>
          <p className="text-[#e5e5e5]/60">Manage your account settings and preferences</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a1f3a]/60 border-[#d4af37]/20">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#e5e5e5]">
                {purchaseHistory?.stats.totalBooks || 0}
              </div>
              <div className="text-sm text-[#e5e5e5]/60">Books Owned</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1f3a]/60 border-[#d4af37]/20">
            <CardContent className="p-4 text-center">
              <Download className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#e5e5e5]">
                {purchaseHistory?.stats.totalDownloads || 0}
              </div>
              <div className="text-sm text-[#e5e5e5]/60">Downloads</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1f3a]/60 border-[#d4af37]/20">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#e5e5e5]">
                {formatCurrency(purchaseHistory?.stats.totalSpent || 0)}
              </div>
              <div className="text-sm text-[#e5e5e5]/60">Total Spent</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1f3a]/60 border-[#d4af37]/20">
            <CardContent className="p-4 text-center">
              <Eye className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#e5e5e5]">
                {recentlyViewed?.length || 0}
              </div>
              <div className="text-sm text-[#e5e5e5]/60">Books Viewed</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-[#1a1f3a]/60 border border-[#d4af37]/20">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0e27]">
              <Settings className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0e27]">
              <Bell className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0e27]">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Purchases
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0e27]">
              <History className="w-4 h-4 mr-2" />
              Recently Viewed
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Settings Tab */}
          <TabsContent value="profile">
            <Card className="bg-[#1a1f3a]/60 border-[#d4af37]/20">
              <CardHeader>
                <CardTitle className="text-[#e5e5e5]">Profile Settings</CardTitle>
                <CardDescription className="text-[#e5e5e5]/60">
                  Customize your profile and reading preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[#e5e5e5]">Display Name</Label>
                  <Input
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder={user.name || "Enter display name"}
                    className="bg-[#0a0e27]/50 border-[#d4af37]/20 text-[#e5e5e5]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[#e5e5e5]">Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="bg-[#0a0e27]/50 border-[#d4af37]/20 text-[#e5e5e5] min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[#e5e5e5]">Preferred Ebook Format</Label>
                  <Select
                    value={formData.preferredFormat}
                    onValueChange={(value: "epub" | "mobi" | "pdf") => 
                      setFormData({ ...formData, preferredFormat: value })
                    }
                  >
                    <SelectTrigger className="bg-[#0a0e27]/50 border-[#d4af37]/20 text-[#e5e5e5]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1f3a] border-[#d4af37]/20">
                      <SelectItem value="epub">ePub (Most Readers)</SelectItem>
                      <SelectItem value="mobi">Mobi (Kindle)</SelectItem>
                      <SelectItem value="pdf">PDF (Universal)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleSavePreferences}
                  disabled={updatePrefs.isPending}
                  className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27]"
                >
                  {updatePrefs.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Email Preferences Tab */}
          <TabsContent value="email">
            <Card className="bg-[#1a1f3a]/60 border-[#d4af37]/20">
              <CardHeader>
                <CardTitle className="text-[#e5e5e5]">Email Preferences</CardTitle>
                <CardDescription className="text-[#e5e5e5]/60">
                  Control what emails you receive from us
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#e5e5e5] font-medium">New Release Announcements</div>
                    <div className="text-sm text-[#e5e5e5]/60">Get notified when new books are released</div>
                  </div>
                  <Switch
                    checked={formData.emailNewReleases}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailNewReleases: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#e5e5e5] font-medium">Newsletter</div>
                    <div className="text-sm text-[#e5e5e5]/60">Monthly updates, behind-the-scenes content</div>
                  </div>
                  <Switch
                    checked={formData.emailNewsletter}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailNewsletter: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#e5e5e5] font-medium">Promotions & Deals</div>
                    <div className="text-sm text-[#e5e5e5]/60">Special offers and discounts</div>
                  </div>
                  <Switch
                    checked={formData.emailPromotions}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailPromotions: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#e5e5e5] font-medium">Blog Post Notifications</div>
                    <div className="text-sm text-[#e5e5e5]/60">Get notified when new blog posts are published</div>
                  </div>
                  <Switch
                    checked={formData.emailBlogPosts}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailBlogPosts: checked })}
                  />
                </div>
                
                <Button 
                  onClick={handleSavePreferences}
                  disabled={updatePrefs.isPending}
                  className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27]"
                >
                  {updatePrefs.isPending ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Purchases Tab */}
          <TabsContent value="purchases">
            <Card className="bg-[#1a1f3a]/60 border-[#d4af37]/20">
              <CardHeader>
                <CardTitle className="text-[#e5e5e5]">Purchase History</CardTitle>
                <CardDescription className="text-[#e5e5e5]/60">
                  View your purchased books and download them
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchasesLoading ? (
                  <div className="text-center py-8 text-[#e5e5e5]/60">Loading purchases...</div>
                ) : !purchaseHistory?.purchases.length ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-[#d4af37]/40 mx-auto mb-4" />
                    <p className="text-[#e5e5e5]/60 mb-4">You haven't purchased any books yet.</p>
                    <Link href="/books">
                      <Button className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27]">
                        Browse Books
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchaseHistory.purchases.map((purchase) => (
                      <div 
                        key={purchase.id}
                        className="flex items-center gap-4 p-4 bg-[#0a0e27]/30 rounded-lg border border-[#d4af37]/10"
                      >
                        <img
                          src={purchase.bookCover}
                          alt={purchase.bookTitle}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-[#e5e5e5] font-medium">{purchase.bookTitle}</h4>
                          <p className="text-sm text-[#e5e5e5]/60">
                            Purchased: {formatDate(purchase.purchasedAt)}
                          </p>
                          <p className="text-sm text-[#d4af37]">
                            {formatCurrency(purchase.purchasePrice)}
                          </p>
                        </div>
                        <Link href={`/my-purchases`}>
                          <Button size="sm" variant="outline" className="border-[#d4af37]/30 text-[#d4af37]">
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
            <Card className="bg-[#1a1f3a]/60 border-[#d4af37]/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#e5e5e5]">Recently Viewed</CardTitle>
                  <CardDescription className="text-[#e5e5e5]/60">
                    Books you've browsed recently
                  </CardDescription>
                </div>
                {recentlyViewed && recentlyViewed.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                    disabled={clearHistory.isPending}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="text-center py-8 text-[#e5e5e5]/60">Loading history...</div>
                ) : !recentlyViewed?.length ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-[#d4af37]/40 mx-auto mb-4" />
                    <p className="text-[#e5e5e5]/60 mb-4">No browsing history yet.</p>
                    <Link href="/books">
                      <Button className="bg-[#d4af37] hover:bg-[#c9a961] text-[#0a0e27]">
                        Browse Books
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentlyViewed.map((item) => (
                      <div 
                        key={item.bookId}
                        className="flex items-center gap-4 p-4 bg-[#0a0e27]/30 rounded-lg border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-colors"
                      >
                        <img
                          src={item.bookCover}
                          alt={item.bookTitle}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-[#e5e5e5] font-medium">{item.bookTitle}</h4>
                          {item.bookSeries && (
                            <p className="text-sm text-[#d4af37]">{item.bookSeries}</p>
                          )}
                          <div className="flex items-center gap-4 mt-1 text-sm text-[#e5e5e5]/60">
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
                          <Button size="sm" variant="outline" className="border-[#d4af37]/30 text-[#d4af37]">
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
