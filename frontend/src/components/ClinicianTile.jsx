export default function ClinicianTile({ doctor, onClick }) {
  const statusLabel = doctor.available ? 'Open for booking' : 'Unavailable'
  const statusClass = doctor.available ? 'text-moss' : 'text-ink/40'

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full gap-4 border-2 border-ink bg-paper p-3 text-left transition hover:bg-[#F6E7D4]"
    >
      <div className="h-28 w-24 shrink-0 overflow-hidden bg-[#E7D3B5]">
        <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover object-top" />
      </div>
      <div className="flex flex-col justify-center">
        <span className={`text-xs font-semibold uppercase tracking-[0.14em] ${statusClass}`}>{statusLabel}</span>
        <p className="mt-1 font-display text-xl text-ink">{doctor.name}</p>
        <p className="text-sm text-ink/60">{doctor.speciality}</p>
      </div>
    </button>
  )
}
