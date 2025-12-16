'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CorporatePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/corporate/dashboard');
  }, [router]);

  return null;
}


