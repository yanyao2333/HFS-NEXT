"use client"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/card"
import {useEffect, useState} from "react"
import {
  getAnswerPictureAction,
  getExamOverviewAction,
  getExamRankInfoAction,
  getPaperRankInfoAction, getUserSnapshotAction
} from "@/app/actions";
import {useRouter, useSearchParams} from "next/navigation";
import {formatTimestamp} from "@/utils/time";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Navbar from "@/components/navBar";
import {ExamDetail, ExamRankInfo, Paper, PaperRankInfo, UserSnapshot} from "@/types/exam";

function PaperHiddingComponent(props: {paper: Paper, changeDisplayMode: Function}) {
  return (
      <Card>
        <CardHeader onClick={() => {
          props.changeDisplayMode(props.paper.paperId)
        }} className="select-none">
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

function PaperShowingComponent(props: {paper: Paper, changeDisplayMode: Function, advancedMode: boolean, router: AppRouterInstance, examId: string}) {
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
        }} className="select-none">
      <div className="flex w-full items-center justify-between">
        <div>{props.paper.name}</div>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
               stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"/>
          </svg>
        </div>
      </div>
    </CardHeader>
        <CardContent className="grid gap-4 px-4 pb-4">
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
              <div className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.rank.class + " (打败了全班" + paperRankInfo.defeatRatio.class + "%的人)" : paperRankInfo.rankPart.class : "..."}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">年级排名/等第</div>
              <div className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.rank.grade + " (打败了全年级" + paperRankInfo.defeatRatio.grade + "%的人)" : paperRankInfo.rankPart.grade : "..."}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">班级最高分</div>
              <div className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.highest.class : "根据要求，该数据不允许展示" : "..."}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">年级最高分</div>
              <div className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.highest.grade : "根据要求，该数据不允许展示" : "..."}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">班级平均分</div>
              <div className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.avg.class : "根据要求，该数据不允许展示" : "..."}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">年级平均分</div>
              <div className="font-medium">{(paperRankInfo) ? (props.advancedMode) ? paperRankInfo.avg.grade : "根据要求，该数据不允许展示" : "..."}</div>
            </div>
          </div>
          <div className="grid grid-flow-col gap-4">
            {answerPictureUrls.map((url, index) => {
              // eslint-disable-next-line @next/next/no-img-element
              return <img className="rounded-lg object-cover" src={url} alt={props.paper.name + "_" + index} key={index} width={300} style={{aspectRatio: "300/200", objectFit: "cover"}} height={200} />
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
  let [advancedMode, setAdvancedMode] = useState<boolean>(false)
  let [examDetail, setExamDetail] = useState<ExamDetail>()
  let [examRankInfo, setExamRankInfo] = useState<ExamRankInfo>()
  let [displayedPapersMode, setDisplayedPapersMode] = useState<{ [index: string]: boolean }>({}) // true为显示 false为隐藏
  let [userSnapshot, setUserSnapshot] = useState<UserSnapshot>()

  useEffect(() => {
    const token = localStorage.getItem("hfs_token")
    if (!token) {
      alert("你还没登录诶！")
      router.push("/")
      return
    }
    if (searchParams.get("advanced")) {
      setAdvancedMode(("true" === searchParams.get("advanced")))
    }else {
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
        <div className="flex flex-col gap-6 p-4 md:gap-8 md:p-6">
          <Navbar  router={router} userName={(userSnapshot) ? userSnapshot.linkedStudent.studentName : "xxx家长"}/>
          <Card>
            <CardHeader>
              <CardTitle>{(examDetail) ? examDetail.name : params.id}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">考试名</div>
                  <div className="font-medium">{(examDetail) ? examDetail.name : "..."}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">考试发布时间</div>
                  <div className="font-medium">{(examDetail) ? formatTimestamp(examDetail.time as number) : "..."}</div>
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
                   component = <PaperHiddingComponent paper={item} changeDisplayMode={changeDisplayedMode} key={item.paperId}/>
                  : component = <PaperShowingComponent paper={item} changeDisplayMode={changeDisplayedMode} advancedMode={advancedMode} router={router} examId={String(examDetail?.examId)} key={item.paperId}/>
                  return component
                })}
              </div>
            </CardContent>
          </Card>
        </div>
    )
  }
