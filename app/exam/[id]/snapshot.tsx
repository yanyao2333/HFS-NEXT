import type { ExamObject, PapersObject } from '@/types/exam'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Snapshot({
  onClose,
  examObject,
  papersObject,
}: {
  onClose: any
  examObject: ExamObject | undefined
  papersObject: PapersObject | undefined
}) {
  const [downloadImage, setDownloadImage] = useState(true)

  async function handleSaveSnapshot() {
    if (!examObject) {
      toast.error('界面还没加载好，等等再试吧~')
      return
    }
    if (
      examObject?.detail?.papers.length !==
      Object.keys(papersObject ? papersObject : {}).length
    ) {
      toast.error('你确定已经把所有科目详情都点开并加载好了？')
      return
    }
    const outputJson = JSON.stringify(
      {
        examObject: examObject,
        papersObject: papersObject,
      },
      null,
      2,
    )
    if (!downloadImage) {
      saveAs(
        new Blob([outputJson], { type: 'application/json' }),
        `snapshot_simple_exam${examObject.detail?.examId}_${Date.now()}.json`,
      )
      return true
    }
    const zip = new JSZip()
    zip.file('data.json', outputJson)
    const imageFolder = zip.folder('images')
    // 这么写不好，但我不想再遍历papersObject了
    const imageElements = Array.from(
      document.querySelectorAll('img.rounded-lg.object-cover'),
    ) as HTMLImageElement[]
    const wrappedUrls = imageElements.map((item) => {
      return fetch(`${process.env.URL}/api/cors/img?url=${item.src}`)
    })
    const result = await Promise.allSettled(wrappedUrls)
    const images = []
    for (const item of result) {
      if (item.status === 'rejected') {
        toast.error('图片下载失败，稍后再试试吧！')
        return
      }
      images.push(await item.value.blob())
    }
    for (let i = 0; i < imageElements.length; i++) {
      imageFolder?.file(`${imageElements[i].alt}.jpg`, images[i])
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(
        content,
        `snapshot_exam${examObject.detail?.examId}_${Date.now()}.zip`,
      )
    })
    return true
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-500 bg-opacity-75'>
      <div className='mx-auto max-w-64 rounded-lg bg-white p-4 shadow-lg lg:min-w-96 lg:max-w-lg dark:bg-gray-800'>
        <div className='mb-4 flex items-center justify-between border-b pb-2'>
          <h2 className='font-semibold text-gray-800 text-xl dark:text-gray-200'>
            创建试卷快照
          </h2>
          <button
            onClick={onClose}
            className='text-gray-600 dark:text-gray-400'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18 18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
        <div>
          <div>
            <p className='mb-4 text-gray-700 dark:text-gray-300'>
              好分数非会员用户只能查看120天内的试卷，可以用该功能保存该次考试从api获取的所有原始数据，以备不时之需
              <br />
              <br />
              <input
                className='h-3.5 w-3.5'
                type='checkbox'
                id='downloadImage'
                onChange={(e) => {
                  setDownloadImage(e.target.checked)
                }}
                checked={downloadImage}
              />
              <label
                htmlFor='downloadImage'
                className='h-5 w-5 pl-1'
              >
                下载答题卡图片（可能会比较慢）
              </label>
              <br />
              <br />
              <span
                style={{ color: 'red' }}
                className='text-xl'
              >
                请务必先点开下方所有科目的详情并等待加载完成！
              </span>
            </p>
            <div className='flex justify-center gap-8'>
              <button
                onClick={onClose}
                className='rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 hover:dark:bg-gray-500'
              >
                我不要
              </button>
              <button
                onClick={() => {
                  toast.promise(
                    handleSaveSnapshot().then((value) => {
                      if (!value) {
                        return Promise.reject()
                      }
                      return Promise.resolve()
                    }),
                    {
                      loading: downloadImage
                        ? '正在打包（由于要下载图片，速度可能比较慢）'
                        : '正在打包',
                      error: '发生错误！稍后再试试吧！',
                      success: '打包成功！正在下载~',
                    },
                  )
                }}
                className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
              >
                启动！
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
