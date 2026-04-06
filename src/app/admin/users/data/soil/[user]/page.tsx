'use client';
import React, { useEffect, useState } from 'react';
import UserSoildata from '@/app/components/admin/UserSoildata';
import { AdminPageShell } from '@/app/components/layout/AdminPageShell';

type Params = {
  user: string;
};

const SoilDatapage = ({ params }: { params: Params }) => {
  const { user } = params;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <AdminPageShell>
      <UserSoildata user={user} />
    </AdminPageShell>
  );
};

export default SoilDatapage;
