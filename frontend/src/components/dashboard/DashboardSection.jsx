function DashboardSection({ title, children }) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-white">
          {title}
        </h2>
  
        {children}
      </section>
    );
  }
  
  export default DashboardSection;