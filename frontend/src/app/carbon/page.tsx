'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CarbonPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/carbon/marketplace');
  }, [router]);

  return null;
}


