import { useContext, useEffect } from "react"
import { StaffStore } from "../../store/StaffStore"

export default function ClinicianRoster() {
  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(StaffStore)

  useEffect(() => {
    if (aToken) getAllDoctors()
  }, [aToken])

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="font-display text-3xl">All doctors</h1>
      <div className="flex w-full flex-wrap gap-4 gap-y-6 pt-5">
        {doctors.map((item, index) => (
          <div className="group max-w-56 overflow-hidden border-2 border-ink bg-paper" key={index}>
            <img
              className="bg-[#E7D3B5] transition-all duration-500 group-hover:bg-moss"
              src={item.image}
              alt=""
            />
            <div className="p-4">
              <p className="font-display text-xl text-ink">{item.name}</p>
              <p className="text-sm text-ink/60">{item.speciality}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
