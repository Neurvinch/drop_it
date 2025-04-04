import React from 'react';
import AwardsSection from './AwardsSection';
import './App.css';
const Page = () => {
  return (
    <div className="page-container">
      {/* Other content before the animation */}
      
      <AwardsSection />
      
      {/* Other content after the animation */}
    </div>
  );
};

export default Page;