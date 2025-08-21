'use client'

import { useState } from 'react'

const FeaturesSection = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Turn feedback into
            <br />
            game-changing features
          </h2>
        </div>

        {/* Top row - Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Collect user feedback */}
          <div 
            className="relative bg-green-400 rounded-2xl p-6 overflow-hidden cursor-pointer transition-all duration-300 h-80 flex flex-col"
            onMouseEnter={() => setHoveredCard('feedback')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Capture brilliant ideas</h3>
            <p className="text-gray-700 text-sm mb-4">Transform your users into product co-creators with seamless feedback collection.</p>
            
            {/* Mock interface - takes remaining space */}
            <div className="bg-white rounded-lg p-3 shadow-sm flex-1 flex flex-col">
              <div className="text-xs text-gray-600 mb-2 uppercase tracking-wide">Suggest a feature</div>
              
              {/* Input field with typing effect - takes remaining space */}
              <div className="relative flex-1 flex flex-col">
                <div className="bg-gray-50 rounded-md p-2 border text-sm flex-1 flex flex-col justify-start">
                  <div className={`transition-all duration-1000 ${hoveredCard === 'feedback' ? 'opacity-100' : 'opacity-0'} flex-1`}>
                    <span className="text-gray-900">
                      {hoveredCard === 'feedback' ? 'Notifications should be visible only on certain pages.\n\nTerms & privacy pages don\'t need them.' : ''}
                    </span>
                    <span className={`inline-block w-0.5 h-4 bg-gray-700 ml-1 ${hoveredCard === 'feedback' ? 'animate-pulse' : ''}`}></span>
                  </div>
                </div>
                {hoveredCard === 'feedback' && (
                  <button className="mt-3 bg-green-400 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Prioritize features */}
             <div 
               className="relative bg-gray-900 rounded-2xl p-6 h-80 overflow-hidden cursor-pointer"
               onMouseEnter={() => setHoveredCard('prioritize')}
               onMouseLeave={() => setHoveredCard(null)}
             >
               <h3 className="text-xl font-bold text-white mb-2">Make data-driven decisions</h3>
               <p className="text-gray-300 text-sm mb-4">Let user votes guide your roadmap. Build what matters most to your audience.</p>
               
               {/* Mock feature list with scroll effect */}
               <div className="relative h-48 overflow-hidden">
                 <div className={`space-y-2 transition-transform duration-700 ease-in-out ${hoveredCard === 'prioritize' ? '-translate-y-20' : 'translate-y-0'}`}>
                   <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                     <div>
                       <div className="text-sm font-medium text-gray-900">Add LemonSqueezy integration to the boilerplate</div>
                       <div className="text-xs text-green-600">Yes, ship this! ✅</div>
                     </div>
                     <div className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold">48</div>
                   </div>
                   
                   <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                     <div>
                       <div className="text-sm font-medium text-gray-900">A new pricing table for metered billing</div>
                       <div className="text-xs text-red-600">Maybe ship this 🤔</div>
                     </div>
                     <div className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold">12</div>
                   </div>
                   
                   <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                     <div>
                       <div className="text-sm font-medium text-gray-900">A new UI library for the dashboard</div>
                       <div className="text-xs text-red-600">But don't ship that ❌</div>
                     </div>
                     <div className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold">1</div>
                   </div>
                   
                   <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                     <div>
                       <div className="text-sm font-medium text-gray-900">Dark mode toggle</div>
                       <div className="text-xs text-green-600">Nice to have 👍</div>
                     </div>
                     <div className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold">8</div>
                   </div>
                   
                   <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                     <div>
                       <div className="text-sm font-medium text-gray-900">Better search functionality</div>
                       <div className="text-xs text-purple-600">Could be useful 🔍</div>
                     </div>
                     <div className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold">3</div>
                   </div>
                 </div>
               </div>
             </div>
        </div>

        {/* Bottom row - Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Your brand, your board */}
          <div className="bg-gray-100 rounded-2xl p-6 h-80">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your brand, your board</h3>
            <p className="text-gray-600 text-sm mb-4">Customize your Insights board with 7 themes.</p>
            
            {/* Mock board preview with colorful kanban */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-lg p-4 transform -rotate-2">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-yellow-300 rounded p-2 text-xs font-medium text-gray-900">TRENDING FEEDBACK</div>
                  <div className="bg-pink-300 rounded p-2 text-xs font-medium text-gray-900">DOING FEEDBACK</div>
                  <div className="bg-blue-300 rounded p-2 text-xs font-medium text-gray-900">FEEDBACK</div>
                </div>
                <div className="space-y-1">
                  <div className="bg-white rounded p-2 text-xs">Clickable cards</div>
                  <div className="bg-white rounded p-2 text-xs">Make cards more accessible</div>
                  <div className="bg-white rounded p-2 text-xs">Resize images</div>
                </div>
              </div>
              
              {/* Overlapping cards effect */}
              <div className="absolute top-2 right-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-3 transform rotate-3 opacity-80">
                <div className="text-xs text-white font-medium">More cards</div>
              </div>
            </div>
          </div>

          {/* Discover new ideas */}
          <div 
            className="relative bg-blue-600 rounded-2xl p-6 h-80 overflow-hidden cursor-pointer"
            onMouseEnter={() => setHoveredCard('discover')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 className="text-xl font-bold text-white mb-2">Spark innovation together</h3>
            <p className="text-blue-100 text-sm mb-4">Foster collaboration and uncover breakthrough ideas through community discussions.</p>
            
            {/* Mock chat */}
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
                  <span className="text-gray-900 text-sm font-medium">Sofia Martinez</span>
                  <span className="text-gray-500 text-xs">Dec 15, 2024</span>
                </div>
                <p className="text-gray-900 text-sm">Would love to see real-time notifications when someone votes on my feedback!</p>
              </div>
              
              {/* New comment sliding in from right */}
              <div className={`transition-all duration-700 ${hoveredCard === 'discover' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
                    <span className="text-gray-900 text-sm font-medium">Alex Chen</span>
                    <span className="text-gray-500 text-xs">Dec 16, 2024</span>
                  </div>
                  <p className="text-gray-900 text-sm">Great idea! This would help us stay engaged with our users 🚀</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturesSection