import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  Download, 
  Mail, 
  MessageSquare, 
  UserCheck, 
  HeadphonesIcon,
  Newspaper,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EmailSignatures() {
  const { toast } = useToast();
  const [copiedSignature, setCopiedSignature] = useState<string | null>(null);

  const signatures = {
    personal: {
      title: "Dr. Sidra's Personal Signature",
      description: "Professional signature for personal coaching responses and consultations",
      icon: UserCheck,
      color: "purple",
      html: `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #8B5CF6; font-family: Arial, sans-serif;">
          <table style="width: 100%; max-width: 600px;">
            <tr>
              <td style="vertical-align: top; padding-right: 20px;">
                <img src="https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=SB" alt="Dr. Sidra Bukhari" style="border-radius: 50%; width: 80px; height: 80px;" />
              </td>
              <td style="vertical-align: top;">
                <h3 style="margin: 0 0 5px 0; color: #8B5CF6; font-size: 18px; font-weight: bold;">
                  Dr. Sidra Bukhari, MD
                </h3>
                <p style="margin: 0 0 3px 0; color: #6B7280; font-size: 14px;">
                  Psychiatrist • NLP Life Coach • Mindfulness Trainer • Gynecologist
                </p>
                <p style="margin: 0 0 15px 0; color: #8B5CF6; font-size: 14px; font-style: italic;">
                  Specialized in Women's Mental Health & Midlife Wellness
                </p>
                
                <div style="margin-bottom: 15px;">
                  <a href="mailto:coaching@thrivemidlife.com" style="color: #8B5CF6; text-decoration: none; font-size: 14px;">
                    📧 coaching@thrivemidlife.com
                  </a><br>
                  <a href="https://thrivemidlife.com" style="color: #8B5CF6; text-decoration: none; font-size: 14px;">
                    🌐 www.thrivemidlife.com
                  </a>
                </div>
                
                <div style="margin-bottom: 10px;">
                  <span style="background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: bold;">
                    ThriveMidlife: Mind-Body Reset for Women
                  </span>
                </div>
                
                <p style="margin: 10px 0 0 0; font-size: 11px; color: #9CA3AF; line-height: 1.4;">
                  <strong>Confidentiality Notice:</strong> This email is intended only for the person or entity to which it is addressed. 
                  If you received this in error, please delete it and notify the sender.
                </p>
              </td>
            </tr>
          </table>
        </div>
      `
    },
    system: {
      title: "System Automated Signature",
      description: "Professional signature for automated platform emails and notifications",
      icon: Mail,
      color: "blue",
      html: `
        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #E5E7EB; font-family: Arial, sans-serif; text-align: center;">
          <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 5px 0; color: #8B5CF6; font-size: 16px;">ThriveMidlife</h4>
            <p style="margin: 0; color: #6B7280; font-size: 14px; font-style: italic;">Mind-Body Reset for Women</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0 0 5px 0; color: #374151; font-size: 14px;">
              <strong>Dr. Sidra Bukhari, MD</strong>
            </p>
            <p style="margin: 0; color: #6B7280; font-size: 12px;">
              Psychiatrist • NLP Life Coach • Mindfulness Trainer • Gynecologist
            </p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <a href="https://thrivemidlife.com" style="color: #8B5CF6; text-decoration: none; font-size: 14px;">
              www.thrivemidlife.com
            </a>
            <span style="color: #D1D5DB; margin: 0 8px;">|</span>
            <a href="mailto:hello@thrivemidlife.com" style="color: #8B5CF6; text-decoration: none; font-size: 14px;">
              hello@thrivemidlife.com
            </a>
          </div>
          
          <p style="margin: 15px 0 0 0; font-size: 10px; color: #9CA3AF; line-height: 1.3;">
            This email was sent from ThriveMidlife platform. If you no longer wish to receive these communications, 
            please contact us at <a href="mailto:hello@thrivemidlife.com" style="color: #8B5CF6;">hello@thrivemidlife.com</a>
          </p>
        </div>
      `
    },
    support: {
      title: "Support Team Signature",
      description: "Signature for technical support and customer service communications",
      icon: HeadphonesIcon,
      color: "green",
      html: `
        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #E5E7EB; font-family: Arial, sans-serif;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="margin-right: 15px;">
              <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #8B5CF6, #EC4899); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-weight: bold; font-size: 18px;">T</span>
              </div>
            </div>
            <div>
              <h4 style="margin: 0 0 3px 0; color: #374151; font-size: 16px;">ThriveMidlife Support Team</h4>
              <p style="margin: 0; color: #6B7280; font-size: 14px;">Technical Support & Customer Care</p>
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0 0 5px 0; color: #374151; font-size: 14px;">
              📧 <a href="mailto:support@thrivemidlife.com" style="color: #8B5CF6; text-decoration: none;">support@thrivemidlife.com</a>
            </p>
            <p style="margin: 0 0 5px 0; color: #374151; font-size: 14px;">
              🌐 <a href="https://thrivemidlife.com" style="color: #8B5CF6; text-decoration: none;">www.thrivemidlife.com</a>
            </p>
            <p style="margin: 0; color: #374151; font-size: 14px;">
              ⏰ Response Time: Within 24 hours
            </p>
          </div>
          
          <div style="background: #F3F4F6; padding: 12px; border-radius: 8px; border-left: 4px solid #8B5CF6;">
            <p style="margin: 0; font-size: 12px; color: #6B7280; line-height: 1.4;">
              <strong>Need Personal Coaching?</strong> For coaching inquiries, please contact 
              <a href="mailto:coaching@thrivemidlife.com" style="color: #8B5CF6;">coaching@thrivemidlife.com</a> 
              or visit our <a href="/contact-coaching" style="color: #8B5CF6;">Personal Coaching page</a>.
            </p>
          </div>
          
          <p style="margin: 15px 0 0 0; font-size: 10px; color: #9CA3AF;">
            <em>Empowering women through midlife transitions with evidence-based wellness solutions.</em>
          </p>
        </div>
      `
    },
    newsletter: {
      title: "Newsletter Marketing Signature",
      description: "Engaging signature for marketing emails and newsletter communications",
      icon: Newspaper,
      color: "pink",
      html: `
        <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #F8FAFC, #F1F5F9); border-radius: 12px; font-family: Arial, sans-serif; text-align: center;">
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 5px 0; color: #8B5CF6; font-size: 20px; font-weight: bold;">ThriveMidlife</h3>
            <p style="margin: 0; color: #6B7280; font-size: 14px; font-style: italic;">Mind-Body Reset for Women</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: 600;">
              Transform Your Midlife Journey
            </p>
            <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.5;">
              Join thousands of women navigating midlife transitions with confidence, clarity, and community support.
            </p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <a href="/contact-coaching" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 14px;">
              Start Your Journey Today
            </a>
          </div>
          
          <div style="border-top: 1px solid #E5E7EB; padding-top: 15px;">
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #6B7280;">
              <a href="https://thrivemidlife.com" style="color: #8B5CF6; text-decoration: none;">www.thrivemidlife.com</a>
              <span style="margin: 0 8px; color: #D1D5DB;">|</span>
              <a href="mailto:hello@thrivemidlife.com" style="color: #8B5CF6; text-decoration: none;">hello@thrivemidlife.com</a>
            </p>
            <p style="margin: 0; font-size: 10px; color: #9CA3AF;">
              You're receiving this because you signed up for ThriveMidlife updates. 
              <a href="#" style="color: #8B5CF6;">Unsubscribe</a> | <a href="#" style="color: #8B5CF6;">Update Preferences</a>
            </p>
          </div>
        </div>
      `
    }
  };

  const copyToClipboard = async (html: string, title: string) => {
    try {
      await navigator.clipboard.writeText(html);
      setCopiedSignature(title);
      toast({
        title: "Signature Copied!",
        description: `${title} has been copied to your clipboard. Paste it into your email client.`,
      });
      
      setTimeout(() => setCopiedSignature(null), 3000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please manually select and copy the signature text.",
        variant: "destructive"
      });
    }
  };

  const downloadSignature = (html: string, filename: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.toLowerCase().replace(/\s+/g, '-')}-signature.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Signature Downloaded",
      description: `${filename} signature saved as HTML file.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Mail className="w-4 h-4" />
            Email Signature Collection
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Email Signatures
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional email signatures for ThriveMidlife communications. 
            Copy and paste these into your email client for consistent branding.
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <MessageSquare className="w-5 h-5" />
              How to Use These Signatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <Copy className="w-4 h-4 mt-1 text-blue-600" />
                <div>
                  <strong>Copy:</strong> Click "Copy HTML" to copy the signature code to your clipboard
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 text-blue-600" />
                <div>
                  <strong>Paste:</strong> Go to your email client settings and paste into the signature field
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-1 text-blue-600" />
                <div>
                  <strong>Test:</strong> Send yourself a test email to verify the signature appears correctly
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signatures Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(signatures).map(([key, signature]) => {
            const Icon = signature.icon;
            const isCopied = copiedSignature === signature.title;
            
            return (
              <Card key={key} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${signature.color}-100`}>
                        <Icon className={`w-6 h-6 text-${signature.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{signature.title}</CardTitle>
                        <CardDescription>{signature.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-${signature.color}-700 border-${signature.color}-200`}>
                      {key}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Preview */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Preview:</h4>
                    <div 
                      className="border border-gray-200 rounded-lg p-4 bg-white max-h-60 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: signature.html }}
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => copyToClipboard(signature.html, signature.title)}
                      className="flex-1"
                      variant={isCopied ? "default" : "outline"}
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy HTML
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => downloadSignature(signature.html, signature.title)}
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Email Client Instructions */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Email Client Setup Instructions</CardTitle>
            <CardDescription>
              Step-by-step instructions for adding signatures to popular email clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="gmail" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="gmail">Gmail</TabsTrigger>
                <TabsTrigger value="outlook">Outlook</TabsTrigger>
                <TabsTrigger value="apple">Apple Mail</TabsTrigger>
                <TabsTrigger value="thunderbird">Thunderbird</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gmail" className="mt-6">
                <div className="space-y-3 text-sm">
                  <p><strong>1.</strong> Open Gmail and click the gear icon in the top right</p>
                  <p><strong>2.</strong> Click "See all settings"</p>
                  <p><strong>3.</strong> Scroll down to the "Signature" section</p>
                  <p><strong>4.</strong> Click "Create new" and give your signature a name</p>
                  <p><strong>5.</strong> Paste the HTML code into the signature editor</p>
                  <p><strong>6.</strong> Click "Save Changes" at the bottom</p>
                </div>
              </TabsContent>
              
              <TabsContent value="outlook" className="mt-6">
                <div className="space-y-3 text-sm">
                  <p><strong>1.</strong> In Outlook, go to File → Options → Mail</p>
                  <p><strong>2.</strong> Click "Signatures..." button</p>
                  <p><strong>3.</strong> Click "New" to create a new signature</p>
                  <p><strong>4.</strong> Enter a name for your signature</p>
                  <p><strong>5.</strong> Paste the HTML code in the signature editor</p>
                  <p><strong>6.</strong> Click "OK" to save</p>
                </div>
              </TabsContent>
              
              <TabsContent value="apple" className="mt-6">
                <div className="space-y-3 text-sm">
                  <p><strong>1.</strong> Open Apple Mail and go to Mail → Preferences</p>
                  <p><strong>2.</strong> Click the "Signatures" tab</p>
                  <p><strong>3.</strong> Select your email account</p>
                  <p><strong>4.</strong> Click the "+" button to add a new signature</p>
                  <p><strong>5.</strong> Paste the HTML code in the signature field</p>
                  <p><strong>6.</strong> Close the preferences window to save</p>
                </div>
              </TabsContent>
              
              <TabsContent value="thunderbird" className="mt-6">
                <div className="space-y-3 text-sm">
                  <p><strong>1.</strong> In Thunderbird, go to Tools → Account Settings</p>
                  <p><strong>2.</strong> Select your email account</p>
                  <p><strong>3.</strong> Check "Attach this signature" and select "Use HTML"</p>
                  <p><strong>4.</strong> Paste the HTML code in the signature text box</p>
                  <p><strong>5.</strong> Click "OK" to save the settings</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}