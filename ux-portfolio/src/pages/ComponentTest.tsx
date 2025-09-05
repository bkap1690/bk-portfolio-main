// import React from "react";
import BentoGrid from "../components/BentoGrid";
import SuccessMetrics from "../components/SuccessMetrics";

const sampleMetrics = [
  {
    value: 45,
    label: 'Faster Data Entry',
    suffix: '%'
  },
  {
    value: 78,
    label: 'User Satisfaction',
    suffix: '%'
  },
  {
    value: 60,
    label: 'Fewer Errors',
    suffix: '%'
  }
];

export default function ComponentTest() {
  return (
    <div className="min-h-screen bg-background dark:bg-background p-8">
      <h1 className="text-3xl font-bold mb-8 text-primary dark:text-primary-dark">Component Test Page</h1>
      <BentoGrid />
      <SuccessMetrics metrics={sampleMetrics} />
    </div>
  );
} 