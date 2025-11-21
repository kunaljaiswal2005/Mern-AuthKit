import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContent = createContext()

axios.defaults.withCredentials = true

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setisLoggedin] = useState(false)
    const [userData, setUserData] = useState(null)

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data')

            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`)

            if (data.success) {
                setisLoggedin(true)
                await getUserData()
            } else {
                setisLoggedin(false)
                setUserData(null)
            }

        } catch (error) {
            console.warn("Auth check failed:", error.message)
            setisLoggedin(false)
            setUserData(null)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getAuthState()
    }, [])

    const value = {
        backendUrl,
        isLoggedin,
        setisLoggedin,
        userData,
        setUserData,
        getUserData,
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}
