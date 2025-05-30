'use client'
import { useUserSnapshotQuery } from '@/hooks/queries'
import { useStorage } from '@/hooks/useStorage'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [token, setToken] = useStorage('hfs_token')
  const { data: userSnapshot } = useUserSnapshotQuery(token)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  // biome-ignore lint/suspicious/noExplicitAny: 懒得改
  const handleClickOutside = (event: { target: any }) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false)
    }
  }

  function handleLogout() {
    setToken(undefined)
    toast.success('已退出登录，返回登录页')
    router.push('/login')
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <nav
      data-html2canvas-ignore='true'
      className='flex items-center justify-between rounded-lg border border-gray-200 p-4 shadow-xs'
    >
      <Link href={'/'}>
        <img
          src={'/images/logo.png'}
          alt='Icon'
          className=' w-28'
        />
      </Link>
      <div
        className='relative'
        ref={dropdownRef}
      >
        <button
          onClick={toggleDropdown}
          className='flex items-center space-x-2 focus:outline-hidden'
        >
          <div
            className={
              'flex gap-1 font-black text-black hover:text-gray-900 dark:text-gray-200 dark:hover:text-white'
            }
          >
            {userSnapshot ? userSnapshot.linkedStudent.studentName : '？？？'}
            <div className='flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2.2}
                stroke='currentColor'
                className='size-[16px]'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3'
                />
              </svg>
            </div>
          </div>
        </button>
        {dropdownOpen && (
          <div className='absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg'>
            <Link
              className='block px-4 py-2 text-gray-800 hover:bg-gray-200'
              href={'/settings'}
            >
              设置
            </Link>
            <div
              className='block cursor-pointer px-4 py-2 text-gray-800 hover:bg-gray-200'
              onClick={handleLogout}
            >
              退出登录
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
