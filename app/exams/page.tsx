"use client"

import {JSX, SVGProps, useEffect, useState} from "react"
import {formatTimestamp} from "@/utils/time"
import {getExamsList, getUserSnapshotAction} from "@/app/actions";
import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {UserSnapshot} from "@/types/exam";
import Navbar from "@/components/navBar";
import Link from "next/link";

// 卡片组件
function ExamCard({name, score, released, examId}: {
    name: string;
    score: number;
    released: string,
    examId: string,
    router: AppRouterInstance
}): JSX.Element {

    return (
        <Link
            className="bg-white rounded-lg border shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer dark:bg-gray-900"
            href={"/exam/" + examId}>
            <div className="p-4 md:p-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold mb-2">{name}</h2>
                    <div className="flex items-center mb-2">
                        <span className="text-gray-500 mr-2">成绩:</span>
                        <span className="font-medium text-gray-800">{score}</span>
                    </div>
                    <div className="text-gray-500 text-sm">发布时间: {released}</div>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-500"/>
            </div>
        </Link>
    )
}

export default function ExamSelector() {
    const [examList, setExams] = useState<[]>([])
    const router = useRouter()
    let [userSnapshot, setUserSnapshot] = useState<UserSnapshot>()

    useEffect(() => {
        const token = localStorage.getItem("hfs_token")
        if (!token) {
            alert("你还没登录诶！")
            router.push("/")
            return
        }
        getExamsList(token).then((exams) => {
            if (!exams.ok) {
                alert("获取考试列表失败：" + exams.errMsg)
                return
            }
            if (!exams.examList) {
                alert("获取考试列表失败：" + exams.errMsg)
                return
            }
            let newExams = []
            for (const exam of exams.examList) {
                newExams.push({
                    name: exam["name"],
                    score: exam["score"] + "/" + exam["manfen"],
                    released: formatTimestamp(exam["time"]),
                    examId: exam["examId"]
                })
            }
            // console.log(newExams)
            // @ts-ignore
            setExams(newExams)
        })
        getUserSnapshotAction(token).then((exams) => {
            if (!exams.ok) {
                alert("获取用户信息失败：" + exams.errMsg)
                return
            }
            if (!exams.payload) {
                alert("获取用户信息失败：" + exams.errMsg)
                return
            }
            setUserSnapshot(exams.payload)
        })
    }, [router])

    // @ts-ignore
    return (
        <div className="flex flex-col mx-auto px-4 pt-6 pb-2 md:px-4 md:pt-6 md:pb-2 min-h-screen ">
            <Navbar userName={(userSnapshot) ? userSnapshot.linkedStudent.studentName : "xxx家长"} router={router}/>
            {/*<h1 className="text-2xl font-bold mb-6 md:text-3xl">考试列表</h1>*/}
            <div className=" grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-6 md:pt-6">
                {examList.map((exam: object) => (
                    // @ts-ignore
                    <ExamCard key={exam["key"]} {...exam} />
                ))}
            </div>
            <div className="flex-grow"></div>
            <div className="pt-10 divide-y">
                <div></div>
                <div className="pt-0.5 justify-between flex flex-col md:flex-row">
                    <span className="text-gray-500 text-xs flex items-center">
                      Open Source by UselessLab on
                      <span className="inline-flex items-center ml-1">
                        <a
                            href="https://github.com/yanyao2333/HFS-NEXT"
                            target="_blank"
                            className="ml-1">
                          <GithubSVGIcon/>
                      </a>
                        <a
                            href="https://github.com/yanyao2333/HFS-NEXT"
                            target="_blank"
                            className="ml-1 underline"
                        >
                          yanyao2333/HFS-NEXT
                        </a>
                      </span>
                    </span>
                    <span className="text-gray-500 text-xs content-center">
                      Powered by <a href="https://vercel.com" target="_blank" className="underline">Vercel</a>
                    </span>
                </div>
            </div>
        </div>
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
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
        </svg>
    )
}

function GithubSVGIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="50" viewBox="0 0 16 16" width="15" aria-hidden="true"
             className="">
            <path fill="currentColor"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
    )
}
