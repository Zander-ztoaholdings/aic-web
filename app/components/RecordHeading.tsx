/** A section heading inside a jurisdiction record. */
export function RecordHeading({ id, children, lede }: { id?: string; children: React.ReactNode; lede?: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2
        id={id}
        className="scroll-mt-28 text-xl md:text-[1.6rem] text-[#0f1f3d] font-bold leading-[1.2] tracking-[-0.01em]"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        {children}
      </h2>
      {lede && <p className="text-[#5e6b7b] leading-[1.65] mt-2 max-w-[62ch]">{lede}</p>}
    </div>
  );
}

