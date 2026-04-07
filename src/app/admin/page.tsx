'use client';
import React from 'react';
import ListeUsers from '@/app/components/admin/ListeUsers';
import { AdminPageShell } from '@/app/components/layout/AdminPageShell';

const Page = () => {
  return (
    <AdminPageShell>
      <ListeUsers />
    </AdminPageShell>
  );
};

export default Page;
