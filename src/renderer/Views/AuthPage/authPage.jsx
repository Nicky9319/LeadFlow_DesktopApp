import React, { useState } from 'react';
import { shell } from 'electron';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBA0pW7EbTPEn9u03TmVQn4gJwn_wSdktg",
  authDomain: "agentbed.firebaseapp.com",
  projectId: "agentbed",
  storageBucket: "agentbed.firebasestorage.app",
  messagingSenderId: "77508203192",
  appId: "1:77508203192:web:9a7c4816ce2366d0251a4d",
  measurementId: "G-MT01DF6SE7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const AuthPage = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    const handleGoogleSignIn = () => {
        console.log('Opening external browser for Google Auth...');
        shell.openExternal('https://your-google-auth-url.com?redirect=myapp://auth-callback');
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-[#121317] overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0 w-full h-full max-w-[1440px] max-h-[1240px]">
                {/* Image Section - wider now (3/5) */}
                <div className="hidden md:block relative col-span-3 bg-[#1D1F24]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/80 to-[#0EA5E9]/80 z-10"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1568952433726-3896e3881c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                        alt="Authentication" 
                        className="object-cover h-full w-full"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-[#F9FAFB] p-12 backdrop-blur-sm z-20">
                        <div className="p-8 bg-[#1D1F24]/40 rounded-2xl backdrop-blur-md border border-[#F9FAFB]/10 mb-6">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/6295/6295417.png" 
                                alt="AgentBed Logo" 
                                className="w-28 h-28 drop-shadow-lg"
                            />
                        </div>
                        <h2 className="text-5xl font-bold mb-4 text-[#F9FAFB]">AgentBed</h2>
                        <p className="text-center text-xl font-light text-[#F9FAFB]/90 max-w-md">
                            Your ultimate platform for managing intelligent agents
                        </p>
                    </div>
                </div>
                
                {/* Auth Form Section - narrower now (2/5) */}
                <div className="col-span-5 md:col-span-2 flex flex-col justify-center items-center bg-[#1D1F24] p-12 md:p-24">
                    <div className="w-full max-w-md">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-bold text-[#F9FAFB]">
                                {isSignIn ? 'Welcome Back' : 'Create Account'}
                            </h1>
                            <p className="text-[#9CA3AF] mt-3 text-lg">
                                {isSignIn ? 'Sign in to continue to AgentBed' : 'Join the AgentBed community today'}
                            </p>
                        </div>
                        
                        {/* Google Sign In Button */}
                        <button
                            className="w-full flex items-center justify-center gap-4 bg-white hover:bg-gray-100 rounded-xl py-5 px-6 text-gray-700 hover:shadow-xl mb-8 transition-all duration-300 shadow-md font-medium text-lg"
                            onClick={handleGoogleSignIn}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="28px" height="28px">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                            </svg>
                            {isSignIn ? 'Sign in with Google' : 'Sign up with Google'}
                        </button>
                        
                        {/* Toggle between sign in and sign up */}
                        <div className="text-center mt-14">
                            <p className="text-[#9CA3AF] text-lg">
                                {isSignIn ? "Don't have an account?" : "Already have an account?"}
                                <button 
                                    onClick={() => setIsSignIn(!isSignIn)}
                                    className="ml-2 text-[#0EA5E9] hover:text-[#0EA5E9]/80 font-medium transition-colors text-lg"
                                >
                                    {isSignIn ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;