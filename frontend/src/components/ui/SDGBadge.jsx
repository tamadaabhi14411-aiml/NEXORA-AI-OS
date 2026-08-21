import { SDG_LIST } from "../../data/sdgData";

export default function SDGBadge({ sdgId, size = "md", showLabel = true }) {
  const sdg = SDG_LIST.find((s) => s.id === Number(sdgId));

  if (!sdg) {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
        SDG #{sdgId}
      </span>
    );
  }

  if (size === "sm") {
    return (
      <span
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
        style={{ backgroundColor: sdg.color }}
        title={`SDG ${sdg.number}: ${sdg.title}`}
      >
        <span>SDG {sdg.number}</span>
        {showLabel && <span className="truncate max-w-[90px] font-normal">{sdg.title}</span>}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-white shadow-sm transition-transform hover:scale-105"
      style={{ backgroundColor: sdg.color }}
      title={`SDG ${sdg.number}: ${sdg.title}`}
    >
      <span className="font-extrabold bg-black/20 px-1 rounded text-[10px]">SDG {sdg.number}</span>
      {showLabel && <span>{sdg.title}</span>}
    </span>
  );
}
