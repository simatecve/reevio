import Link from 'next/link'

export default function TermsOfService() {
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
          Terms of Service for reevio
        </h1>

        {/* Last updated */}
        <p className="text-black mb-8">
          Last Updated: 2023-08-25
        </p>

        {/* Content */}
        <div className="text-black space-y-6">
          <p>
            Welcome to reevio ("we," "us," or "our"). These Terms of Service ("Terms") 
            govern your use of our website located at https://reevio.com (the "Service") 
            operated by reevio.
          </p>

          <p>
            By accessing or using our Service, you agree to be bound by these Terms. 
            If you disagree with any part of these terms, then you may not access the Service.
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            
            <p>
              By accessing and using this website, you accept and agree to be bound by 
              the terms and provision of this agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
            
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials 
              on reevio's website for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title, and under this 
              license you may not:
            </p>
            
            <ul className="list-disc list-inside space-y-2">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">3. Disclaimer</h2>
            
            <p>
              The materials on reevio's website are provided on an 'as is' basis. 
              reevio makes no warranties, expressed or implied, and hereby disclaims 
              and negates all other warranties including without limitation, implied 
              warranties or conditions of merchantability, fitness for a particular 
              purpose, or non-infringement of intellectual property or other violation 
              of rights.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">4. Limitations</h2>
            
            <p>
              In no event shall reevio or its suppliers be liable for any damages 
              (including, without limitation, damages for loss of data or profit, 
              or due to business interruption) arising out of the use or inability 
              to use the materials on reevio's website, even if reevio or a reevio 
              authorized representative has been notified orally or in writing of 
              the possibility of such damage.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">5. Accuracy of Materials</h2>
            
            <p>
              The materials appearing on reevio's website could include technical, 
              typographical, or photographic errors. reevio does not warrant that 
              any of the materials on its website are accurate, complete, or current.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">6. Links</h2>
            
            <p>
              reevio has not reviewed all of the sites linked to our website and is 
              not responsible for the contents of any such linked site. The inclusion 
              of any link does not imply endorsement by reevio of the site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">7. Modifications</h2>
            
            <p>
              reevio may revise these terms of service for its website at any time 
              without notice. By using this website, you are agreeing to be bound by 
              the then current version of these terms of service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">8. Governing Law</h2>
            
            <p>
              These terms and conditions are governed by and construed in accordance 
              with the laws and you irrevocably submit to the exclusive jurisdiction 
              of the courts in that state or location.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">9. Contact Information</h2>
            
            <p>
              If you have any questions about these Terms of Service, please contact 
              us at terms@reevio.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}