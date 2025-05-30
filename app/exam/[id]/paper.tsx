'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Gallery, Item } from 'react-photoswipe-gallery'
import { Card, CardContent, CardHeader } from '@/components/card'
import type { BasicPaperInfo, PaperRankInfo } from '@/types/exam'
import 'photoswipe/dist/photoswipe.css'
import { useStorage } from '@/hooks/useStorage'
import { usePaperImageUrlsQuery, useUserSnapshotQuery } from '@/hooks/queries'
import { useRouter } from 'next/navigation'

// 科目详情被隐藏时的样式
export function PaperHidingComponent(props: {
  paper: BasicPaperInfo
  changeDisplayMode: (paperId: string) => void
}) {
  return (
    <Card>
      <CardHeader
        onClick={() => {
          props.changeDisplayMode(props.paper.paperId)
        }}
        className='cursor-pointer select-none'
      >
        <div className='flex w-full items-center justify-between'>
          <div>{props.paper.name}</div>
          <div className='flex items-center gap-2'>
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
                d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'
              />
            </svg>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

// 科目详情展示时的样式
export function PaperShowingComponent({
  paper,
  changeDisplayMode,
  examId,
}: {
  paper: BasicPaperInfo
  changeDisplayMode: (paperId: string) => void
  examId: number
}) {
  // TODO: 实施 rank 数据获取
  const [paperRankInfo, setPaperRankInfo] = useState<PaperRankInfo>()
  const [token] = useStorage('hfs_token')
  const router = useRouter()
  const { data: paperImageUrls } = usePaperImageUrlsQuery(
    token,
    examId,
    paper.paperId,
    paper.pid,
  )
  const { data: userSnapshot } = useUserSnapshotQuery(token)
  const advancedMode = userSnapshot?.isMember ?? false

  if (!token) {
    toast.error('请先登录')
    router.push('/login')
    return null
  }

  return (
    <Card>
      <CardHeader
        onClick={() => {
          changeDisplayMode(paper.paperId)
        }}
        className='cursor-pointer select-none'
      >
        <div className='flex w-full items-center justify-between'>
          <div>{paper.name}</div>
          <div className='flex items-center gap-2'>
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
                d='M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3'
              />
            </svg>
          </div>
        </div>
      </CardHeader>
      <CardContent className='grid select-none gap-4 px-4 pb-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='text-gray-500 text-sm dark:text-gray-400'>满分</div>
            <div className='font-medium'>{paper.manfen}</div>
          </div>
          <div>
            <div className='text-gray-500 text-sm dark:text-gray-400'>得分</div>
            <div className='font-medium'>{paper.score}</div>
          </div>
        </div>
        {advancedMode && (
          <>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-gray-500 text-sm dark:text-gray-400'>
                  班级排名/等第
                </div>
                <div className='font-medium'>
                  {paperRankInfo
                    ? advancedMode
                      ? `${paperRankInfo.rank.class} (打败了全班${paperRankInfo.defeatRatio.class}%的人)`
                      : paperRankInfo.rankPart.class
                    : '...'}
                </div>
              </div>
              <div>
                <div className='text-gray-500 text-sm dark:text-gray-400'>
                  年级排名/等第
                </div>
                <div className='font-medium'>
                  {paperRankInfo
                    ? advancedMode
                      ? `${paperRankInfo.rank.grade} (打败了全年级${paperRankInfo.defeatRatio.grade}%的人)`
                      : paperRankInfo.rankPart.grade
                    : '...'}
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-gray-500 text-sm dark:text-gray-400'>
                  班级最高分
                </div>
                <div className='font-medium'>
                  {paperRankInfo
                    ? advancedMode
                      ? paperRankInfo.highest.class
                      : '根据要求，该数据不允许展示'
                    : '...'}
                </div>
              </div>
              <div>
                <div className='text-gray-500 text-sm dark:text-gray-400'>
                  年级最高分
                </div>
                <div className='font-medium'>
                  {paperRankInfo
                    ? advancedMode
                      ? paperRankInfo.highest.grade
                      : '根据要求，该数据不允许展示'
                    : '...'}
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-gray-500 text-sm dark:text-gray-400'>
                  班级平均分
                </div>
                <div className='font-medium'>
                  {paperRankInfo
                    ? advancedMode
                      ? paperRankInfo.avg.class
                      : '根据要求，该数据不允许展示'
                    : '...'}
                </div>
              </div>
              <div>
                <div className='text-gray-500 text-sm dark:text-gray-400'>
                  年级平均分
                </div>
                <div className='font-medium'>
                  {paperRankInfo
                    ? advancedMode
                      ? paperRankInfo.avg.grade
                      : '根据要求，该数据不允许展示'
                    : '...'}
                </div>
              </div>
            </div>
          </>
        )}
        <Gallery
          withCaption
          withDownloadButton
        >
          <div
            data-html2canvas-ignore='true'
            className='grid grid-flow-col gap-4'
          >
            {paperImageUrls?.map((url, index) => {
              return (
                <Item
                  original={url}
                  width='1024'
                  height='768'
                  key={url}
                  caption={`${paper.name} 第${index + 1}张`}
                >
                  {({ ref, open }) => (
                    <img
                      ref={ref}
                      onClick={open}
                      className='cursor-pointer rounded-lg object-cover'
                      src={url}
                      alt={`${paper.name}_${index}`}
                      width={300}
                      style={{
                        aspectRatio: '300/200',
                        objectFit: 'cover',
                      }}
                      height={200}
                    />
                  )}
                </Item>
              )
            })}
          </div>
        </Gallery>
      </CardContent>
    </Card>
  )
}
