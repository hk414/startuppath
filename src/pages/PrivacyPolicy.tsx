import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/startuppath-logo.jpg";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="StartUpPath Logo" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold">StartUpPath</span>
          </div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
              <p className="text-foreground leading-relaxed">
                Welcome to StartUpPath ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform designed to connect student entrepreneurs with mentors, guidebooks, and progress tracking tools.
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                By using StartUpPath, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Personal Information</h3>
              <p className="text-foreground leading-relaxed">
                We collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Register for an account (name, email address, password)</li>
                <li>Complete your profile (startup details, industry, stage, goals)</li>
                <li>Participate in mentorship matching</li>
                <li>Communicate through our platform</li>
                <li>Track your startup journey and progress</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-foreground leading-relaxed">
                When you access our platform, we automatically collect certain information:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-foreground leading-relaxed">
                We use your personal information for the following purposes:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li><strong>Account Management:</strong> To create and manage your user account</li>
                <li><strong>Mentor Matching:</strong> To connect you with relevant mentors based on your profile and needs</li>
                <li><strong>Communication:</strong> To send you updates, notifications, and respond to your inquiries</li>
                <li><strong>Platform Improvement:</strong> To analyze usage patterns and improve our services</li>
                <li><strong>Security:</strong> To monitor and prevent fraudulent activities</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 With Other Users</h3>
              <p className="text-foreground leading-relaxed">
                Your profile information may be visible to mentors and other users to facilitate meaningful connections. You can control what information is shared in your privacy settings.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Service Providers</h3>
              <p className="text-foreground leading-relaxed">
                We may share your information with third-party service providers who perform services on our behalf:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Cloud hosting services (Supabase)</li>
                <li>Analytics providers</li>
                <li>Email communication services</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Legal Requirements</h3>
              <p className="text-foreground leading-relaxed">
                We may disclose your information if required by law or in response to valid legal requests.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security</h2>
              <p className="text-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure cloud infrastructure</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Privacy Rights (GDPR)</h2>
              <p className="text-foreground leading-relaxed">
                Under the General Data Protection Regulation (GDPR), you have the following rights:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@startuppath.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Cookies and Tracking</h2>
              <p className="text-foreground leading-relaxed">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our platform</li>
                <li>Improve user experience</li>
                <li>Provide personalized content</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Data Retention</h2>
              <p className="text-foreground leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When you delete your account, we will delete or anonymize your personal data within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Children's Privacy</h2>
              <p className="text-foreground leading-relaxed">
                StartUpPath is intended for users who are at least 18 years old. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">10. International Data Transfers</h2>
              <p className="text-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">11. Changes to This Policy</h2>
              <p className="text-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the platform after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">12. Contact Us</h2>
              <p className="text-foreground leading-relaxed">
                If you have questions or concerns about this Privacy Policy, please contact us:
              </p>
              <div className="mt-4 p-6 bg-muted/50 rounded-lg border border-border">
                <p className="text-foreground"><strong>Email:</strong> privacy@startuppath.com</p>
                <p className="text-foreground mt-2"><strong>Data Protection Officer:</strong> dpo@startuppath.com</p>
                <p className="text-foreground mt-2"><strong>Address:</strong> StartUpPath, Manchester, United Kingdom</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
