import { useEffect, useState } from 'react'

/**
 * 在 localStorage 中存储和获取值。
 * @param key - 存储的键名。
 * @param initialValue - 初始值，如果 localStorage 中没有对应的键，则使用此值。
 */
export const useStorage = (key: string, initialValue?: string) => {
  const [storedValue, setStoredValue] = useState<string | undefined>(() => {
    try {
      const item = localStorage.getItem(key)
      if (item !== null) {
        return item
      }
    } catch (error) {
      console.warn(`在初始化期间读取 localStorage 键 "${key}" 时出错:`, error)
    }
    return initialValue
  })

  useEffect(() => {
    try {
      if (storedValue === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, storedValue)
      }
    } catch (error) {
      console.warn(`更新 localStorage 键 "${key}" 时出错:`, error)
    }
  }, [key, storedValue])

  // biome-ignore lint/correctness/useExhaustiveDependencies: 循环依赖项
  useEffect(() => {
    let newValue: string | undefined
    try {
      const item = localStorage.getItem(key)
      if (item !== null) {
        newValue = item
      } else {
        newValue = initialValue
      }
    } catch (error) {
      console.warn(`因 key 更改而读取 localStorage 键 "${key}" 时出错:`, error)
      newValue = initialValue
    }

    if (newValue !== storedValue) {
      setStoredValue(newValue)
    }
  }, [key, initialValue])

  return [storedValue, setStoredValue] as const
}
