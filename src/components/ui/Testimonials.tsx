import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react'; // Shadcn Star icon

const testimonials = [
  {
    name: 'Olivia Turner',
    text: 'ChatPulse has transformed how I study. I can ask my textbooks questions and get instant answers. It&apos;s like having a personal tutor available 24/7!',
    image: '/girl-1.png',
    rating: 4.5,
  },
  {
    name: 'Eva Williams',
    text: 'I often work with documents in PDF format usually, and the functionality offered by ChatPulse not only made my daily life a lot easier but also prompted me to write this review. I like how convenient this tool is and how quickly I can find the necessary information even inside huge files.',
    image: '/girl-2.png',
    rating: 4,
  },
  {
    name: 'Ethan Brooks',
    text: 'I deal with extensive documents daily as a researcher. ChatPulse allows me to extract key information and insights better. It&apos;s an invaluable tool for my research.',
    image: '',
    rating: 4.7,
  },
];

// Star rating component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: fullStars }, (_, i) => (
        <Star key={i} className="text-yellow-400 h-5 w-5" />
      ))}
      {halfStar && <Star className="text-yellow-400 h-5 w-5 opacity-50" />} {/* Half star for .5 */}
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <div className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-12">
          Trusted by People like You
        </h2>
        <p className="text-center text-gray-300 mb-12">
          Don&apos;t just take our word for it. Here&apos;s what some of our users have to say about their experience with ChatWithPDF
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 h-full border-2 border-green-500">
              <p className="text-gray-300 mb-4">{testimonial.text}</p>
            {/* Add star rating */}
              <div className="flex items-center mt-4 mb-2">
                {testimonial.image && (
                  <Image 
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                )}
                <span className="text-white font-medium">{testimonial.name}</span>
              </div>
              <StarRating rating={testimonial.rating} /> 
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
