"use client"

import React, {useEffect, useRef, useState} from 'react';
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

const iconB64 = "data:image/png;base64,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"

export default function Navbar(props: {userName: string, router: AppRouterInstance}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleClickOutside = (event: { target: any; }) => {
        // @ts-ignore
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    function handleLogout(){
        localStorage.removeItem("hfs_token")
        alert("已退出登录，返回登录页")
        props.router.push("/")
    }

    function handleSettings() {
        props.router.push("/settings")
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="p-4 flex justify-between items-center rounded-lg shadow-sm border-gray-200 border">
            <div className="text-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconB64} alt="Icon" className="h-8 w-28"/>
            </div>
            <div className="relative" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="focus:outline-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {/*<img src="/path-to-your-avatar.png" alt="Avatar" className="h-8 w-8 rounded-full"/>*/}
                    <div className="font-black hover:text-amber-600">
                        {props.userName + " (点我!)"}
                    </div>
                </button>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                        <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                             onClick={handleLogout}>退出登录
                        </div>
                        <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                             onClick={handleSettings}>设置
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};