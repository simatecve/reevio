import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-black hover:text-gray-700 mb-8">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        {/* Title */}
        <h1 className="text-4xl font-bold text-black mb-4">
          Privacy Policy for reevio
        </h1>

        {/* Last updated */}
        <p className="text-black mb-8">
          Last Updated: 2023-08-25
        </p>

        {/* Content */}
        <div className="text-black space-y-6">
          <p>
            Thank you for visiting reevio ("we," "us," or "our"). This Privacy Policy 
            outlines how we collect, use, and protect your personal and non-personal 
            information when you use our website located at https://reevio.com (the 
            "Website").
          </p>

          <p>
            By accessing or using the Website, you agree to the terms of this Privacy 
            Policy. If you do not agree with the practices described in this policy, please 
            do not use the Website.
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            
            <h3 className="text-lg font-medium mb-2">1.1 Personal Data</h3>
            
            <p className="mb-4">
              We collect the following personal information from you:
            </p>

            <div className="space-y-4">
              <p>
                <strong>Name:</strong> We collect your name to personalize your experience and 
                communicate with you effectively.
              </p>
              
              <p>
                <strong>Email:</strong> We collect your email address to send you important information 
                regarding your orders, updates, and communication.
              </p>
              
              <p>
                <strong>Payment Information:</strong> We collect payment details to process your orders 
                securely. However, we do not store your payment information on our 
                servers. Payments are processed by trusted third-party payment 
                processors.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">1.2 Non-Personal Data</h3>
            
            <p>
              We may also collect non-personal information such as browser type, 
              operating system, IP address, and website usage patterns to improve 
              our services and user experience.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            
            <p>
              We use the collected information for the following purposes:
            </p>
            
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>To provide and maintain our services</li>
              <li>To process transactions and send related information</li>
              <li>To communicate with you about updates, promotions, and support</li>
              <li>To improve our website and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
            
            <p>
              We do not sell, trade, or otherwise transfer your personal information 
              to third parties without your consent, except as described in this policy 
              or as required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
            
            <p>
              We implement appropriate security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or 
              destruction.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
            
            <p>
              If you have any questions about this Privacy Policy, please contact us at 
              privacy@reevio.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}