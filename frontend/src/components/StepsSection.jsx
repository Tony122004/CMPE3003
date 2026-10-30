const flowSteps = [
  { step: '01', title: 'Choose a speciality', text: 'Start with the kind of care you need, from general practice to neurology.' },
  { step: '02', title: 'Pick a time', text: 'Open a doctor’s profile and reserve an open slot that fits your day.' },
  { step: '03', title: 'Confirm and pay', text: 'Review the visit in My Appointments and pay online with Stripe.' },
]

export default function StepsSection() {
  return (
    <section className="mt-8 grid gap-0 border-2 border-ink bg-paper md:grid-cols-3">
      {flowSteps.map((entry, idx) => (
        <article
          key={entry.step}
          className={`border-b-2 border-ink p-6 md:border-b-0 md:border-r-2 ${idx === flowSteps.length - 1 ? 'md:border-r-0' : ''} ${idx === flowSteps.length - 1 ? 'last:border-b-0' : ''}`}
        >
          <p className="font-display text-3xl text-primary">{entry.step}</p>
          <h3 className="mt-3 text-2xl text-ink">{entry.title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/70">{entry.text}</p>
        </article>
      ))}
    </section>
  )
}
