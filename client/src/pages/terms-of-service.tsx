import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FileText className="w-16 h-16 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400">Last Updated: October 24, 2025</p>
        </div>

        <Card>
          <CardContent className="prose prose-purple max-w-none p-8">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300">
                By accessing or using BloomAfter40 ("Platform," "Service," "we," "us," or "our"), you agree to be bound by 
                these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Description of Service</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                BloomAfter40 provides a comprehensive wellness platform for women navigating perimenopause and midlife transitions, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Health assessment tools (mental, physical, and cognitive)</li>
                <li>6-week Mind-Body Reset coaching program</li>
                <li>Journaling and mindfulness practices</li>
                <li>Progress tracking and goal management</li>
                <li>Educational resources and community directory</li>
                <li>Optional personal coaching services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Eligibility</h2>
              <p className="text-gray-700 dark:text-gray-300">
                You must be at least 18 years old to use this platform. By using our services, you represent and warrant 
                that you meet this age requirement and have the legal capacity to enter into this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">User Account</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Not share your account with others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Subscription and Payment</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Payment Terms</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Subscription fees are billed in advance on a recurring basis</li>
                <li>All payments are processed securely through Stripe</li>
                <li>Prices are subject to change with 30 days' notice</li>
                <li>You authorize us to charge your payment method for all fees</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-6">Cancellation and Refunds</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>You may cancel your subscription at any time</li>
                <li>Cancellation takes effect at the end of the current billing period</li>
                <li>No refunds for partial subscription periods unless required by law</li>
                <li>Access continues until the end of the paid period after cancellation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Acceptable Use</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Violate any laws or regulations in your jurisdiction</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the platform's operation</li>
                <li>Scrape, copy, or redistribute our content without permission</li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Intellectual Property</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                All content, materials, features, and functionality on BloomAfter40 are owned by us and protected by 
                copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                You are granted a limited, non-exclusive, non-transferable license to access and use the platform for 
                personal, non-commercial purposes. You may not reproduce, distribute, modify, or create derivative works 
                without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">User Content</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You retain ownership of content you create (journal entries, goals, etc.). By using our platform, you grant us 
                a limited license to store, process, and display your content solely to provide our services.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                You are responsible for the content you create and must ensure it does not violate any laws or third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Medical and Health Disclaimers</h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="text-gray-700 dark:text-gray-300 font-semibold">IMPORTANT HEALTH NOTICE</p>
              </div>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>This platform provides educational and self-help coaching content only</li>
                <li>Our services are NOT a substitute for professional medical care</li>
                <li>We do NOT establish a doctor-patient relationship</li>
                <li>Always consult your healthcare provider for medical advice</li>
                <li>Seek immediate help if experiencing a medical emergency</li>
                <li>We are not liable for health outcomes from using our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                TO THE FULLEST EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>We provide the platform "AS IS" without warranties of any kind</li>
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the amount you paid in the past 12 months</li>
                <li>We are not responsible for service interruptions or data loss</li>
                <li>We do not guarantee specific health or wellness outcomes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Indemnification</h2>
              <p className="text-gray-700 dark:text-gray-300">
                You agree to indemnify and hold harmless BloomAfter40, Dr. Sidra Bukhari, and our affiliates from any 
                claims, damages, or expenses arising from your use of the platform, violation of these terms, or infringement 
                of any third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Termination</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We reserve the right to suspend or terminate your access to the platform at any time for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Violation of these Terms of Service</li>
                <li>Fraudulent or illegal activity</li>
                <li>Non-payment of fees</li>
                <li>Any reason at our sole discretion</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Upon termination, your right to use the platform ceases immediately, though certain provisions survive termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Dispute Resolution</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Any disputes arising from these terms or your use of the platform shall be resolved through binding arbitration 
                in accordance with the rules of the American Arbitration Association. You waive your right to participate in 
                class action lawsuits.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Governing Law</h2>
              <p className="text-gray-700 dark:text-gray-300">
                These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction in which 
                BloomAfter40 operates, without regard to conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Changes to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We may modify these terms at any time. We will notify you of significant changes by posting a notice on the 
                platform or sending an email. Your continued use after changes become effective constitutes acceptance of the 
                updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Severability</h2>
              <p className="text-gray-700 dark:text-gray-300">
                If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full 
                force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> <a href="mailto:legal@bloomafter40.com" className="text-purple-600 hover:text-purple-700">legal@bloomafter40.com</a><br />
                  <strong>Mail:</strong> BloomAfter40 Legal Department<br />
                  <strong>Response Time:</strong> We aim to respond within 48 hours
                </p>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
