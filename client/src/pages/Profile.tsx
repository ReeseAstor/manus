import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  BookOpen, 
  Download, 
  Settings, 
  Bell, 
  FileText,
  DollarSign,
  Calendar,
  Loader2,
  Save,
  CheckCircle
} from "lucide-react";


export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch preferences
  const { data: preferences, isLoading: prefsLoading, refetch: refetchPrefs } = trpc.profile.getPreferences.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Fetch purchase history
  const { data: purchaseData, isLoading: purchasesLoading } = trpc.profile.getPurchaseHistory.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Local state for form
  const [formData, setFormData] = useState({
    emailNewReleases: true,
    emailNewsletter: true,
    emailPromotions: true,
    emailBlogPosts: false,
    preferredFormat: "epub" as "epub" | "mobi" | "pdf",
    displayName: "",
    bio: "",
  });

  // Update form when preferences load
  useEffect(() => {
    if (preferences) {
      setFormData({
        emailNewReleases: preferences.emailNewReleases ?? true,
        emailNewsletter: preferences.emailNewsletter ?? true,
        emailPromotions: preferences.emailPromotions ?? true,
        emailBlogPosts: preferences.emailBlogPosts ?? false,
        preferredFormat: (preferences.preferredFormat as "epub" | "mobi" | "pdf") ?? "epub",
        displayName: preferences.displayName ?? "",
        bio: preferences.bio ?? "",
      });
    }
  }, [preferences]);

  // Update preferences mutation
  const updatePrefs = trpc.profile.updatePreferences.useMutation({
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // Show success feedback via saved state
      refetchPrefs();
    },
    onError: (error) => {
      alert(error.message || "Failed to save preferences");
    },
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePrefs.mutateAsync(formData);
    } finally {
      setSaving(false);
    }
  };

  // SEO meta tags
  useEffect(() => {
    document.title = "My Profile | Reese Astor";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Manage your account preferences, email settings, and view your purchase history.");
    }
  }, []);

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <User className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access your profile and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.location.href = getLoginUrl()}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (authLoading || prefsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-playfair font-bold text-foreground">
                {formData.displayName || user?.name || "My Profile"}
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container max-w-4xl">
          <Tabs defaultValue="preferences" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Email Settings</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Purchase History</span>
              </TabsTrigger>
            </TabsList>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Customize your profile and reading preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      placeholder="How should we address you?"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">About You</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself and your reading preferences..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      maxLength={500}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Preferred Ebook Format</Label>
                    <Select
                      value={formData.preferredFormat}
                      onValueChange={(value: "epub" | "mobi" | "pdf") => 
                        setFormData({ ...formData, preferredFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="epub">ePub (Most Readers)</SelectItem>
                        <SelectItem value="mobi">Mobi (Kindle)</SelectItem>
                        <SelectItem value="pdf">PDF (Universal)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This will be your default download format
                    </p>
                  </div>

                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : saved ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings Tab */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Email Preferences
                  </CardTitle>
                  <CardDescription>
                    Control what emails you receive from us
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newReleases" className="text-base">New Book Releases</Label>
                      <p className="text-sm text-muted-foreground">
                        Be the first to know when new books are available
                      </p>
                    </div>
                    <Switch
                      id="newReleases"
                      checked={formData.emailNewReleases}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, emailNewReleases: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter" className="text-base">Monthly Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Updates, behind-the-scenes content, and exclusive previews
                      </p>
                    </div>
                    <Switch
                      id="newsletter"
                      checked={formData.emailNewsletter}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, emailNewsletter: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="promotions" className="text-base">Special Offers & Promotions</Label>
                      <p className="text-sm text-muted-foreground">
                        Discounts, sales, and exclusive member deals
                      </p>
                    </div>
                    <Switch
                      id="promotions"
                      checked={formData.emailPromotions}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, emailPromotions: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="blogPosts" className="text-base">Blog Post Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new blog posts are published
                      </p>
                    </div>
                    <Switch
                      id="blogPosts"
                      checked={formData.emailBlogPosts}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, emailBlogPosts: checked })
                      }
                    />
                  </div>

                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : saved ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Email Preferences
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Purchase History Tab */}
            <TabsContent value="history">
              {/* Stats Cards */}
              {purchaseData?.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-2xl font-bold">{purchaseData.stats.totalBooks}</p>
                          <p className="text-xs text-muted-foreground">Books Owned</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Download className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-2xl font-bold">{purchaseData.stats.totalDownloads}</p>
                          <p className="text-xs text-muted-foreground">Downloads</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-2xl font-bold">
                            ${(purchaseData.stats.totalSpent / 100).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">Total Spent</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-2xl font-bold">
                            {purchaseData.stats.memberSince 
                              ? new Date(purchaseData.stats.memberSince).getFullYear()
                              : "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">Member Since</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Purchase List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Purchase History
                  </CardTitle>
                  <CardDescription>
                    All your book purchases and downloads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {purchasesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : purchaseData?.purchases && purchaseData.purchases.length > 0 ? (
                    <div className="space-y-4">
                      {purchaseData.purchases.map((purchase) => (
                        <div
                          key={purchase.id}
                          className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <img
                            src={purchase.bookCover}
                            alt={purchase.bookTitle}
                            className="w-16 h-24 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{purchase.bookTitle}</h4>
                            <p className="text-sm text-muted-foreground">
                              Purchased {purchase.purchasedAt 
                                ? new Date(purchase.purchasedAt).toLocaleDateString()
                                : "—"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {purchase.downloadCount || 0} downloads
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              ${((purchase.purchasePrice || 0) / 100).toFixed(2)}
                            </p>
                            <Link href="/my-purchases">
                              <Button variant="outline" size="sm" className="mt-2">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Purchases Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start building your library with our bestselling romance novels.
                      </p>
                      <Link href="/shop">
                        <Button>Browse Books</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
