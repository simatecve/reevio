'use client'

const ScrollSection = () => {
  return (
    <div className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Main content section */}
      <div className="container mx-auto px-8">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Main heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16 leading-tight max-w-4xl">
            <span className="text-red-400">90% of products fail</span>
            <br />
            <span className="text-white">because teams build</span>
            <br />
            <span className="text-yellow-400 underline decoration-4 underline-offset-8">what nobody wants</span>
          </h2>
          
          {/* Icons and descriptions in horizontal layout */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-6xl">
            {/* Launch new feature */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                🚀
              </div>
              <p className="text-white font-semibold text-lg">
                Ship amazing features
              </p>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="text-gray-400 text-3xl font-bold animate-pulse">→</div>
            </div>
            
            {/* But nothing happens */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                📉
              </div>
              <p className="text-white font-semibold text-lg">
                Users ignore them
              </p>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="text-gray-400 text-3xl font-bold animate-pulse">→</div>
            </div>
            
            {/* Lose motivation and quit */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                💔
              </div>
              <p className="text-white font-semibold text-lg">
                Dreams get crushed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScrollSection