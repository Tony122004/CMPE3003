import { useContext, useEffect } from "react"
import { assets } from "../../assets/assets"
import { PanelStore } from "../../store/PanelStore"
import { ClinicianStore } from "../../store/ClinicianStore"

export default function Schedule() {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } =
    useContext(ClinicianStore)
  const { slotDateFormat, calculateAge, currency } = useContext(PanelStore)

  useEffect(() => {
    if (dToken) getAppointments()
  }, [dToken])

  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-3 font-display text-3xl">All appointments</p>

      <div className="max-h-[80vh] overflow-y-scroll border-2 border-ink bg-paper text-sm">
        <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 border-b-2 border-ink bg-moss px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-paper max-sm:hidden">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center gap-1 border-b border-ink/10 px-6 py-3 text-ink/80 hover:bg-[#F6E7D4] max-sm:flex max-sm:flex-wrap max-sm:justify-between max-sm:gap-5 max-sm:text-base"
            key={index}
          >
            <p className="max-sm:hidden">{index}</p>
            <div className="flex items-center gap-2">
              <img src={item.userData.image} className="h-8 w-8 object-cover" alt="" />{" "}
              <p>{item.userData.name}</p>
            </div>
            <div>
              <p className="inline border border-primary px-2 text-xs uppercase tracking-[0.08em]">
                {item.payment ? "Online" : "CASH"}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-moss">Completed</p>
            ) : (
              <div className="flex">
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
                <img
                  onClick={() => completeAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
