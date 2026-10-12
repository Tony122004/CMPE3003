import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div>
            <div className='flex flex-col gap-4 m-5'>
                <div>
                    <img className='w-full bg-moss sm:max-w-64' src={profileData.image} alt="" />
                </div>

                <div className='flex-1 border-2 border-ink bg-paper p-8 py-7'>

                    <p className='flex items-center gap-2 font-display text-3xl text-ink'>{profileData.name}</p>
                    <div className='mt-1 flex items-center gap-2 text-ink/70'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <span className='border border-ink px-2 py-0.5 text-xs uppercase tracking-[0.08em]'>{profileData.experience}</span>
                    </div>

                    <div>
                        <p className='mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink'>About</p>
                        <p className='mt-1 max-w-[700px] text-sm text-ink/70'>
                            {
                                isEdit
                                    ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} type='text' className='w-full border-2 border-ink/20 bg-paper p-2 outline-none focus:border-primary' rows={8} value={profileData.about} />
                                    : profileData.about
                            }
                        </p>
                    </div>

                    <p className='mt-4 font-medium text-ink/70'>
                        Appointment fee: <span className='text-ink'>{currency} {isEdit ? <input type='number' className='border-2 border-ink/20 bg-paper px-2' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} /> : profileData.fees}</span>
                    </p>

                    <div className='flex gap-2 py-2'>
                        <p>Address:</p>
                        <p className='text-sm'>
                            {isEdit ? <input type='text' className='border-2 border-ink/20 bg-paper px-2' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} /> : profileData.address.line1}
                            <br />
                            {isEdit ? <input type='text' className='border-2 border-ink/20 bg-paper px-2' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} /> : profileData.address.line2}
                        </p>
                    </div>

                    <div className='flex gap-1 pt-2'>
                        <input type="checkbox" onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} />
                        <label htmlFor="">Available</label>
                    </div>

                    {
                        isEdit
                            ? <button onClick={updateProfile} className='mt-5 border-2 border-primary px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary hover:bg-primary hover:text-paper'>Save</button>
                            : <button onClick={() => setIsEdit(prev => !prev)} className='mt-5 border-2 border-primary px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary hover:bg-primary hover:text-paper'>Edit</button>
                    }

                </div>
            </div>
        </div>
    )
}

export default DoctorProfile