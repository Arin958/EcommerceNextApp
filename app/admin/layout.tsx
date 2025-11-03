import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { User } from "@/schema/schema";
import { Sidebar } from "@/components/admin/AdminSidebar";




const Layout = async ({ children }: { children: React.ReactNode }) => {
  // ✅ await is required because auth() returns a Promise
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  

  await connectDB();
  const user = await User.findOne({ clerkId: userId });

  if (!user || user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar/>
      <div className='flex min-h-screen flex-1 flex-col p-2 w[calc(100%-264px)]'>
        
        {children}
      </div>
    </main>
  );
};

export default Layout;
