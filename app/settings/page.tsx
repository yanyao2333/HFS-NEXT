'use client'

import { useEffect, useState } from 'react'

export default function SwitchAdvancedMode() {
  const [advancedMode, setAdvancedMode] = useState<boolean>(false)

  useEffect(() => {
    const nowAdvancedMode = localStorage.getItem('advancedMode')
    if (0 === Number(nowAdvancedMode)) {
      setAdvancedMode(false)
    } else {
      setAdvancedMode(true)
    }
  }, [])

  function handleSwitchCheckbox(enabled: boolean) {
    localStorage.setItem('advancedMode', enabled ? '1' : '0')
    setAdvancedMode(enabled)
  }

  return (
    <div className='bg-white dark:bg-gray-900'>
      <p className='font-bold text-xl'>AdvancedMode（已废弃）</p>
      <p className='font-bold text-xl'>
        <span className='text-red-500'>
          注意：当前AdvancedMode已废弃，排名展示功能在登录账号是会员时自动启用。
        </span>
        当前AdvancedMode状态为：
        {advancedMode ? (
          <span className='text-green-500'>已开启</span>
        ) : (
          <span className='text-red-500'>未开启</span>
        )}
      </p>
      <br />
      <input
        className='h-5 w-5'
        type='checkbox'
        id='advancedMode'
        onChange={(e) => handleSwitchCheckbox(e.target.checked)}
        checked={advancedMode}
      />
      <label
        htmlFor='advancedMode'
        className='h-5 w-5'
      >
        AdvancedMode开关
      </label>
    </div>
  )
}
