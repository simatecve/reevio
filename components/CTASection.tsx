import Link from 'next/link'

export default function CTASection() {
  return (
    <div className="bg-gray-100 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
          Ready to build
          <br />
          <span className="italic">smarter</span>?
        </h2>
        
        <Link href="/api/auth/signin?callbackUrl=%2Fdashboard">
          <button className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors duration-200">
            Start Your Journey Today
          </button>
        </Link>
      </div>
    </div>
  );
}