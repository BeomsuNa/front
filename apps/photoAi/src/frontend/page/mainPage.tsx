import React from 'react'

const MainPage = () => {
  return (
    <main>
    <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
            AI-Powered Photo
            <span className="bg-gradient-to-l from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your photography with artificial intelligence, generate gradient square themes
            and showcase your work like never before.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap">
              Start Creating
            </button>
            <button className="border border-gray-300 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 whitespace-nowrap">
              View Gallery
            </button>
          </div>
          <div className='mt-16 flex justify-center'>
          <div className='grid grid-cols-2 grid-rows-2  justify-center items-center sm:grid-cols-2 lg:grid-cols-2 gap-6 '>
           {[1, 2, 3, 4].map((i) => (
  <div
    key={i}
    className="w-72 aspect-square bg-gray-200 rounded-lg border-2 border-dashed border-gray-300"
  />
))}       </div>
          </div>
        </div>
        </main>
  )
}

export default MainPage