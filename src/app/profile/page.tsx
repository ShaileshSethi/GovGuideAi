import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProfileEditor from './ProfileEditor';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <ProfileEditor initialUser={session.user} />
  );
}
