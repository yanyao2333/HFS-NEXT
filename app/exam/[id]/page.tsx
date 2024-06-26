"use client"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/card"
import {useEffect, useState} from "react"
import {
    getAnswerPictureAction,
    getExamOverviewAction,
    getExamRankInfoAction,
    getPaperRankInfoAction,
    getUserSnapshotAction
} from "@/app/actions";
import {useRouter, useSearchParams} from "next/navigation";
import {formatTimestamp} from "@/utils/time";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Navbar from "@/components/navBar";
import {ExamDetail, ExamRankInfo, Paper, PaperRankInfo, UserSnapshot} from "@/types/exam";
import Snapshot from "@/app/exam/[id]/snapshot";

function PaperHiddingComponent(props: { paper: Paper, changeDisplayMode: Function }) {
    return (
        <Card>
            <CardHeader onClick={() => {
                props.changeDisplayMode(props.paper.paperId)
            }} className="select-none cursor-pointer">
                <div className="flex w-full items-center justify-between">
                    <div>{props.paper.name}</div>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                        </svg>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

function PaperShowingComponent(props: {
    paper: Paper,
    changeDisplayMode: Function,
    advancedMode: boolean,
    router: AppRouterInstance,
    examId: string
}) {
    let [paperRankInfo, setPaperRankInfo] = useState<PaperRankInfo>();
    let [answerPictureUrls, setAnswerPictureUrls] = useState<string[]>([]);
    useEffect(() => {
        const token = localStorage.getItem("hfs_token")
        if (!token) {
            alert("你还没登录诶！")
            props.router.push("/")
            return
        }
        getPaperRankInfoAction(token, props.examId, props.paper.paperId).then((exams) => {
            if (!exams.ok) {
                alert("获取试卷失败：" + exams.errMsg)
                return
            }
            if (!exams.payload) {
                alert("获取试卷失败：" + exams.errMsg)
                return
            }
            setPaperRankInfo(exams.payload)
        })
        getAnswerPictureAction(token, props.paper.paperId, props.paper.pid, props.examId).then((exams) => {
            if (!exams.ok) {
                alert("获取试卷失败：" + exams.errMsg)
                return
            }
            if (!exams.payload) {
                alert("获取试卷失败：" + exams.errMsg)
                return
            }
            setAnswerPictureUrls(exams.payload["url"])
        })
    }, [props.examId, props.paper.paperId, props.paper.pid, props.router]);

    return (
        <Card>
            <CardHeader onClick={() => {
                props.changeDisplayMode(props.paper.paperId)
            }} className="select-none cursor-pointer">
                <div className="flex w-full items-center justify-between">
                    <div>{props.paper.name}</div>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"/>
                        </svg>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4 px-4 pb-4 select-none">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">满分</div>
                        <div className="font-medium">{props.paper.manfen}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">得分</div>
                        <div className="font-medium">{props.paper.score}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">班级排名/等第</div>
                        <div
                            className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.rank.class + " (打败了全班" + paperRankInfo.defeatRatio.class + "%的人)" : paperRankInfo.rankPart.class : "..."}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">年级排名/等第</div>
                        <div
                            className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.rank.grade + " (打败了全年级" + paperRankInfo.defeatRatio.grade + "%的人)" : paperRankInfo.rankPart.grade : "..."}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">班级最高分</div>
                        <div
                            className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.highest.class : "根据要求，该数据不允许展示" : "..."}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">年级最高分</div>
                        <div
                            className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.highest.grade : "根据要求，该数据不允许展示" : "..."}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">班级平均分</div>
                        <div
                            className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.avg.class : "根据要求，该数据不允许展示" : "..."}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">年级平均分</div>
                        <div
                            className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.avg.grade : "根据要求，该数据不允许展示" : "..."}</div>
                    </div>
                </div>
                <div className="grid grid-flow-col gap-4">
                    {answerPictureUrls.map((url, index) => {
                        // eslint-disable-next-line @next/next/no-img-element
                        return <a key={index} href={url} target={"_blank"}><img className="rounded-lg object-cover"
                                                                                src={url}
                                                                                alt={props.paper.name + "_" + index}
                                                                                width={300} style={{
                            aspectRatio: "300/200",
                            objectFit: "cover"
                        }}
                                                                                height={200}/></a>
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default function ExamPage({params}: { params: { id: string } }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    // let advancedMode = searchParams.get("advanced")
    const [advancedMode, setAdvancedMode] = useState<boolean>(false)
    const [examDetail, setExamDetail] = useState<ExamDetail>()
    const [examRankInfo, setExamRankInfo] = useState<ExamRankInfo>()
    const [displayedPapersMode, setDisplayedPapersMode] = useState<{ [index: string]: boolean }>({}) // true为显示 false为隐藏
    const [userSnapshot, setUserSnapshot] = useState<UserSnapshot>()
    const [isExamSnapshotWindowOpen, setIsExamSnapshotWindowOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("hfs_token")
        if (!token) {
            alert("你还没登录诶！")
            router.push("/")
            return
        }
        if (searchParams.get("advanced")) {
            setAdvancedMode(("true" === searchParams.get("advanced")))
        } else {
            const localAdvancedMode = localStorage.getItem("advancedMode")
            if (localAdvancedMode) {
                setAdvancedMode(("1" === localAdvancedMode))
            }
        }
        getExamOverviewAction(token, params.id).then((exams) => {
            if (!exams.ok) {
                alert("获取考试详情失败：" + exams.errMsg)
                return
            }
            if (!exams.payload) {
                alert("获取考试详情失败：" + exams.errMsg)
                return
            }
            setExamDetail(exams.payload)
        })
        getExamRankInfoAction(token, params.id).then((exams) => {
            if (!exams.ok) {
                alert("获取考试详情失败：" + exams.errMsg)
                return
            }
            if (!exams.payload) {
                alert("获取考试详情失败：" + exams.errMsg)
                return
            }
            setExamRankInfo(exams.payload)
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
    }, [params.id, router, searchParams]);

    function changeDisplayedMode(paperId: string) {
        setDisplayedPapersMode((prevState) => {
            return {
                ...prevState,
                [paperId]: !prevState[paperId],
            }
        })
    }

    return (
        <div className="flex flex-col px-4 py-8 mx-auto md:px-6 md:py-12 select-none bg-white dark:bg-gray-900">
            <Navbar router={router} userName={(userSnapshot) ? userSnapshot.linkedStudent.studentName : "xxx家长"}/>
            <div className="flex flex-col gap-6 pt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {(examDetail) ? examDetail.name : params.id}
                        </CardTitle>
                        <div className="flex flex-row pt-3 gap-3">
                            <div onClick={() => {
                                setIsExamSnapshotWindowOpen(true)
                            }}
                                 className="cursor-pointer flex-grow-0 border border-gray-400 rounded-full p-1 hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/>
                                </svg>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">考试名</div>
                                <div className="font-medium">{(examDetail) ? examDetail.name : "..."}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">考试发布时间</div>
                                <div
                                    className="font-medium">{(examDetail) ? formatTimestamp(examDetail.time as number) : "..."}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">满分</div>
                                <div className="font-medium">{(examDetail) ? examDetail.manfen : "..."}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">得分</div>
                                <div className="font-medium">{(examDetail) ? examDetail.score : "..."}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">班级排名/等第</div>
                                <div
                                    className="font-medium">{(examDetail) ? (advancedMode) ? examDetail.classRank + " (打败了全班" + examDetail.classDefeatRatio + "%的人)" : examDetail.classRankPart : "..."}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">年级排名/等第</div>
                                <div
                                    className="font-medium">{(examDetail) ? (advancedMode) ? examDetail.gradeRank + " (打败了全年级" + examDetail.gradeDefeatRatio + "%的人)" : examDetail.gradeRankPart : "..."}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">班级最高分</div>
                                <div
                                    className="font-medium">{(examRankInfo) ? (advancedMode) ? examRankInfo.highest.class : "根据要求，该数据不允许展示" : "..."}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">年级最高分</div>
                                <div
                                    className="font-medium">{(examRankInfo) ? (advancedMode) ? examRankInfo.highest.grade : "根据要求，该数据不允许展示" : "..."}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">班级平均分</div>
                                <div
                                    className="font-medium">{(examRankInfo) ? (advancedMode) ? examRankInfo.avg.class : "根据要求，该数据不允许展示" : "..."}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">年级平均分</div>
                                <div
                                    className="font-medium">{(examRankInfo) ? (advancedMode) ? examRankInfo.avg.grade : "根据要求，该数据不允许展示" : "..."}</div>
                            </div>
                        </div>
                        {/* 快照弹窗 */}
                        {(isExamSnapshotWindowOpen) && <Snapshot onClose={() => {
                            setIsExamSnapshotWindowOpen(false)
                        }}/>}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>各科分析</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {examDetail?.papers.map((item) => {
                                let component
                                (!displayedPapersMode[item.paperId]) ?
                                    component =
                                        <PaperHiddingComponent paper={item} changeDisplayMode={changeDisplayedMode}
                                                               key={item.paperId}/>
                                    : component =
                                        <PaperShowingComponent paper={item} changeDisplayMode={changeDisplayedMode}
                                                               advancedMode={advancedMode} router={router}
                                                               examId={String(examDetail?.examId)} key={item.paperId}/>
                                return component
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="pt-10 divide-y">
                <div></div>
                <div className="pt-2 flex justify-between flex-col md:flex-row">
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
                    <span className="text-gray-500 text-xs">
      Powered by <a href="https://vercel.com" target="_blank" className="underline">Vercel</a>
    </span>
                </div>
            </div>
        </div>
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
