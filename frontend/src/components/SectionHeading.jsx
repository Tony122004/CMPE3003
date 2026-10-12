const SectionHeading = ({ eyebrow, title, text }) => {
  return (
    <div className="max-w-xl border-l-4 border-primary pl-5">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>}
      {title && <h2 className="mt-2 text-3xl text-ink sm:text-4xl">{title}</h2>}
      {text && <p className="mt-3 text-sm leading-6 text-ink/70">{text}</p>}
    </div>
  )
}

export default SectionHeading
