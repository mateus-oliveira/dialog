"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FEED } from '@/constants/routes';

const HomePage = () => {
  const router = useRouter();
  router.push(FEED);
  return (
    <div className="flex">
      <div className="main-content">
        Loading...
      </div>
    </div>
  );
};

export default HomePage;
