import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Link2, Loader2, RefreshCw, ChevronLeft, ExternalLink,
  CheckCircle2, XCircle, AlertTriangle, Plus, Search, Scan
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminLinks() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState<'active' | 'broken' | 'redirected' | 'unknown' | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<'amazon' | 'social' | 'affiliate' | 'resource' | 'other' | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({ url: '', displayText: '', location: '', linkType: 'other' as const });

  const { data: links, isLoading, refetch } = trpc.admin.getExternalLinks.useQuery({ 
    limit: 100, 
    status: statusFilter,
    linkType: typeFilter 
  });

  const scanAllMutation = trpc.admin.scanAllLinks.useMutation({
    onSuccess: (data) => {
      toast.success(`Scanned ${data.checked} links. ${data.broken} broken links found.`);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to scan links");
    },
  });

  const checkLinkMutation = trpc.admin.checkLinkStatus.useMutation({
    onSuccess: (data) => {
      toast.success(`Link status: ${data.status} (${data.httpStatus})`);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to check link");
    },
  });

  const addLinkMutation = trpc.admin.addExternalLink.useMutation({
    onSuccess: () => {
      toast.success("Link added successfully");
      setShowAddForm(false);
      setNewLink({ url: '', displayText: '', location: '', linkType: 'other' });
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add link");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'broken': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'redirected': return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      default: return <Link2 className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'broken': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'redirected': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredLinks = links?.filter(link => 
    !searchQuery || 
    link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.displayText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: links?.length || 0,
    active: links?.filter(l => l.lastStatus === 'active').length || 0,
    broken: links?.filter(l => l.lastStatus === 'broken').length || 0,
    unknown: links?.filter(l => l.lastStatus === 'unknown').length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Header */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-purple-500/10 blur-[120px] rounded-full" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
                  External Links
                </h1>
                <p className="text-gray-400 text-lg">
                  Track and monitor all external links across your website
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowAddForm(true)}
                  variant="outline"
                  className="border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-6 rounded-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Link
                </Button>
                <Button
                  onClick={() => scanAllMutation.mutate()}
                  disabled={scanAllMutation.isPending}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold px-8 py-6 rounded-full"
                >
                  {scanAllMutation.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Scan className="mr-2 h-5 w-5" />
                  )}
                  Scan All Links
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-400">Total Links</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
                <p className="text-sm text-gray-400">Active</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
                <p className="text-2xl font-bold text-red-400">{stats.broken}</p>
                <p className="text-sm text-gray-400">Broken</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-gray-500/10 to-gray-600/5 border border-gray-500/20">
                <p className="text-2xl font-bold text-gray-400">{stats.unknown}</p>
                <p className="text-sm text-gray-400">Unchecked</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Add Link Form */}
      {showAddForm && (
        <section className="py-4">
          <div className="container">
            <div className="max-w-7xl mx-auto">
              <Card className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Add New Link</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="URL (https://...)"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <Input
                    placeholder="Display Text"
                    value={newLink.displayText}
                    onChange={(e) => setNewLink({ ...newLink, displayText: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <Input
                    placeholder="Location (e.g., Homepage, Books Page)"
                    value={newLink.location}
                    onChange={(e) => setNewLink({ ...newLink, location: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <select
                    value={newLink.linkType}
                    onChange={(e) => setNewLink({ ...newLink, linkType: e.target.value as any })}
                    className="bg-white/5 border border-white/10 text-white rounded-md px-3 py-2"
                  >
                    <option value="amazon">Amazon</option>
                    <option value="social">Social</option>
                    <option value="affiliate">Affiliate</option>
                    <option value="resource">Resource</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={() => addLinkMutation.mutate(newLink)}
                    disabled={!newLink.url || !newLink.location || addLinkMutation.isPending}
                    className="bg-[#d4af37] hover:bg-[#c9a961] text-black"
                  >
                    {addLinkMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Link"}
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="ghost"
                    className="text-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Links List */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
              <select
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value as any || undefined)}
                className="bg-white/5 border border-white/10 text-white rounded-md px-4 py-2"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="broken">Broken</option>
                <option value="redirected">Redirected</option>
                <option value="unknown">Unknown</option>
              </select>
              <select
                value={typeFilter || ''}
                onChange={(e) => setTypeFilter(e.target.value as any || undefined)}
                className="bg-white/5 border border-white/10 text-white rounded-md px-4 py-2"
              >
                <option value="">All Types</option>
                <option value="amazon">Amazon</option>
                <option value="social">Social</option>
                <option value="affiliate">Affiliate</option>
                <option value="resource">Resource</option>
                <option value="other">Other</option>
              </select>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="border-white/20 text-white"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Links Table */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
              </div>
            ) : filteredLinks && filteredLinks.length > 0 ? (
              <div className="space-y-3">
                {filteredLinks.map((link) => (
                  <Card key={link.id} className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-white/5">
                          {getStatusIcon(link.lastStatus)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-white font-medium hover:text-[#d4af37] truncate flex items-center gap-1"
                            >
                              {link.displayText || link.url}
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{link.url}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge className={getStatusColor(link.lastStatus)}>
                              {link.lastStatus}
                            </Badge>
                            <Badge className="bg-white/10 text-gray-300 capitalize">
                              {link.linkType}
                            </Badge>
                            <span className="text-xs text-gray-500">{link.location}</span>
                            {link.lastChecked && (
                              <span className="text-xs text-gray-500">
                                Last checked: {format(new Date(link.lastChecked), "MMM d, HH:mm")}
                              </span>
                            )}
                            {link.responseTime && (
                              <span className="text-xs text-gray-500">
                                {link.responseTime}ms
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => checkLinkMutation.mutate({ id: link.id })}
                        disabled={checkLinkMutation.isPending}
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        {checkLinkMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center">
                <Link2 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-white font-medium">No links found</p>
                <p className="text-gray-400 text-sm">Add external links to start tracking them.</p>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
