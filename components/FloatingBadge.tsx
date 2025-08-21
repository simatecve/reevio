'use client'

const FloatingBadge = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-700/50 shadow-lg">
        <span className="text-sm text-gray-300">Built with</span>
        <span className="text-sm font-semibold text-white flex items-center">
          <span className="mr-1">⚡</span>
          NocodeShip
        </span>
      </div>
    </div>
  )
}

export default FloatingBadge