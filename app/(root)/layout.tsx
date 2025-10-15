





import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MergeCartOnLogin from '@/components/MergeCart';
import connectDB from '@/lib/mongodb';
import { User } from '@/schema/schema';
import { getGuestId } from '@/utils/getGuestId';
import { auth } from '@clerk/nextjs/server';
import { after } from 'next/server'
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {


  await connectDB();
  
  const { userId } = await auth();


  const dbUser = await User.findOne({ clerkId: userId });


  const adminUser = dbUser ? JSON.parse(JSON.stringify(dbUser)) : null;




  return (
    <main className='root-container'>
      <MergeCartOnLogin />
      <div className='mx-auto px-10 '>
        <Header adminUser={adminUser} />

        <div className='mt-20 pb-20'>{children}</div>
      </div>
      <Footer />

    </main>
  )
}

export default layout