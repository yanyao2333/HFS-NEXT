'use server'
import { fillTemplate } from '@/utils/string'

export async function fetchHFSApi(
  url: string,
  init: {
    token: string
    method: 'POST' | 'GET'
    // Post请求需要发送的json数据
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    postBody?: Record<string, any>
    // Get请求需要的param，会预先解析并填充到url中
    getParams?: Record<string, string | number>
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<{ payload?: any; ok: boolean; errMsg?: string }> {
  try {
    const parsedUrl = fillTemplate(url, init.getParams)
    const headers = {
      'Content-Type': 'application/json',
      'Hfs-token': init.token,
    }
    const options: RequestInit = {
      headers,
      method: init.method,
    }
    if (init.postBody) {
      options.body = JSON.stringify(init.postBody)
    }

    const res = await fetch(parsedUrl, options)
    if (!res.ok) {
      return { errMsg: res.statusText, ok: false }
    }

    const json_data = await res.json()
    if (json_data.code === 0) {
      return { payload: json_data.data, ok: true }
    }
    return { ok: false, errMsg: json_data.msg }
  } catch (e) {
    return { ok: false, errMsg: String(e) }
  }
}

// 以下内容全是 ai vibe coding，懒得改了

const BaseURL = 'https://hfs-be.yunxiao.com'
const LastExamOverviewUrl = `${BaseURL}/v2/students/last-exam-overview`
const ExamOverviewURLFormat = `${BaseURL}/v3/exam/%d/overview`

interface LastExamOverviewResponse {
  code: number
  msg: string
  data: LastExamOverview | object
}

interface ExamOverviewResponse {
  code: number
  msg: string
  data: ExamOverview
}

interface LastExamOverview {
  examId: number
  subjectNumber: number
  isManfen: boolean
  classDefeatLevel: number
  gradeDefeatLevel: number
  extend: {
    classRank: number
    classStuNum: number
    classDefeatRatio: number
    gradeRank: number
    gradeStuNum: number
    gradeDefeatRatio: number
  }
  worstSubjectText: string
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  badSubjects: any[]
  simpleQuestionLostScores: number
  middleQuestionLostScores: number
  hardQuestionLostScores: number
  scoreRaise: number
  rankRaise: number
}

interface ExamOverview {
  score: number
  manfen: number
  groupRank: number
  classRank: number
  papers: ExamPaper[]
}

interface ExamPaper {
  paperId: string
  name: string
  score: number
  manfen: number
  subject: string
}

export async function getLastExamOverview(token: string) {
  try {
    const response = await fetch(LastExamOverviewUrl, {
      headers: {
        'hfs-token': token,
      },
    })

    const data = (await response.json()) as LastExamOverviewResponse

    // Check if data is empty object
    if (data.code === 1 && Object.keys(data.data).length === 0) {
      return { success: true, data: null }
    }

    if (data.code !== 0 && data.code !== 1) {
      return { success: false, error: data.msg || '获取考试概览失败' }
    }

    return { success: true, data: data.data }
  } catch (error) {
    console.error('Get last exam overview error:', error)
    return { success: false, error: '服务器错误' }
  }
}

export async function getExamOverview(examId: number, token: string) {
  try {
    const url = ExamOverviewURLFormat.replace('%d', examId.toString())
    const response = await fetch(url, {
      headers: {
        'hfs-token': token,
      },
    })

    const data = (await response.json()) as ExamOverviewResponse

    if (data.code !== 0) {
      return { success: false, error: data.msg || '获取考试详情失败' }
    }

    return { success: true, data: data.data }
  } catch (error) {
    console.error('Get exam overview error:', error)
    return { success: false, error: '服务器错误' }
  }
}
