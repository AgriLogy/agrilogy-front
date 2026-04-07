'use client';
import React, { useEffect, useState } from 'react';
import UserStationdata from '@/app/components/admin/UserStationdata';
import { AdminPageShell } from '@/app/components/layout/AdminPageShell';

type Params = {
  user: string;
};

const StationDatapage = ({ params }: { params: Params }) => {
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
      <UserStationdata user={user} />
    </AdminPageShell>
  );
};

export default StationDatapage;
