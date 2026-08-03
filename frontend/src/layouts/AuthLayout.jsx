function AuthLayout({ title, subtitle, children }) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 items-center justify-center border-r border-zinc-800 bg-gradient-to-br from-black via-zinc-950 to-blue-950">
          <div className="max-w-md px-10">
            <h1 className="text-5xl font-bold text-blue-500">
              NEXORA AI OS
            </h1>
  
            <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
              AI-powered platform for learning, productivity, careers,
              collaboration, and innovation—all in one place.
            </p>
          </div>
        </div>
  
        {/* Right Side */}
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
            <h2 className="text-3xl font-bold">{title}</h2>
  
            <p className="mt-2 text-zinc-400">
              {subtitle}
            </p>
  
            <div className="mt-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default AuthLayout;