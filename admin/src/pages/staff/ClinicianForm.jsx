import axios from "axios"
import { useContext, useState } from "react"
import { toast } from "react-toastify"
import { assets } from "../../assets/assets"
import { PanelStore } from "../../store/PanelStore"
import { StaffStore } from "../../store/StaffStore"

const EXPERIENCE_OPTS = [
  { value: "1 Year", label: "1 Year" },
  { value: "2 Year", label: "2 Years" },
  { value: "3 Year", label: "3 Years" },
  { value: "4 Year", label: "4 Years" },
  { value: "5 Year", label: "5 Years" },
  { value: "6 Year", label: "6 Years" },
  { value: "8 Year", label: "8 Years" },
  { value: "9 Year", label: "9 Years" },
  { value: "10 Year", label: "10 Years" },
]

const SPECIALTY_OPTS = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
]

function Field({ label, children }) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <p>{label}</p>
      {children}
    </div>
  )
}

const inputCls =
  "border-2 border-ink/20 bg-paper px-3 py-2 outline-none focus:border-primary"

export default function ClinicianForm() {
  const [photoFile, setPhotoFile] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [experience, setExperience] = useState("1 Year")
  const [fees, setFees] = useState("")
  const [about, setAbout] = useState("")
  const [speciality, setSpeciality] = useState("General physician")
  const [degree, setDegree] = useState("")
  const [address1, setAddress1] = useState("")
  const [address2, setAddress2] = useState("")

  const { backendUrl } = useContext(PanelStore)
  const { aToken } = useContext(StaffStore)

  const resetForm = () => {
    setPhotoFile(false)
    setName("")
    setPassword("")
    setEmail("")
    setAddress1("")
    setAddress2("")
    setDegree("")
    setAbout("")
    setFees("")
  }

  const submitClinician = async (event) => {
    event.preventDefault()

    try {
      if (!photoFile) {
        return toast.error("Image Not Selected")
      }

      const payload = new FormData()
      payload.append("image", photoFile)
      payload.append("name", name)
      payload.append("email", email)
      payload.append("password", password)
      payload.append("experience", experience)
      payload.append("fees", Number(fees))
      payload.append("about", about)
      payload.append("speciality", speciality)
      payload.append("degree", degree)
      payload.append("address", JSON.stringify({ line1: address1, line2: address2 }))

      payload.forEach((value, key) => {
        console.log(`${key}: ${value}`)
      })

      const { data } = await axios.post(`${backendUrl}/api/staff/clinicians`, payload, {
        headers: { aToken },
      })

      if (data.success) {
        toast.success(data.message)
        resetForm()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  const previewSrc = photoFile ? URL.createObjectURL(photoFile) : assets.upload_area

  return (
    <form onSubmit={submitClinician} className="m-5 w-full">
      <p className="mb-3 font-display text-3xl">Add doctor</p>

      <div className="max-h-[80vh] w-full max-w-4xl overflow-y-scroll border-2 border-ink bg-paper px-8 py-8">
        <div className="mb-8 flex items-center gap-4 text-ink/70">
          <label htmlFor="clinician-photo">
            <img
              className="h-16 w-16 cursor-pointer bg-[#E7D3B5] object-cover"
              src={previewSrc}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setPhotoFile(e.target.files[0])}
            type="file"
            id="clinician-photo"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col items-start gap-10 text-ink lg:flex-row">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <Field label="Your name">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={inputCls}
                type="text"
                placeholder="Name"
                required
              />
            </Field>
            <Field label="Doctor Email">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className={inputCls}
                type="email"
                placeholder="Email"
                required
              />
            </Field>
            <Field label="Set Password">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className={inputCls}
                type="password"
                placeholder="Password"
                required
              />
            </Field>
            <Field label="Experience">
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border-2 border-ink/20 bg-paper px-2 py-2 outline-none focus:border-primary"
              >
                {EXPERIENCE_OPTS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fees">
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className={inputCls}
                type="number"
                placeholder="Doctor fees"
                required
              />
            </Field>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <Field label="Speciality">
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border-2 border-ink/20 bg-paper px-2 py-2 outline-none focus:border-primary"
              >
                {SPECIALTY_OPTS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Degree">
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className={inputCls}
                type="text"
                placeholder="Degree"
                required
              />
            </Field>
            <Field label="Address">
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className={inputCls}
                type="text"
                placeholder="Address 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className={inputCls}
                type="text"
                placeholder="Address 2"
                required
              />
            </Field>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full border-2 border-ink/20 bg-paper px-4 pt-2 outline-none focus:border-primary"
            rows={5}
            placeholder="write about doctor"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-paper"
        >
          Add doctor
        </button>
      </div>
    </form>
  )
}
