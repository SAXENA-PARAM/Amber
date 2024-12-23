'use client'

import React, { useState } from 'react'

export const Whydesign = () => {
    const reasons = [
        {
          title: "Comprehensive Learning",
          description:
            "Our platform offers a wide range of courses covering various topics, ensuring that you have access to the best educational resources. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          link:"",
        },
        {
          title: "Interactive Experience",
          description:
            "We provide interactive lessons and engaging activities that make learning enjoyable. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.",
          link:"",
        },
        {
          title: "Expert Instructors",
          description:
            "Our courses are designed and taught by industry experts who are passionate about sharing their knowledge. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          link:"",
        },
        {
          title: "Flexible Learning",
          description:
            "Learn at your own pace with our flexible scheduling options that fit your lifestyle. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel urna eget mi placerat vestibulum.",
          link:"",
        },
        {
          title: "Affordable Pricing",
          description:
            "We believe in making education accessible, which is why we offer competitive pricing for our courses. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          link:"",
        },
        {
          title: "Community Support",
          description:
            "Join a thriving community of learners and educators who are here to support you on your journey. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          link:"",
        },
    ];

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
      
    return (
        <div className='flex flex-col md:flex-row w-full overflow-x-hidden'>
            <div className='w-full md:w-[40%] bg-green-500 h-[60vh] flex flex-col justify-center items-center'>
                <span className="text-4xl font-bold">WHY</span>
                <span className="text-4xl font-bold">AMBER</span>
            </div>
            <div className="points bg-blue-500 h-[60vh] w-full md:w-[60%] relative">
                {reasons.map((reason, index) => (
                    <div key={index} className="relative">
                        <div 
                            className={`border rounded-l-full absolute h-12 overflow-hidden pl-4 flex items-center transition-all duration-300 ease-in-out ${
                                hoveredIndex === null || hoveredIndex === index ? 'opacity-100' : 'opacity-50'
                            }`}
                            style={{
                                left: `${100 - (index + 1) * (100 / reasons.length)}%`,
                                top: `${(index * 60) / reasons.length}vh`,
                                width: `${(index + 1) * (100 / reasons.length)}%`
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className={`topic text-sm md:text-base font-semibold transition-all duration-300 ease-in-out ${
                                hoveredIndex === index ? 'absolute left-1/2 transform -translate-x-1/2' : ''
                            }`}>
                                {reason.title}
                            </div>
                        </div>
                        {hoveredIndex === index && (
                            <div 
                                className="absolute bg-white rounded-lg p-4 shadow-lg z-10 overflow-hidden"
                                style={{
                                    left: `${100 - (index + 1) * (100 / reasons.length)}%`,
                                    top: `${((index * 60) / reasons.length) + 12}vh`,
                                    width: `${(index + 1) * (100 / reasons.length)}%`,
                                    maxWidth: '400px',
                                    animation: 'slideDown 0.5s ease-out'
                                }}
                            >
                                <h3 className="font-bold mb-2 text-bl">{reason.title}</h3>
                                <p className="text-sm text-black">{reason.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <style jsx>{`
                @keyframes slideDown {
                    from {
                        max-height: 0;
                        opacity: 0;
                    }
                    to {
                        max-height: 200px;
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}