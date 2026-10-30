import { useContext, useEffect } from "react"
import { assets } from "../../assets/assets"
import { PanelStore } from "../../store/PanelStore"
import { StaffStore } from "../../store/StaffStore"

export default function BookingBoard() {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(StaffStore)
  const { slotDateFormat, calculateAge, currency } = useContext(PanelStore)

  useEffect(() => {
    if (aToken) getAllAppointments()
  }, [aToken])

  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-3 font-display text-3xl">All appointments</p>

      <div className="max-h-[80vh] overflow-y-scroll border-2 border-ink bg-paper text-sm">
        <div className="hidden border-b-2 border-ink bg-moss py-3 px-6 text-xs font-semibold uppercase tracking-[0.12em] text-paper sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap items-center justify-between border-b border-ink/10 px-6 py-3 text-ink/80 hover:bg-[#F6E7D4] max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img src={item.userData.image} className="h-8 w-8 object-cover" alt="" />{" "}
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img src={item.docData.image} className="h-8 w-8 bg-[#E7D3B5] object-cover" alt="" />{" "}
              <p>{item.docData.name}</p>
            </div>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-moss">Completed</p>
            ) : (
              <img
                onClick={() => cancelAppointment(item._id)}
                className="w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
