"use client";

import React from 'react';
import { useEffect } from "react";
import { FEED } from '@/constants/routes';

const Index = () => {

  useEffect(() => {
    window.location = FEED;
  }, []);

  return <>Loading...</>;
};

export default Index;
