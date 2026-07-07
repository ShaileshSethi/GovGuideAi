import { signIn } from "@/auth"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-4">
      <div className="max-w-md w-full bg-card rounded-3xl shadow-xl p-8 md:p-12 border border-[#E5E7EB] text-center animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-accent text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-2 tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mb-8 font-medium">Sign in to GovGuide AI to save your action plans and access premium features.</p>
        
        <form
          action={async (formData) => {
            "use server"
            await signIn("credentials", { 
              email: formData.get("email"),
              password: formData.get("password"),
              redirectTo: "/" 
            })
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-bold text-foreground text-left mb-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="demo@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground text-left mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="Enter any password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            type="submit" 
            className="w-full flex items-center justify-center space-x-2 bg-primary text-white font-bold py-3.5 px-4 rounded-xl hover:bg-[#166534] transition-all duration-200 active:scale-95 shadow-sm mt-6"
          >
            <span>Sign In</span>
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </form>

        <div className="mt-8 text-sm text-muted-foreground font-medium">
          By clicking continue, you agree to our <br/>
          <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  )
}
