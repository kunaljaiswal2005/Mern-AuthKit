import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from './../context/AppContext';
const Header = () => {

    const { userData } = useContext(AppContent)

    return (
        <div class='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>

            <img src={assets.header_img} class='w-36 h-36 rounded-full mb-6' />
            <h1 class=' flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
                Hey {userData ? userData.name : 'Developer'}!
                <img src={assets.hand_wave} alt="" class='w-8 aspect-square' />
            </h1>
            <h3 class=' text-3xl sm:text-5xl font-semibold mb-4'>
                Welcome to our app
            </h3>
            <p class=' mb-8 max-w-md'>
                Lets start with a quick product tour and we will have you up and running in no time
            </p>
            <button class=' border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>
                Get Started
            </button>
        </div>
    )
}

export default Header