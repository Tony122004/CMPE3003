import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { PanelStore } from "../../store/PanelStore"
import { ClinicianStore } from "../../store/ClinicianStore"

export default function ProfileEditor() {
  const { dToken, profileData, setProfileData, getProfileData } = useContext(ClinicianStore)
  const { currency, backendUrl } = useContext(PanelStore)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (dToken) getProfileData()
  }, [dToken])

  const persistProfile = async () => {
    try {
      const body = {
        address: profileData.address,
        fees: profileData.fees,
        about: profileData.about,
        available: profileData.available,
      }

      const { data } = await axios.put(`${backendUrl}/api/clinicians/me`, body, {
        headers: { dToken },
      })

      if (data.success) {
        toast.success(data.message)
        setEditing(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }

      setEditing(false)
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  const patchField = (updater) => setProfileData((prev) => updater(prev))

  if (!profileData) return null

  return (
    <div>
      <div className="flex flex-col gap-4 m-5">
        <div>
          <img className="w-full bg-moss sm:max-w-64" src={profileData.image} alt="" />
        </div>

        <div className="flex-1 border-2 border-ink bg-paper p-8 py-7">
          <p className="flex items-center gap-2 font-display text-3xl text-ink">{profileData.name}</p>
          <div className="mt-1 flex items-center gap-2 text-ink/70">
            <p>
              {profileData.degree} - {profileData.speciality}
            </p>
            <span className="border border-ink px-2 py-0.5 text-xs uppercase tracking-[0.08em]">
              {profileData.experience}
            </span>
          </div>

          <div>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink">About</p>
            <p className="mt-1 max-w-[700px] text-sm text-ink/70">
              {editing ? (
                <textarea
                  onChange={(e) => patchField((prev) => ({ ...prev, about: e.target.value }))}
                  className="w-full border-2 border-ink/20 bg-paper p-2 outline-none focus:border-primary"
                  rows={8}
                  value={profileData.about}
                />
              ) : (
                profileData.about
              )}
            </p>
          </div>

          <p className="mt-4 font-medium text-ink/70">
            Appointment fee:{" "}
            <span className="text-ink">
              {currency}{" "}
              {editing ? (
                <input
                  type="number"
                  className="border-2 border-ink/20 bg-paper px-2"
                  onChange={(e) => patchField((prev) => ({ ...prev, fees: e.target.value }))}
                  value={profileData.fees}
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>

          <div className="flex gap-2 py-2">
            <p>Address:</p>
            <p className="text-sm">
              {editing ? (
                <input
                  type="text"
                  className="border-2 border-ink/20 bg-paper px-2"
                  onChange={(e) =>
                    patchField((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={profileData.address.line1}
                />
              ) : (
                profileData.address.line1
              )}
              <br />
              {editing ? (
                <input
                  type="text"
                  className="border-2 border-ink/20 bg-paper px-2"
                  onChange={(e) =>
                    patchField((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={profileData.address.line2}
                />
              ) : (
                profileData.address.line2
              )}
            </p>
          </div>

          <div className="flex gap-1 pt-2">
            <input
              type="checkbox"
              onChange={() =>
                editing && patchField((prev) => ({ ...prev, available: !prev.available }))
              }
              checked={profileData.available}
            />
            <label htmlFor="">Available</label>
          </div>

          {editing ? (
            <button
              onClick={persistProfile}
              className="mt-5 border-2 border-primary px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary hover:bg-primary hover:text-paper"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditing((v) => !v)}
              className="mt-5 border-2 border-primary px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary hover:bg-primary hover:text-paper"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
