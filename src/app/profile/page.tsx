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
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-[#111827]">
          Your Profile
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          Manage your personal details and view your generated action plans.
        </p>
      </div>

      <ProfileEditor initialUser={session.user} />
    </div>
  );
}
