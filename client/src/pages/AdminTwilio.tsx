import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MessageSquare, Settings, TestTube, CheckCircle, XCircle, Loader2, ArrowLeft, Shield, Bell } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminTwilio() {
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("Hello from Reese Astor's website! This is a test message.");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Get current Twilio status
  const { data: twilioStatus, isLoading: statusLoading, refetch: refetchStatus } = trpc.twilio.getStatus.useQuery();

  // Test SMS mutation
  const testSmsMutation = trpc.twilio.testSms.useMutation({
    onSuccess: (data) => {
      setTestResult({ success: true, message: data.message });
      toast.success("Test SMS sent successfully!");
      setIsTesting(false);
    },
    onError: (error) => {
      setTestResult({ success: false, message: error.message });
      toast.error("Failed to send test SMS: " + error.message);
      setIsTesting(false);
    },
  });

  // Test voice call mutation
  const testVoiceMutation = trpc.twilio.testVoice.useMutation({
    onSuccess: (data) => {
      setTestResult({ success: true, message: data.message });
      toast.success("Test call initiated successfully!");
      setIsTesting(false);
    },
    onError: (error) => {
      setTestResult({ success: false, message: error.message });
      toast.error("Failed to initiate test call: " + error.message);
      setIsTesting(false);
    },
  });

  const handleTestSms = () => {
    if (!testPhone) {
      toast.error("Please enter a phone number");
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    testSmsMutation.mutate({ to: testPhone, message: testMessage });
  };

  const handleTestVoice = () => {
    if (!testPhone) {
      toast.error("Please enter a phone number");
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    testVoiceMutation.mutate({ to: testPhone });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0e27]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/webhooks">
                <Button variant="ghost" size="sm" className="text-[#d4af37] hover:bg-[#d4af37]/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
                <Phone className="w-6 h-6 text-[#d4af37]" />
                Twilio Configuration
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {statusLoading ? (
                <span className="text-gray-400 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking status...
                </span>
              ) : twilioStatus?.configured ? (
                <span className="text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Twilio Connected
                </span>
              ) : (
                <span className="text-yellow-400 text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Not Configured
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sms" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
              <MessageSquare className="w-4 h-4 mr-2" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="voice" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
              <Phone className="w-4 h-4 mr-2" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="testing" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
              <TestTube className="w-4 h-4 mr-2" />
              Testing
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#d4af37]" />
                  Twilio Account Status
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure your Twilio account for SMS and voice capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {statusLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
                  </div>
                ) : twilioStatus?.configured ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-semibold">Account Connected</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Account SID: {twilioStatus.accountSid?.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="w-5 h-5 text-blue-400" />
                          <span className="text-blue-400 font-semibold">Phone Number</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {twilioStatus.phoneNumber || "Not configured"}
                        </p>
                      </div>
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Bell className="w-5 h-5 text-purple-400" />
                          <span className="text-purple-400 font-semibold">Capabilities</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          SMS: {twilioStatus.smsEnabled ? "✓" : "✗"} | Voice: {twilioStatus.voiceEnabled ? "✓" : "✗"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                    <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Twilio Not Configured
                    </h3>
                    <p className="text-gray-400 mb-4">
                      To enable SMS and voice features, you need to configure your Twilio credentials in the Settings → Secrets panel.
                    </p>
                    <div className="bg-black/30 rounded-lg p-4 space-y-2">
                      <p className="text-gray-300 text-sm font-mono">Required environment variables:</p>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• <code className="text-[#d4af37]">TWILIO_ACCOUNT_SID</code> - Your Twilio Account SID</li>
                        <li>• <code className="text-[#d4af37]">TWILIO_AUTH_TOKEN</code> - Your Twilio Auth Token</li>
                        <li>• <code className="text-[#d4af37]">TWILIO_PHONE_NUMBER</code> - Your Twilio phone number (E.164 format)</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Setup Guide */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Setup Guide</CardTitle>
                <CardDescription className="text-gray-400">
                  Follow these steps to configure Twilio for your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 text-gray-300">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center">1</span>
                    <div>
                      <p className="font-semibold">Create a Twilio Account</p>
                      <p className="text-gray-400 text-sm">
                        Sign up at <a href="https://www.twilio.com/try-twilio" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:underline">twilio.com/try-twilio</a> and verify your account.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center">2</span>
                    <div>
                      <p className="font-semibold">Get Your Credentials</p>
                      <p className="text-gray-400 text-sm">
                        Find your Account SID and Auth Token in the Twilio Console dashboard.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center">3</span>
                    <div>
                      <p className="font-semibold">Purchase a Phone Number</p>
                      <p className="text-gray-400 text-sm">
                        Buy a phone number with SMS and/or voice capabilities from the Twilio Console.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center">4</span>
                    <div>
                      <p className="font-semibold">Add Credentials to Settings</p>
                      <p className="text-gray-400 text-sm">
                        Go to Settings → Secrets in the Management UI and add your Twilio credentials.
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMS Tab */}
          <TabsContent value="sms" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#d4af37]" />
                  SMS Configuration
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure SMS messaging for notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Use Cases</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        New book release notifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        VIP member alerts
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Order confirmations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Two-factor authentication
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Webhook URLs</h3>
                    <div className="bg-black/30 rounded-lg p-4 space-y-2">
                      <p className="text-gray-400 text-sm">Incoming SMS Webhook:</p>
                      <code className="text-[#d4af37] text-sm break-all">
                        https://reeseastor.com/api/twilio/sms/incoming
                      </code>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 space-y-2">
                      <p className="text-gray-400 text-sm">SMS Status Callback:</p>
                      <code className="text-[#d4af37] text-sm break-all">
                        https://reeseastor.com/api/twilio/sms/status
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voice Tab */}
          <TabsContent value="voice" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#d4af37]" />
                  Voice Configuration
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure voice calling for automated calls and IVR
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Use Cases</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Automated voice notifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Audio story previews via phone
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        VIP member hotline
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Voice verification
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Webhook URLs</h3>
                    <div className="bg-black/30 rounded-lg p-4 space-y-2">
                      <p className="text-gray-400 text-sm">Incoming Call Webhook:</p>
                      <code className="text-[#d4af37] text-sm break-all">
                        https://reeseastor.com/api/twilio/voice/incoming
                      </code>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 space-y-2">
                      <p className="text-gray-400 text-sm">Call Status Callback:</p>
                      <code className="text-[#d4af37] text-sm break-all">
                        https://reeseastor.com/api/twilio/voice/status
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-[#d4af37]" />
                  Test SMS & Voice
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Send test messages to verify your Twilio configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!twilioStatus?.configured ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
                    <XCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-yellow-400 font-semibold mb-2">Twilio Not Configured</h3>
                    <p className="text-gray-400">
                      Please configure your Twilio credentials before testing.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="testPhone" className="text-white">Phone Number (E.164 format)</Label>
                        <Input
                          id="testPhone"
                          type="tel"
                          placeholder="+1234567890"
                          value={testPhone}
                          onChange={(e) => setTestPhone(e.target.value)}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                        />
                        <p className="text-gray-500 text-sm">Enter the phone number to receive the test message/call</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="testMessage" className="text-white">Test Message</Label>
                        <Input
                          id="testMessage"
                          type="text"
                          placeholder="Enter your test message"
                          value={testMessage}
                          onChange={(e) => setTestMessage(e.target.value)}
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleTestSms}
                        disabled={isTesting || !testPhone}
                        className="bg-[#d4af37] hover:bg-[#c9a961] text-black font-semibold"
                      >
                        {isTesting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Test SMS
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleTestVoice}
                        disabled={isTesting || !testPhone}
                        variant="outline"
                        className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10"
                      >
                        {isTesting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Calling...
                          </>
                        ) : (
                          <>
                            <Phone className="w-4 h-4 mr-2" />
                            Make Test Call
                          </>
                        )}
                      </Button>
                    </div>

                    {testResult && (
                      <div className={`rounded-lg p-4 ${testResult.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                        <div className="flex items-center gap-2">
                          {testResult.success ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <span className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                            {testResult.message}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
