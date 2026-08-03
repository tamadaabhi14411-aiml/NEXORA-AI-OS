import { Bell, Search } from "lucide-react";

function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          type="text"
          placeholder="Search..."
          className="
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-zinc-900
            py-2
            pl-10
            pr-4
            text-white
            placeholder:text-zinc-500
            outline-none
            focus:border-blue-500
          "
        />
      </div>

      {/* Right Section */}
      <div className="ml-6 flex items-center gap-4">
        <button
          className="
            rounded-xl
            bg-zinc-900
            p-2
            transition
            hover:bg-zinc-800
          "
        >
          <Bell size={20} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
          N
        </div>
      </div>
    </header>
  );
}

export default Navbar;