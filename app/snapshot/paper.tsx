'use client'

import { Card, CardContent, CardHeader } from '@/components/card'
import type { Paper } from '@/types/exam'
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'

// 科目详情被隐藏时的样式
export function PaperHidingComponent(props: {
  paper: Paper
  changeDisplayMode: Function
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
}: {
  paper: Paper
  changeDisplayMode: Function
}) {
  const advancedMode = true

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
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='text-gray-500 text-sm dark:text-gray-400'>
              班级排名/等第
            </div>
            <div className='font-medium'>
              {advancedMode
                ? `${paper.rank?.rank.class} (打败了全班${paper.rank?.defeatRatio.class}%的人)`
                : paper.rank?.rankPart.class}
            </div>
          </div>
          <div>
            <div className='text-gray-500 text-sm dark:text-gray-400'>
              年级排名/等第
            </div>
            <div className='font-medium'>
              {advancedMode
                ? `${paper.rank?.rank.grade} (打败了全年级${paper.rank?.defeatRatio.grade}%的人)`
                : paper.rank?.rankPart.grade}
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='text-gray-500 text-sm dark:text-gray-400'>
              班级最高分
            </div>
            <div className='font-medium'>
              {advancedMode
                ? paper.rank?.highest.class
                : '根据要求，该数据不允许展示'}
            </div>
          </div>
          <div>
            <div className='text-gray-500 text-sm dark:text-gray-400'>
              年级最高分
            </div>
            <div className='font-medium'>
              {advancedMode
                ? paper.rank?.highest.grade
                : '根据要求，该数据不允许展示'}
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='text-gray-500 text-sm dark:text-gray-400'>
              班级平均分
            </div>
            <div className='font-medium'>
              {advancedMode
                ? paper.rank?.avg.class
                : '根据要求，该数据不允许展示'}
            </div>
          </div>
          <div>
            <div className='text-gray-500 text-sm dark:text-gray-400'>
              年级平均分
            </div>
            <div className='font-medium'>
              {advancedMode
                ? paper.rank?.avg.grade
                : '根据要求，该数据不允许展示'}
            </div>
          </div>
        </div>
        <Gallery
          withCaption
          withDownloadButton
        >
          <div className='grid grid-flow-col gap-4'>
            {paper.paperImages?.map((url, index) => {
              // 如果快照文件中没有保存图片，就直接不显示（因为好分数用的对象存储图片链接有过期机制，大概率是显示不出来的，很难看）
              if (!url.startsWith('data:image/jpeg;base64')) {
                return null
              }
              return (
                <Item
                  original={url}
                  width='1024'
                  height='768'
                  key={index}
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
