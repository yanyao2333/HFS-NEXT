"use client"

import {JSX, SVGProps, useEffect, useState} from "react"
import {getExamsList} from "@/app/exams/actions";
import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

// 卡片组件
function ExamCard({ name, score, released, examId, router }: { name: string; score: number; released: string, examId: string, router: AppRouterInstance }): JSX.Element {
  async function handleClick() {
    // router.push("/exam/" + examId)
    // TODO 替换成自己的页面
    router.push("https://www.haofenshu.com/report/summary?examId=" + examId)
  }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={handleClick}>
      <div className="p-4 md:p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">{name}</h2>
          <div className="flex items-center mb-2">
            <span className="text-gray-500 mr-2">成绩:</span>
            <span className="font-medium text-gray-800">{score}</span>
          </div>
          <div className="text-gray-500 text-sm">发布时间: {released}</div>
        </div>
        <ArrowRightIcon className="h-5 w-5 text-gray-500" />
      </div>
    </div>
)
}

function formatTimestamp(timestamp: number) {
  // 创建一个新的Date对象，使用时间戳作为参数
  const date = new Date(timestamp);

  const year = date.getFullYear();
  let month: string | number = date.getMonth() + 1;
  let day: string | number = date.getDate();

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  return year + '-' + month + '-' + day
}

export default function ExamSelector() {
  const [examList, setExams] = useState<[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("hfs_token")
    if (!token) {
      console.log("你还没登录诶！")
      router.push("/")
      return
    }
    getExamsList(token).then((exams) => {
      let newExams = []
      console.log(exams)
      for (const exam of exams) {
        newExams.push({
          name: exam["name"],
          score: exam["score"] + "/" + exam["manfen"],
          released: formatTimestamp(exam["time"]),
          examId: exam["examId"],
          router: router
        })
      }
      // console.log(newExams)
      // @ts-ignore
      setExams(newExams)
    })
  }, [router])

    // @ts-ignore
  return (
        <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-2xl font-bold mb-6 md:text-3xl">考试列表</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {examList.map((exam: object) => (
            // @ts-ignore
            <ExamCard key={exam["key"]} {...exam} />
        ))}
      </div>
    </main>
)
}

function ArrowRightIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
