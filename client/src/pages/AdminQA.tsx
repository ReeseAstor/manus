import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, XCircle, AlertTriangle, Loader2, RefreshCw,
  Play, Filter, ChevronLeft, Clock, AlertCircle
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminQA() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState<'open' | 'resolved' | 'ignored' | undefined>(undefined);
  const [severityFilter, setSeverityFilter] = useState<'critical' | 'warning' | 'info' | undefined>(undefined);

  const { data: checks, isLoading: checksLoading, refetch: refetchChecks } = trpc.admin.getQaChecks.useQuery({ limit: 10 });
  const { data: issues, isLoading: issuesLoading, refetch: refetchIssues } = trpc.admin.getQaIssues.useQuery({ 
    limit: 50, 
    status: statusFilter,
    severity: severityFilter 
  });

  const runQaMutation = trpc.admin.runQaCheck.useMutation({
    onSuccess: (data) => {
      toast.success(`QA check complete: ${data.itemsChecked} items checked, ${data.issuesFound} issues found`);
      refetchChecks();
      refetchIssues();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to run QA check");
    },
  });

  const updateIssueMutation = trpc.admin.updateQaIssue.useMutation({
    onSuccess: () => {
      toast.success("Issue updated");
      refetchIssues();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update issue");
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-emerald-500/20 text-emerald-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      case 'warning': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Header */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full" />

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

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
                  QA Overview
                </h1>
                <p className="text-gray-400 text-lg">
                  Content consistency and accuracy checks across all pages
                </p>
              </div>
              <Button
                onClick={() => runQaMutation.mutate({ checkType: 'full_audit' })}
                disabled={runQaMutation.isPending}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-8 py-6 rounded-full"
              >
                {runQaMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Play className="mr-2 h-5 w-5" />
                )}
                Run Full QA Check
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Checks */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-white mb-6">Recent QA Checks</h2>
            
            {checksLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
              </div>
            ) : checks && checks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {checks.slice(0, 4).map((check) => (
                  <Card key={check.id} className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getStatusColor(check.status)}>
                        {check.status === 'passed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {check.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                        {check.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {check.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {format(new Date(check.checkDate), "MMM d, HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm text-white font-medium capitalize mb-1">
                      {check.checkType.replace('_', ' ')}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>{check.itemsChecked} checked</span>
                      <span className={check.issuesFound > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                        {check.issuesFound} issues
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center mb-8">
                <p className="text-gray-400">No QA checks have been run yet. Click "Run Full QA Check" to start.</p>
              </Card>
            )}

            {/* Issues Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h2 className="font-serif text-2xl font-bold text-white">Issues</h2>
              <div className="flex gap-3">
                <select
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value as any || undefined)}
                  className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="resolved">Resolved</option>
                  <option value="ignored">Ignored</option>
                </select>
                <select
                  value={severityFilter || ''}
                  onChange={(e) => setSeverityFilter(e.target.value as any || undefined)}
                  className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2 text-sm"
                >
                  <option value="">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
                <Button
                  onClick={() => refetchIssues()}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {issuesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
              </div>
            ) : issues && issues.length > 0 ? (
              <div className="space-y-3">
                {issues.map((issue) => (
                  <Card key={issue.id} className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded-lg ${
                          issue.severity === 'critical' ? 'bg-red-500/20' :
                          issue.severity === 'warning' ? 'bg-amber-500/20' : 'bg-blue-500/20'
                        }`}>
                          <AlertCircle className={`h-5 w-5 ${
                            issue.severity === 'critical' ? 'text-red-400' :
                            issue.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${getSeverityColor(issue.severity)} text-xs`}>
                              {issue.severity}
                            </Badge>
                            <Badge className="bg-white/10 text-gray-300 text-xs capitalize">
                              {issue.issueType.replace('_', ' ')}
                            </Badge>
                            <Badge className={`text-xs ${
                              issue.status === 'open' ? 'bg-amber-500/20 text-amber-400' :
                              issue.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {issue.status}
                            </Badge>
                          </div>
                          <p className="text-white font-medium">{issue.description}</p>
                          <p className="text-sm text-gray-500 mt-1">{issue.location}</p>
                          {(issue.expectedValue || issue.actualValue) && (
                            <div className="mt-2 text-xs text-gray-400">
                              {issue.expectedValue && <span>Expected: {issue.expectedValue}</span>}
                              {issue.expectedValue && issue.actualValue && <span className="mx-2">|</span>}
                              {issue.actualValue && <span>Actual: {issue.actualValue}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                      {issue.status === 'open' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => updateIssueMutation.mutate({ id: issue.id, status: 'resolved' })}
                            size="sm"
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                          <Button
                            onClick={() => updateIssueMutation.mutate({ id: issue.id, status: 'ignored' })}
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                          >
                            Ignore
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <p className="text-white font-medium">No issues found!</p>
                <p className="text-gray-400 text-sm">All content is consistent and accurate.</p>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
