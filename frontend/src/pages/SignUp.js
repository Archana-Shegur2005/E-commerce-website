import React, { useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)
    const [data,setData] = useState({
        email : "",
        password : "",
        name : "",
        confirmPassword : "",
        profilePic : "",
    })
    const navigate = useNavigate()
    
    const handleOnChange = (e) =>{
        const { name , value } = e.target
  
        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }
    
    const handleUploadPic = async(e) =>{
        const file = e.target.files[0]
        
        const imagePic = await imageTobase64(file)
        
        setData((preve)=>{
          return{
            ...preve,
            profilePic : imagePic
          }
        })
    }
    
    const handleSubmit = async(e) =>{
        e.preventDefault()
        
        if(data.password !== data.confirmPassword){
            toast.error("Please check password and confirm password")
            return
        }

        try {
            const dataResponse = await fetch(SummaryApi.signUP.url,{
                method : SummaryApi.signUP.method,
                headers : {
                    "content-type" : "application/json"
                },
                body : JSON.stringify(data)
            })
        
            const dataApi = await dataResponse.json()
            console.log('Signup response:', dataApi)
            
            if(dataApi.success){
                toast.success(dataApi.message)
                
                // ✅ AUTO-LOGIN AFTER SUCCESSFUL SIGNUP
                try {
                    // Automatically login with the credentials
                    const loginResponse = await fetch(SummaryApi.signIn.url, {
                        method: SummaryApi.signIn.method,
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({
                            email: data.email,
                            password: data.password
                        }),
                        credentials: 'include'
                    })
                    
                    const loginData = await loginResponse.json()
                    console.log('Auto-login response:', loginData)
                    
                    if(loginData.success && loginData.data){
                        // Store the token
                        localStorage.setItem('token', loginData.data)
                        toast.success('Auto-login successful!')
                        
                        // Navigate to home and force refresh
                        navigate('/')
                        setTimeout(() => {
                            window.location.reload() // Force state update
                        }, 500)
                    } else {
                        // If auto-login fails, redirect to login page
                        toast.info('Account created! Please login')
                        navigate("/login")
                    }
                    
                } catch (loginError) {
                    console.error('Auto-login failed:', loginError)
                    toast.info('Account created! Please login')
                    navigate("/login")
                }
                
            } else {
                if(dataApi.error){
                    toast.error(dataApi.message)
                }
            }
        
        } catch (error) {
            console.error('Signup error:', error)
            toast.error('Signup failed. Please try again.')
        }
    }
    
    console.log("data signup", data)
    
  return (
    <section id='signup'>
        <div className='mx-auto container p-4'>
            <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                    <div>
                        <img src={data.profilePic || loginIcons} alt='profile icon'/>
                    </div>
                    <form>
                        <label>
                            <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                                Upload Photo
                            </div>
                            <input type='file' className='hidden' onChange={handleUploadPic}/>
                        </label>
                    </form>
                </div>

                <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                    <div className='grid'>
                        <label>Name : </label>
                        <div className='bg-slate-100 p-2'>
                            <input 
                                type='text' 
                                placeholder='enter your name' 
                                name='name'
                                value={data.name}
                                onChange={handleOnChange}
                                required
                                className='w-full h-full outline-none bg-transparent'/>
                        </div>
                    </div>
                    
                    <div className='grid'>
                        <label>Email : </label>
                        <div className='bg-slate-100 p-2'>
                            <input 
                                type='email' 
                                placeholder='enter email' 
                                name='email'
                                value={data.email}
                                onChange={handleOnChange}
                                required
                                className='w-full h-full outline-none bg-transparent'/>
                        </div>
                    </div>

                    <div>
                        <label>Password : </label>
                        <div className='bg-slate-100 p-2 flex'>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder='enter password'
                                value={data.password}
                                name='password' 
                                onChange={handleOnChange}
                                required
                                className='w-full h-full outline-none bg-transparent'/>
                            <div className='cursor-pointer text-xl' onClick={()=>setShowPassword((preve)=>!preve)}>
                                <span>
                                    {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label>Confirm Password : </label>
                        <div className='bg-slate-100 p-2 flex'>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder='enter confirm password'
                                value={data.confirmPassword}
                                name='confirmPassword' 
                                onChange={handleOnChange} 
                                required
                                className='w-full h-full outline-none bg-transparent'/>
                            <div className='cursor-pointer text-xl' onClick={()=>setShowConfirmPassword((preve)=>!preve)}>
                                <span>
                                    {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button 
                        type='submit'
                        className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>
                        Sign Up
                    </button>
                </form>

                <p className='my-5'>
                    Already have account ? 
                    <Link to={"/login"} className=' text-red-600 hover:text-red-700 hover:underline'> Login</Link>
                </p>
            </div>
        </div>
    </section>
  )
}

export default SignUp
