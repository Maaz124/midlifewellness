import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Eye className="w-16 h-16 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Accessibility Statement</h1>
          <p className="text-gray-600 dark:text-gray-400">Our Commitment to Inclusive Design</p>
        </div>

        <Card>
          <CardContent className="prose prose-purple max-w-none p-8">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Commitment</h2>
              <p className="text-gray-700 dark:text-gray-300">
                BloomAfter40 is committed to ensuring digital accessibility for all users, including those with disabilities. 
                We strive to provide an inclusive experience that empowers every woman to access our wellness resources, 
                regardless of their abilities or the technologies they use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Accessibility Standards</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These 
                internationally recognized guidelines help ensure our platform is accessible to people with a wide range 
                of disabilities, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Visual impairments (blindness, low vision, color blindness)</li>
                <li>Hearing impairments</li>
                <li>Motor impairments and limited dexterity</li>
                <li>Cognitive and learning disabilities</li>
                <li>Neurological conditions</li>
                <li>Speech disabilities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Accessibility Features</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Keyboard Navigation</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                <li>All interactive elements are keyboard accessible</li>
                <li>Logical tab order throughout the platform</li>
                <li>Visible focus indicators on interactive elements</li>
                <li>Skip navigation links for efficient browsing</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Screen Reader Support</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                <li>Semantic HTML markup for proper structure</li>
                <li>ARIA labels and descriptions where needed</li>
                <li>Alternative text for images and icons</li>
                <li>Descriptive link text and button labels</li>
                <li>Properly labeled form fields</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Visual Design</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                <li>High contrast color combinations for readability</li>
                <li>Color is not the only means of conveying information</li>
                <li>Resizable text up to 200% without loss of functionality</li>
                <li>Clear visual hierarchy and spacing</li>
                <li>Dark mode option for reduced eye strain</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Content Structure</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                <li>Proper heading hierarchy (H1, H2, H3, etc.)</li>
                <li>Descriptive page titles</li>
                <li>Clear and simple language</li>
                <li>Organized content with logical flow</li>
                <li>Consistent navigation across pages</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Forms and Interactions</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Clear labels for all form inputs</li>
                <li>Error messages that are descriptive and helpful</li>
                <li>Sufficient time to complete forms and interactions</li>
                <li>Confirmation of actions and submissions</li>
                <li>Ability to review and correct entries before submitting</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Assistive Technology Compatibility</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our platform is designed to work with commonly used assistive technologies, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
                <li>Voice recognition software (Dragon NaturallySpeaking)</li>
                <li>Screen magnification software (ZoomText, MAGic)</li>
                <li>Alternative input devices (switch controls, head pointers)</li>
                <li>Browser accessibility features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Browser and Device Support</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                BloomAfter40 is compatible with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Modern web browsers (Chrome, Firefox, Safari, Edge) - latest two versions</li>
                <li>Mobile browsers on iOS and Android devices</li>
                <li>Tablet devices with touch interfaces</li>
                <li>Desktop computers with keyboard and mouse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Ongoing Improvements</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We recognize that accessibility is an ongoing effort. We are committed to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Regular accessibility audits and testing</li>
                <li>Incorporating user feedback into improvements</li>
                <li>Training our team on accessibility best practices</li>
                <li>Staying current with evolving accessibility standards</li>
                <li>Addressing identified issues promptly</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Known Limitations</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Despite our efforts, some areas of the platform may not yet meet all accessibility standards. 
                We are actively working to address these limitations:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Some third-party content or embedded media may have limited accessibility</li>
                <li>Certain interactive features are being enhanced for better screen reader support</li>
                <li>Legacy content is being reviewed and updated for accessibility compliance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Accessibility Tips for Users</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Adjusting Your Browser</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                <li>Use browser zoom (Ctrl + or Cmd +) to increase text size</li>
                <li>Enable high contrast mode in your operating system</li>
                <li>Use browser extensions for additional accessibility features</li>
                <li>Adjust color settings if you have color vision deficiency</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Keyboard Shortcuts</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Tab:</strong> Move forward through interactive elements</li>
                <li><strong>Shift + Tab:</strong> Move backward through interactive elements</li>
                <li><strong>Enter:</strong> Activate links and buttons</li>
                <li><strong>Space:</strong> Activate buttons and toggle controls</li>
                <li><strong>Esc:</strong> Close dialogs and modals</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Feedback and Support</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We welcome your feedback on the accessibility of BloomAfter40. If you encounter accessibility barriers 
                or have suggestions for improvement, please let us know:
              </p>
              <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> <a href="mailto:accessibility@bloomafter40.com" className="text-purple-600 hover:text-purple-700">accessibility@bloomafter40.com</a><br />
                  <strong>Subject Line:</strong> Accessibility Issue or Suggestion<br />
                  <strong>Response Time:</strong> We aim to respond within 2 business days
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                When reporting an issue, please include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mt-3">
                <li>The web page or feature where you encountered the issue</li>
                <li>A description of the accessibility barrier</li>
                <li>The assistive technology you were using (if applicable)</li>
                <li>Your browser and operating system information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Third-Party Content</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Some content on our platform may be provided by third parties (embedded videos, external links, etc.). 
                While we strive to ensure all content is accessible, we cannot always guarantee the accessibility of 
                third-party materials. We encourage providers to maintain accessible content and will work with them 
                to address reported issues.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Alternative Formats</h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you need content in an alternative format (large print, audio, Braille, etc.), please contact us. 
                We will make reasonable efforts to provide the information in your preferred accessible format within 
                a reasonable timeframe.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Formal Complaints</h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you are not satisfied with our response to your accessibility concern, you may file a formal complaint. 
                We take all complaints seriously and will investigate and respond appropriately. Please send formal complaints 
                to <a href="mailto:accessibility@bloomafter40.com" className="text-purple-600 hover:text-purple-700">accessibility@bloomafter40.com</a> with 
                "Formal Accessibility Complaint" in the subject line.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Last Reviewed:</strong> October 24, 2025<br />
                <strong>Next Review:</strong> April 24, 2026
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
