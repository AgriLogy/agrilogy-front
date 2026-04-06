'use client';
import React from 'react';
import CreateUser from '@/app/components/admin/CreateUser';
import { AdminPageShell } from '@/app/components/layout/AdminPageShell';

const Page = () => {
  return (
    <AdminPageShell>
      <CreateUser />
    </AdminPageShell>
  );
};

export default Page;
