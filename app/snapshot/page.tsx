'use client'
import { ExamPage } from '@/app/snapshot/exam'
import type { ExamObject, PapersObject } from '@/types/exam'
import JSZip from 'jszip'
import { type ChangeEvent, useState } from 'react'
import toast from 'react-hot-toast'

export default function LoadSnapshotPage() {
  const [examObject, setExamObject] = useState<ExamObject>()
  const [papersObject, setPapersObject] = useState<PapersObject>()

  async function UploadSnapshot(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length !== 1) {
      toast.error('你还没上传文件！')
      return false
    }
    let snapshotObject: { examObject: ExamObject; papersObject: PapersObject }
    if (e.target.files[0].type === 'application/json') {
      snapshotObject = JSON.parse(await e.target.files[0].text())
      if (!snapshotObject.papersObject || !snapshotObject.examObject) {
        toast.error(
          '你上传的文件中不存在papersObject/examObject，请检查是否上传正确！',
        )
        return false
      }
      setExamObject(snapshotObject.examObject)
      setPapersObject(snapshotObject.papersObject)
      return true
    }
    const zip = await JSZip.loadAsync(e.target.files[0])
    if (!zip.file('data.json')) {
      toast.error('你上传的压缩包不存在data.json文件，请检查是否上传正确！')
      return false
    }
    const dataFile = await (zip.file('data.json') as JSZip.JSZipObject).async(
      'string',
    )
    snapshotObject = JSON.parse(dataFile)
    if (!snapshotObject.papersObject || !snapshotObject.examObject) {
      toast.error(
        'data.json中不存在papersObject/examObject，请检查是否上传正确！',
      )
      return false
    }
    const imagesList = zip.folder('images')
    if (!imagesList) {
      toast.error('你上传的压缩包不存在images文件夹，请检查是否上传正确！')
      return false
    }
    imagesList.forEach((relativePath, file) => {
      // 其实没必要做这步判断
      if (relativePath.endsWith('.jpg')) {
        let [subjectName, index] = relativePath.split('_')
        index = index.slice(0, index.length - 4)
        Object.keys(snapshotObject.papersObject).forEach((item) => {
          if (snapshotObject.papersObject[item].name === subjectName) {
            if (!snapshotObject.papersObject[item].paperImages) {
              toast.error(
                `科目：${subjectName} 的答题卡图片字段不存在！跳过处理`,
              )
              return
            }
            file.async('base64').then((imageB64) => {
              imageB64 = `data:image/jpeg;base64,${imageB64}`
              ;(snapshotObject.papersObject[item].paperImages as string[])[
                Number(index)
              ] = imageB64
            })
          }
        })
      }
    })
    setPapersObject(snapshotObject.papersObject)
    setExamObject(snapshotObject.examObject)
    return true
  }

  if (!examObject || !papersObject) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white dark:bg-gray-900'>
        <label
          htmlFor='file-upload'
          className='flex h-12 w-80 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition duration-300 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-indigo-400 dark:hover:bg-gray-700'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='mr-2 h-5 w-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5'
            />
          </svg>
          上传你保存的快照文件（.zip / .json）
          <input
            id='file-upload'
            name='file'
            type='file'
            accept='application/zip,application/json'
            className='sr-only'
            onChange={(e) => {
              toast
                .promise(
                  UploadSnapshot(e).then((value) => {
                    if (!value) {
                      return Promise.reject()
                    }
                    return Promise.resolve()
                  }),
                  {
                    success: '解析完成！',
                    error: '解析失败！',
                    loading: '正在解析，请稍候~',
                  },
                )
                .then()
            }}
          />
        </label>
      </div>
    )
  }

  return (
    <ExamPage
      papersObject={papersObject}
      examObject={examObject}
    />
  )
}
