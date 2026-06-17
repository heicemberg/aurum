interface SectionTagProps {
  children: React.ReactNode
}

/** Small pill badge used above section headings, mono font + status dot. */
export default function SectionTag({ children }: SectionTagProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(201,162,39,0.2)] bg-[rgba(201,162,39,0.04)] px-3.5 py-1.5 mb-5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
      <span className="font-mono text-[11px] text-[#C9A227] tracking-[0.14em] uppercase">
        {children}
      </span>
    </div>
  )
}
