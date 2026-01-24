import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, Loader2, ChevronLeft, Bell, Plus, CheckCircle2,
  Clock, AlertTriangle, Calendar, RefreshCw, X, Trash2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminReports() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'reports' | 'reminders'>('reports');
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [reminderFilter, setReminderFilter] = useState<'pending' | 'completed' | 'dismissed' | undefined>('pending');

  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    reminderType: 'custom' as const,
    priority: 'medium' as const,
    dueDate: '',
  });

  const { data: reports, isLoading: reportsLoading, refetch: refetchReports } = trpc.admin.getDailyReports.useQuery({ limit: 30 });
  const { data: reminders, isLoading: remindersLoading, refetch: refetchReminders } = trpc.admin.getReminders.useQuery({ 
    limit: 50,
    status: reminderFilter 
  });

  const generateReportMutation = trpc.admin.generateDailyReport.useMutation({
    onSuccess: () => {
      toast.success("Daily report generated");
      refetchReports();
    },
    onError: (error) => toast.error(error.message),
  });

  const createReminderMutation = trpc.admin.createReminder.useMutation({
    onSuccess: () => {
      toast.success("Reminder created");
      setShowAddReminder(false);
      setNewReminder({ title: '', description: '', reminderType: 'custom', priority: 'medium', dueDate: '' });
      refetchReminders();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateReminderMutation = trpc.admin.updateReminder.useMutation({
    onSuccess: () => {
      toast.success("Reminder updated");
      refetchReminders();
    },
    onError: (error) => toast.error(error.message),
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getReminderTypeIcon = (type: string) => {
    switch (type) {
      case 'broken_link': return '🔗';
      case 'pricing_check': return '💰';
      case 'content_review': return '📝';
      case 'qa_issue': return '🔍';
      default: return '📌';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a]">
      {/* Header */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/98 via-[#0a0e1a]/95 to-[#0a0e1a]/98" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-indigo-500/10 blur-[120px] rounded-full" />

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
                  Reports & Reminders
                </h1>
                <p className="text-gray-400 text-lg">
                  Daily website health reports and task reminders
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-4">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2">
              <Button
                onClick={() => setActiveTab('reports')}
                variant={activeTab === 'reports' ? 'default' : 'outline'}
                className={activeTab === 'reports' 
                  ? 'bg-[#d4af37] text-black' 
                  : 'border-white/20 text-white hover:bg-white/10'
                }
              >
                <FileText className="h-4 w-4 mr-2" />
                Daily Reports
              </Button>
              <Button
                onClick={() => setActiveTab('reminders')}
                variant={activeTab === 'reminders' ? 'default' : 'outline'}
                className={activeTab === 'reminders' 
                  ? 'bg-[#d4af37] text-black' 
                  : 'border-white/20 text-white hover:bg-white/10'
                }
              >
                <Bell className="h-4 w-4 mr-2" />
                Reminders
                {reminders && reminders.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {reminders.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Daily Reports</h2>
                  <Button
                    onClick={() => generateReportMutation.mutate()}
                    disabled={generateReportMutation.isPending}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
                  >
                    {generateReportMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Generate Report
                  </Button>
                </div>

                {reportsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
                  </div>
                ) : reports && reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <Card key={report.id} className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/20">
                              <FileText className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold capitalize">
                                {report.reportType.replace('_', ' ')}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {format(new Date(report.reportDate), "MMMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-2xl font-bold text-emerald-400">{report.newSubscribers}</p>
                            <p className="text-xs text-gray-500">New Subscribers</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-2xl font-bold text-blue-400">{report.blogPostViews}</p>
                            <p className="text-xs text-gray-500">Blog Views</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-2xl font-bold text-amber-400">{report.openIssues}</p>
                            <p className="text-xs text-gray-500">Open Issues</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-2xl font-bold text-red-400">{report.brokenLinksFound}</p>
                            <p className="text-xs text-gray-500">Broken Links</p>
                          </div>
                        </div>

                        {report.summary && (
                          <p className="text-sm text-gray-400">{report.summary}</p>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center">
                    <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-white font-medium">No reports yet</p>
                    <p className="text-gray-400 text-sm">Click "Generate Report" to create your first daily report.</p>
                  </Card>
                )}
              </div>
            )}

            {/* Reminders Tab */}
            {activeTab === 'reminders' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex gap-2">
                    {['pending', 'completed', 'dismissed'].map((status) => (
                      <Button
                        key={status}
                        onClick={() => setReminderFilter(status as any)}
                        variant={reminderFilter === status ? 'default' : 'outline'}
                        size="sm"
                        className={reminderFilter === status 
                          ? 'bg-white/20 text-white' 
                          : 'border-white/20 text-gray-400 hover:text-white'
                        }
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={() => setShowAddReminder(true)}
                    className="bg-[#d4af37] text-black"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </div>

                {/* Add Reminder Form */}
                {showAddReminder && (
                  <Card className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">New Reminder</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Title"
                        value={newReminder.title}
                        onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                      <select
                        value={newReminder.reminderType}
                        onChange={(e) => setNewReminder({ ...newReminder, reminderType: e.target.value as any })}
                        className="bg-white/5 border border-white/10 text-white rounded-md px-3 py-2"
                      >
                        <option value="custom">Custom</option>
                        <option value="broken_link">Broken Link</option>
                        <option value="pricing_check">Pricing Check</option>
                        <option value="content_review">Content Review</option>
                        <option value="qa_issue">QA Issue</option>
                      </select>
                      <select
                        value={newReminder.priority}
                        onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value as any })}
                        className="bg-white/5 border border-white/10 text-white rounded-md px-3 py-2"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <Input
                        type="date"
                        value={newReminder.dueDate}
                        onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                      <Textarea
                        placeholder="Description"
                        value={newReminder.description}
                        onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                        className="bg-white/5 border-white/10 text-white md:col-span-2"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => createReminderMutation.mutate(newReminder)}
                        disabled={!newReminder.title || createReminderMutation.isPending}
                        className="bg-[#d4af37] text-black"
                      >
                        Create Reminder
                      </Button>
                      <Button
                        onClick={() => setShowAddReminder(false)}
                        variant="ghost"
                        className="text-gray-400"
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card>
                )}

                {remindersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
                  </div>
                ) : reminders && reminders.length > 0 ? (
                  <div className="space-y-3">
                    {reminders.map((reminder) => (
                      <Card key={reminder.id} className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="text-2xl">{getReminderTypeIcon(reminder.reminderType)}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium">{reminder.title}</h4>
                                <Badge className={getPriorityColor(reminder.priority)}>
                                  {reminder.priority}
                                </Badge>
                                <Badge className="bg-white/10 text-gray-300 capitalize">
                                  {reminder.reminderType.replace('_', ' ')}
                                </Badge>
                              </div>
                              {reminder.description && (
                                <p className="text-sm text-gray-400">{reminder.description}</p>
                              )}
                              {reminder.dueDate && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  Due: {format(new Date(reminder.dueDate), "MMM d, yyyy")}
                                </div>
                              )}
                            </div>
                          </div>
                          {reminder.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => updateReminderMutation.mutate({ id: reminder.id, status: 'completed' })}
                                size="sm"
                                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                              <Button
                                onClick={() => updateReminderMutation.mutate({ id: reminder.id, status: 'dismissed' })}
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-white"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          {reminder.status === 'completed' && (
                            <Badge className="bg-emerald-500/20 text-emerald-400">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center">
                    <Bell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-white font-medium">No {reminderFilter} reminders</p>
                    <p className="text-gray-400 text-sm">
                      {reminderFilter === 'pending' 
                        ? 'Create a reminder to track important tasks.' 
                        : `No ${reminderFilter} reminders found.`}
                    </p>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
