import React from 'react';

const StarRating = ({ rating = 0, size = 'medium', interactive = false, onRatingChange }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const StarIcon = ({ filled, half, index }) => (
    <svg
      className={`${sizeClasses[size]} ${
        filled ? 'text-yellow-400' : half ? 'text-yellow-400' : 'text-gray-600'
      } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      onClick={() => interactive && onRatingChange && onRatingChange(index + 1)}
    >
      {half ? (
        <defs>
          <linearGradient id={`half-${index}`}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="rgb(75, 85, 99)" />
          </linearGradient>
        </defs>
      ) : null}
      <path
        fillRule="evenodd"
        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
        clipRule="evenodd"
        fill={half ? `url(#half-${index})` : 'currentColor'}
      />
    </svg>
  );

  const stars = [];

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={i} filled={true} index={i} />);
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<StarIcon key={fullStars} half={true} index={fullStars} />);
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<StarIcon key={fullStars + (hasHalfStar ? 1 : 0) + i} filled={false} index={fullStars + (hasHalfStar ? 1 : 0) + i} />);
  }

  return (
    <div className="flex items-center space-x-1">
      {stars}
    </div>
  );
};

export default StarRating; 