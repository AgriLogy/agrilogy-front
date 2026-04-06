'use client';
import React, { useEffect, useState } from 'react';
import ZoneMain from '@/app/components/admin/ZoneMainAdmin';
import { AdminPageShell } from '@/app/components/layout/AdminPageShell';

type Params = {
  user: string;
};

const ModifyUserpage = ({ params }: { params: Params }) => {
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
      <ZoneMain user={user} />
    </AdminPageShell>
  );
};

export default ModifyUserpage;
