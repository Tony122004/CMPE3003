import { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)
  const [saving, setSaving] = useState(false)

  const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

  const updateUserProfileData = async () => {
    try {
      setSaving(true)
      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address || { line1: '', line2: '' }))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      image && formData.append('image', image)

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (!token) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-semibold text-ink">Log in to view your profile.</p>
        <Link to="/login" className="btn-primary mt-6">Go to login</Link>
      </div>
    )
  }

  if (!userData) {
    return <p className="py-24 text-center text-sm text-slate-500">Loading profile…</p>
  }

  const address = userData.address || { line1: '', line2: '' }

  return (
    <div className="mx-auto max-w-3xl pt-8">
      <div className="overflow-hidden border-2 border-ink bg-paper">
        <div className="bg-moss px-6 py-8 text-paper sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Account</p>
          <h1 className="mt-2 text-3xl font-semibold">My profile</h1>
        </div>

        <div className="grid gap-8 p-6 sm:grid-cols-[180px_1fr] sm:p-8">
          <div>
            {isEdit ? (
              <label htmlFor="image" className="relative block cursor-pointer">
                <img className="h-40 w-40 border-2 border-ink object-cover" src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                {!image && <img className="absolute bottom-3 right-3 w-8" src={assets.upload_icon} alt="" />}
                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
              </label>
            ) : (
              <img className="h-40 w-40 border-2 border-ink object-cover" src={userData.image} alt="" />
            )}
          </div>

          <div className="space-y-6">
            <label className="block text-sm font-medium text-ink">
              Name
              {isEdit ? (
                <input className="field mt-1.5" type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
              ) : (
                <p className="mt-1 text-xl font-semibold text-ink">{userData.name}</p>
              )}
            </label>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Contact</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-sm font-medium text-ink">{userData.email}</p>
                </div>
                <label className="text-xs text-slate-400">
                  Phone
                  {isEdit ? (
                    <input className="field mt-1" type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone || ''} />
                  ) : (
                    <p className="mt-1 text-sm font-medium text-ink">{userData.phone || 'Not added'}</p>
                  )}
                </label>
                <label className="text-xs text-slate-400 sm:col-span-2">
                  Address
                  {isEdit ? (
                    <div className="mt-1 space-y-2">
                      <input className="field" type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...(prev.address || {}), line1: e.target.value } }))} value={address.line1} placeholder="Line 1" />
                      <input className="field" type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...(prev.address || {}), line2: e.target.value } }))} value={address.line2} placeholder="Line 2" />
                    </div>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-ink">{address.line1 || 'Not added'}{address.line2 ? `, ${address.line2}` : ''}</p>
                  )}
                </label>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Basic information</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-slate-400">
                  Gender
                  {isEdit ? (
                    <select className="field mt-1" onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender || 'Not Selected'}>
                      <option value="Not Selected">Not Selected</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-ink">{userData.gender || 'Not selected'}</p>
                  )}
                </label>
                <label className="text-xs text-slate-400">
                  Birthday
                  {isEdit ? (
                    <input className="field mt-1" type="date" onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob || ''} />
                  ) : (
                    <p className="mt-1 text-sm font-medium text-ink">{userData.dob || 'Not added'}</p>
                  )}
                </label>
              </div>
            </div>

            <div>
              {isEdit ? (
                <div className="flex gap-3">
                  <button type="button" onClick={updateUserProfileData} disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save information'}</button>
                  <button type="button" onClick={() => { setIsEdit(false); setImage(false); loadUserProfileData() }} className="btn-outline">Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsEdit(true)} className="btn-primary">Edit profile</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
