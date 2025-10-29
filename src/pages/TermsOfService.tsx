import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/startuppath-logo.jpg";

const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Agreement to Terms</h2>
              <p className="text-foreground leading-relaxed">
                These Terms of Service ("Terms") govern your access to and use of StartUpPath ("Platform," "Service," "we," "us," or "our"), a mentorship platform designed to connect student entrepreneurs with experienced mentors, guidebooks, and progress tracking tools.
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Eligibility</h2>
              <p className="text-foreground leading-relaxed">
                You must be at least 18 years old to use this Platform. By using the Platform, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>You are at least 18 years of age</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You will comply with all applicable laws and regulations</li>
                <li>All information you provide is accurate and up-to-date</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Account Creation</h3>
              <p className="text-foreground leading-relaxed">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Account Responsibilities</h3>
              <p className="text-foreground leading-relaxed">
                You are responsible for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Platform Usage</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Permitted Use</h3>
              <p className="text-foreground leading-relaxed">
                You may use the Platform to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Create and manage your entrepreneurial profile</li>
                <li>Connect with mentors and other entrepreneurs</li>
                <li>Access guidebooks and educational resources</li>
                <li>Track your startup journey and progress</li>
                <li>Participate in challenges and games</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Prohibited Activities</h3>
              <p className="text-foreground leading-relaxed">
                You agree NOT to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful code, viruses, or malware</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Collect user data without permission</li>
                <li>Use automated systems (bots) to access the Platform</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the Platform's operation</li>
                <li>Use the Platform for commercial purposes without authorization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Mentorship Relationships</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Mentor-Mentee Matching</h3>
              <p className="text-foreground leading-relaxed">
                Our Platform facilitates connections between mentors and mentees. We use AI-powered matching based on industry, startup stage, and goals. However:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>We do not guarantee specific outcomes from mentorship relationships</li>
                <li>We are not responsible for the quality or results of mentorship sessions</li>
                <li>Both parties are responsible for their own professional conduct</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Professional Conduct</h3>
              <p className="text-foreground leading-relaxed">
                All users must maintain professional standards. Inappropriate behavior, harassment, or discrimination will result in immediate account termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Platform Content</h3>
              <p className="text-foreground leading-relaxed">
                All content on the Platform, including text, graphics, logos, icons, images, software, and guidebooks, is owned by StartUpPath or its licensors and is protected by intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.2 User Content</h3>
              <p className="text-foreground leading-relaxed">
                You retain ownership of content you create and share on the Platform. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on the Platform.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Feedback</h3>
              <p className="text-foreground leading-relaxed">
                Any feedback, suggestions, or ideas you provide may be used by us without compensation or attribution.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Privacy and Data Protection</h2>
              <p className="text-foreground leading-relaxed">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using the Platform, you consent to our Privacy Policy.
              </p>
              <p className="text-foreground leading-relaxed mt-4">
                We comply with GDPR and other applicable data protection laws. You have rights regarding your personal data as outlined in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Disclaimers and Limitations</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">8.1 No Professional Advice</h3>
              <p className="text-foreground leading-relaxed">
                The Platform provides educational resources and facilitates mentorship connections. It does not provide professional business, legal, financial, or investment advice. Always consult qualified professionals for specific advice.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Platform Availability</h3>
              <p className="text-foreground leading-relaxed">
                We strive to maintain Platform availability but do not guarantee uninterrupted access. The Platform is provided "as is" and "as available" without warranties of any kind.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.3 Limitation of Liability</h3>
              <p className="text-foreground leading-relaxed">
                To the maximum extent permitted by law, StartUpPath shall not be liable for:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, revenue, or business opportunities</li>
                <li>Data loss or corruption</li>
                <li>Actions or omissions of other users</li>
                <li>Third-party content or services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Indemnification</h2>
              <p className="text-foreground leading-relaxed">
                You agree to indemnify and hold harmless StartUpPath, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your content posted on the Platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">10. Termination</h2>
              <p className="text-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activities</li>
                <li>Requests from law enforcement</li>
                <li>Extended periods of inactivity</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                You may terminate your account at any time through your account settings. Upon termination, your right to access the Platform will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">11. Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">11.1 Informal Resolution</h3>
              <p className="text-foreground leading-relaxed">
                If you have a dispute, please contact us first at support@startuppath.com to attempt informal resolution.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">11.2 Governing Law</h3>
              <p className="text-foreground leading-relaxed">
                These Terms are governed by the laws of the United Kingdom. Any disputes shall be resolved in the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">12. Changes to Terms</h2>
              <p className="text-foreground leading-relaxed">
                We may modify these Terms at any time. We will notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-foreground">
                <li>Posting the updated Terms on the Platform</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending you an email notification (for significant changes)</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                Your continued use of the Platform after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">13. Miscellaneous</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">13.1 Entire Agreement</h3>
              <p className="text-foreground leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and StartUpPath.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">13.2 Severability</h3>
              <p className="text-foreground leading-relaxed">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">13.3 Waiver</h3>
              <p className="text-foreground leading-relaxed">
                Our failure to enforce any right or provision does not constitute a waiver of that right or provision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">14. Contact Information</h2>
              <p className="text-foreground leading-relaxed">
                For questions about these Terms, please contact us:
              </p>
              <div className="mt-4 p-6 bg-muted/50 rounded-lg border border-border">
                <p className="text-foreground"><strong>Email:</strong> legal@startuppath.com</p>
                <p className="text-foreground mt-2"><strong>Support:</strong> support@startuppath.com</p>
                <p className="text-foreground mt-2"><strong>Address:</strong> StartUpPath, Manchester, United Kingdom</p>
              </div>
            </section>

            <div className="mt-12 p-6 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-foreground font-semibold">
                By clicking "Create Account" or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
