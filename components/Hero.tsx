'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronUp, X, Award, Star } from 'lucide-react'
import Link from 'next/link'

const testimonials = [
  {
    id: 1,
    text: "Amazing product! It has completely transformed how we work.",
    author: "Sarah Johnson",
    role: "Product Manager",
    avatar: "SJ",
    rating: 5,
    color: "from-purple-400 to-purple-600"
  },
  {
    id: 2,
    text: "The best tool I've used in years. Highly recommended!",
    author: "Mike Chen",
    role: "Software Engineer",
    avatar: "MC",
    rating: 5,
    color: "from-blue-400 to-blue-600"
  },
  {
    id: 3,
    text: "Incredible user experience and fantastic support team.",
    author: "Emma Davis",
    role: "Designer",
    avatar: "ED",
    rating: 5,
    color: "from-green-400 to-green-600"
  },
  {
    id: 4,
    text: "This has saved us countless hours. Worth every penny!",
    author: "Alex Rodriguez",
    role: "CEO",
    avatar: "AR",
    rating: 5,
    color: "from-orange-400 to-orange-600"
  },
  {
    id: 5,
    text: "Outstanding quality and exceptional customer service. Exceeded all expectations!",
    author: "Lisa Thompson",
    role: "Marketing Director",
    avatar: "LT",
    rating: 5,
    color: "from-pink-400 to-pink-600"
  },
  {
    id: 6,
    text: "Game-changer for our business. The ROI has been incredible.",
    author: "David Wilson",
    role: "Operations Manager",
    avatar: "DW",
    rating: 5,
    color: "from-indigo-400 to-indigo-600"
  },
  {
    id: 7,
    text: "Seamless integration and powerful features. Couldn't be happier!",
    author: "Rachel Green",
    role: "Tech Lead",
    avatar: "RG",
    rating: 5,
    color: "from-teal-400 to-teal-600"
  },
  {
    id: 8,
    text: "The support team is amazing and the product delivers on every promise.",
    author: "James Miller",
    role: "CTO",
    avatar: "JM",
    rating: 5,
    color: "from-red-400 to-red-600"
  }
]

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const testimonialsToShow = 3
  const maxIndex = testimonials.length - testimonialsToShow

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (testimonials.length))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const getCurrentTestimonials = () => {
    const result = []
    for (let i = 0; i < testimonialsToShow; i++) {
      const index = (currentIndex + i) % testimonials.length
      result.push(testimonials[index])
    }
    return result
  }

  return (
    <div className="mt-20 relative">
      <div className="max-w-6xl mx-auto px-4">
        {/* 3 Column Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {getCurrentTestimonials().map((testimonial, index) => (
            <div key={`${currentIndex}-${testimonial.id}`} className="animate-fade-in">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-semibold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={prevTestimonial}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Dots indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextTestimonial}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

const Hero = () => {
  const [feedbackItems, setFeedbackItems] = useState([
    { id: 1, title: 'PayPal integration', description: '20% of users are asking for it, I need it to grow revenue', votes: 37, isExpanded: false },
    { id: 2, title: 'Images should be smaller', description: "They're cropped on mobile.", votes: 12, isExpanded: false },
    { id: 3, title: 'Dark mode', description: "PS: I don't pay for your app", votes: 1, isExpanded: false, isRejected: true }
  ])

  const toggleExpand = (id: number) => {
    setFeedbackItems(items => 
      items.map(item => 
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    )
  }

  return (
    <div className="min-h-screen gradient-bg pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Build what your users{' '}
                <span className="text-gradient">actually</span>{' '}
                need
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Transform customer feedback into actionable insights. Prioritize features that drive growth and create products your users can't live without.
              </p>
            </div>
            
            <div className="space-y-4">
              <Link href="/api/auth/signin?callbackUrl=%2Fdashboard">
                <button className="btn-primary text-lg px-8 py-4">
                  Start Building Smarter
                </button>
              </Link>
              <p className="text-sm text-gray-500">Free forever. No credit card required.</p>
            </div>
          </div>

          {/* Right Content - Feedback Widget */}
          <div className="relative animate-slide-up">
            {/* Feedback Widget */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 uppercase tracking-wide">Latest Feedback</span>
                  <div className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-xs font-medium">
                    Ship this ✓
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {feedbackItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button 
                          onClick={() => toggleExpand(item.id)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
                        >
                          <ChevronUp className={`w-4 h-4 transition-transform ${item.isExpanded ? 'rotate-180' : ''}`} />
                          <span className="text-sm font-medium">{item.votes}</span>
                        </button>
                      </div>
                    </div>
                    {item.isRejected && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-red-500 text-sm">Not that</span>
                        <X className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-gray-700 rounded-full p-3 shadow-lg animate-float">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <TestimonialsCarousel />
      </div>
    </div>
  )
}

export default Hero