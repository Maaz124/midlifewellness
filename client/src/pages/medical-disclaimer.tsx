import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function MedicalDisclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Medical Disclaimer</h1>
          <p className="text-gray-600 dark:text-gray-400">Important Health and Safety Information</p>
        </div>

        {/* Critical Notice */}
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                Medical Emergency Warning
              </h3>
              <p className="text-red-800 dark:text-red-300">
                If you are experiencing a medical emergency, including thoughts of self-harm or suicide, please call 911 
                immediately or go to your nearest emergency room. Do not rely on this platform for emergency medical care.
              </p>
              <p className="text-red-800 dark:text-red-300 mt-2">
                <strong>Crisis Resources:</strong> National Suicide Prevention Lifeline: 988 | Crisis Text Line: Text HOME to 741741
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="prose prose-purple max-w-none p-8">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Nature of Services</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                BloomAfter40 is a wellness and educational platform designed to support women through midlife transitions. 
                Our services include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Self-help coaching programs and educational content</li>
                <li>Mindfulness training and stress reduction techniques</li>
                <li>Health assessment tools for personal awareness</li>
                <li>Journaling and goal-tracking features</li>
                <li>General wellness information and resources</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4 font-semibold">
                These services are NOT medical treatment, therapy, or professional healthcare services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Not a Substitute for Medical Care</h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mb-4">
                <p className="text-gray-700 dark:text-gray-300 font-semibold">
                  The information and tools provided on this platform are for educational and self-help purposes only. 
                  They are NOT intended to diagnose, treat, cure, or prevent any disease or medical condition.
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You should always:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Consult with your physician or qualified healthcare provider before starting any new health program</li>
                <li>Seek professional medical advice for any health concerns or symptoms</li>
                <li>Continue taking prescribed medications unless directed otherwise by your doctor</li>
                <li>Not delay seeking medical care because of information on this platform</li>
                <li>Inform your healthcare providers about any wellness programs you are following</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No Doctor-Patient Relationship</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Although Dr. Sidra Bukhari is a licensed medical professional (MRCPsych UK), your use of this platform 
                does NOT create a doctor-patient relationship. The coaching services provided are educational and 
                self-help in nature, not medical treatment.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Dr. Sidra Bukhari is not acting in her capacity as a physician when providing coaching services through 
                this platform. She is serving as a life coach and wellness educator.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Health Assessment Tools</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our mental, physical, and cognitive health assessment tools are designed for personal awareness and 
                educational purposes only. They are NOT clinical diagnostic instruments.
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Assessment results do not constitute medical diagnoses</li>
                <li>Scores and recommendations are general guidance, not medical advice</li>
                <li>These tools cannot replace professional evaluation by qualified healthcare providers</li>
                <li>If you have concerns about your health, consult a medical professional</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Mental Health Considerations</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Important:</strong> This platform is not appropriate for individuals experiencing severe mental 
                  health crises, including severe depression, anxiety disorders, psychosis, or suicidal ideation.
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you are experiencing any of the following, please seek professional help immediately:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Thoughts of harming yourself or others</li>
                <li>Severe depression or hopelessness</li>
                <li>Debilitating anxiety or panic attacks</li>
                <li>Hallucinations or delusional thinking</li>
                <li>Symptoms interfering with daily functioning</li>
                <li>Substance abuse or addiction issues</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                For these conditions, please consult a psychiatrist, psychologist, or licensed mental health professional.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Physical Health and Exercise</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Before beginning any exercise program or making significant changes to your physical activity:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Consult with your physician, especially if you have pre-existing health conditions</li>
                <li>Get medical clearance if you've been sedentary or have cardiovascular concerns</li>
                <li>Start slowly and listen to your body</li>
                <li>Stop immediately and seek medical attention if you experience pain, dizziness, or shortness of breath</li>
                <li>Modify exercises as needed for your fitness level and physical limitations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Perimenopause and Hormone Health</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Information about perimenopause, menopause, and hormonal changes is provided for educational purposes only:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Every woman's experience is unique and requires personalized medical evaluation</li>
                <li>Hormone replacement therapy and other treatments require physician oversight</li>
                <li>Severe or concerning symptoms should be evaluated by a gynecologist or endocrinologist</li>
                <li>Do not start, stop, or modify hormone treatments without medical supervision</li>
                <li>Some symptoms may indicate serious health conditions requiring immediate attention</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Individual Results May Vary</h2>
              <p className="text-gray-700 dark:text-gray-300">
                The results and experiences of individual users may vary widely. We make no guarantees or promises regarding:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mt-4">
                <li>Improvement in health, wellness, or quality of life</li>
                <li>Relief from symptoms or health conditions</li>
                <li>Achievement of specific goals or outcomes</li>
                <li>Consistency of results across users</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Your success depends on many factors including your effort, health status, medical care, and individual circumstances.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Information Accuracy</h2>
              <p className="text-gray-700 dark:text-gray-300">
                While we strive to provide accurate and up-to-date information, medical knowledge and best practices evolve 
                constantly. We make no warranties about the completeness, reliability, or accuracy of the information provided. 
                Always verify health information with qualified healthcare professionals and current medical literature.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 dark:text-gray-300">
                To the fullest extent permitted by law, BloomAfter40 and Dr. Sidra Bukhari assume no liability for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mt-4">
                <li>Health outcomes, injuries, or complications resulting from use of this platform</li>
                <li>Decisions made based on information or tools provided</li>
                <li>Reliance on content as a substitute for professional medical care</li>
                <li>Delays in seeking appropriate medical treatment</li>
                <li>Any adverse health events or conditions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your Responsibility</h2>
              <p className="text-gray-700 dark:text-gray-300">
                By using this platform, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mt-4">
                <li>You are responsible for your own health and wellness decisions</li>
                <li>You will consult appropriate healthcare professionals for medical concerns</li>
                <li>You will use the platform's tools and information responsibly</li>
                <li>You understand this is not a substitute for professional healthcare</li>
                <li>You accept all risks associated with using wellness and self-help programs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">When to Seek Professional Help</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Contact a healthcare professional if you experience:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>New, severe, or worsening symptoms</li>
                <li>Symptoms that concern or worry you</li>
                <li>Unusual bleeding or discharge</li>
                <li>Severe or persistent pain</li>
                <li>Changes in mental status or cognitive function</li>
                <li>Symptoms that interfere with daily life</li>
                <li>Any condition requiring diagnosis or treatment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Questions or Concerns</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have questions about this medical disclaimer or the nature of our services:
              </p>
              <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> <a href="mailto:support@bloomafter40.com" className="text-purple-600 hover:text-purple-700">support@bloomafter40.com</a><br />
                  <strong>Note:</strong> We cannot provide medical advice via email. Contact your healthcare provider for medical questions.
                </p>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
