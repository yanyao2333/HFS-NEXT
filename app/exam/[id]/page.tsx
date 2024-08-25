"use client";
import {fetchHFSApi} from "@/app/actions";
import {HFS_APIs} from "@/app/constants";
import {PaperHidingComponent, PaperShowingComponent} from "@/app/exam/[id]/paper";
import Snapshot from "@/app/exam/[id]/snapshot";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/card";
import Navbar from "@/components/navBar";
import {GithubSVGIcon} from "@/components/svg";
import {ExamObject, PapersObject, UserSnapshot} from "@/types/exam";
import {formatTimestamp} from "@/utils/time";
import {Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip} from "chart.js";
import html2canvas from "html2canvas";
import {useRouter} from "next/navigation";
import {useCallback, useEffect, useRef, useState} from "react";
import {Radar} from "react-chartjs-2";
import toast from "react-hot-toast";

export default function ExamPage({params}: { params: { id: string } }) {
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
  );
  const router = useRouter();
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [examObject, setExamObject] = useState<ExamObject>();
  const [displayedPapersMode, setDisplayedPapersMode] = useState<{
    [index: string]: boolean;
  }>({}); // true为显示 false为隐藏
  const [userSnapshot, setUserSnapshot] = useState<UserSnapshot>();
  const [isExamSnapshotWindowOpen, setIsExamSnapshotWindowOpen] =
    useState(false);
  const [radarChartData, setRadarChartData] = useState<any>();
  const pageRef = useRef(null);
  const [papersObject, setPapersObject] = useState<PapersObject>();

  const getExamObject = useCallback(async (token: string) => {
      const [details, examRank, userSnapshot] = await Promise.allSettled([
        fetchHFSApi(HFS_APIs.examOverview, {
          token: token,
          method: "GET",
          getParams: {
            examId: params.id,
          },
        }),
        fetchHFSApi(HFS_APIs.examRankInfo, {
          token: token,
          method: "GET",
          getParams: {
            examId: params.id,
          },
        }),
        fetchHFSApi(HFS_APIs.userSnapshot, {
          token: token,
          method: "GET",
        }),
      ]) as unknown as PromiseFulfilledResult<{ payload?: any, ok: boolean, errMsg?: string | undefined }>[]; // 我们在fetch中做了错误捕捉，所以不会为rejected
      if (details.value.ok) {
        setRadarChartData({
          labels: details.value.payload.papers.map((item: { name: string }) => item.name),
          datasets: [
            {
              label: "你的得分",
              data: details.value.payload.papers.map((item: { score: number }) => item.score),
              fill: true,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgb(255, 99, 132)",
              pointBackgroundColor: "rgb(255, 99, 132)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(255, 99, 132)",
            },
            {
              label: "满分",
              data: details.value.payload.papers.map(
                (item: { manfen: number }) => item.manfen,
              ),
              fill: true,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgb(54, 162, 235)",
              pointBackgroundColor: "rgb(54, 162, 235)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(54, 162, 235)",
            },
          ],
        });
        setExamObject((prevExamObject) => ({
          ...prevExamObject,
          detail: details.value.payload,
        }));
      } else {
        toast.error("调用好分数API失败：" + details.value.errMsg);
      }
      if (!examRank.value.ok) {
        toast.error("调用好分数API失败：" + examRank.value.errMsg);
      }
      setExamObject((prevExamObject) => ({
        ...prevExamObject,
        rank: examRank.value.payload,
      }));
      if (!userSnapshot.value.ok) {
        toast.error("调用好分数API失败：" + userSnapshot.value.errMsg);
      }
      setUserSnapshot(userSnapshot.value.payload);
    },
    [params.id],
  );

  useEffect(() => {
    const token = localStorage.getItem("hfs_token");
    if (!token) {
      toast.error("你还没登录诶！");
      router.push("/login");
      return;
    }
    getExamObject(token).then();
    const localAdvancedMode = localStorage.getItem("advancedMode");
    if (localAdvancedMode) {
      setAdvancedMode("1" === localAdvancedMode);
    }
  }, [getExamObject, params.id, router]);

  function changeDisplayedMode(paperId: string) {
    setDisplayedPapersMode((prevState) => {
      return {
        ...prevState,
        [paperId]: !prevState[paperId],
      };
    });
  }

  async function createScreenshot() {
    if (!pageRef.current) {
      throw new Error("组件根节点ref为null???");
    }
    const canvas = await html2canvas(pageRef.current, {
      useCORS: true,
      foreignObjectRendering: true,
    });
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "exam_" + params.id + "_screenshot.png";
    link.click();
  }

  return (
    <div
      className="flex flex-col mx-auto px-4 pt-6 pb-2 md:px-4 md:pt-6 md:pb-2 bg-white dark:bg-gray-900 min-h-screen select-none"
      ref={pageRef}
    >
      <Navbar
        router={router}
        userName={
          userSnapshot ? userSnapshot.linkedStudent.studentName : "xxx家长"
        }
        snapshotMode={false}
      />
      <div className="flex flex-col gap-6 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {examObject?.detail ? examObject.detail.name : params.id}
            </CardTitle>
            <div
              data-html2canvas-ignore="true"
              className="flex flex-row pt-3 gap-3"
            >
              <div
                onClick={() => {
                  setIsExamSnapshotWindowOpen(true);
                }}
                className="cursor-pointer flex-grow-0 border border-gray-400 rounded-full p-1 hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </div>
              <div
                onClick={() => {
                  toast.promise(
                    createScreenshot(),
                    {
                      loading: "正在截图",
                      // success: "成功创建并下载截图！（答题卡图片空白是正常的）",
                      success: (
                        <span>
                          成功创建并下载截图！
                          <br/>
                          (答题卡图片空白是正常的)
                        </span>
                      ),
                      error: (err) => "创建截图失败，原因：" + err,
                    },
                    {
                      error: {
                        duration: 5000,
                      },
                      success: {
                        duration: 5000,
                      },
                    },
                  );
                }}
                className="cursor-pointer flex-grow-0 border border-gray-400 rounded-full p-1 hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                </svg>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  考试名
                </div>
                <div className="font-medium">
                  {examObject?.detail ? examObject.detail.name : "..."}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  考试发布时间
                </div>
                <div className="font-medium">
                  {examObject?.detail
                    ? formatTimestamp(examObject.detail.time as number)
                    : "..."}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  满分
                </div>
                <div className="font-medium">
                  {examObject?.detail ? examObject.detail.manfen : "..."}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  得分
                </div>
                <div className="font-medium">
                  {examObject?.detail ? examObject.detail.score : "..."}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  班级排名/等第
                </div>
                <div className="font-medium">
                  {examObject?.detail
                    ? advancedMode
                      ? examObject.detail.classRank +
                      " (打败了全班" +
                      examObject.detail.classDefeatRatio +
                      "%的人)"
                      : examObject.detail.classRankPart
                    : "..."}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  年级排名/等第
                </div>
                <div className="font-medium">
                  {examObject?.detail
                    ? advancedMode
                      ? examObject.detail.gradeRank +
                      " (打败了全年级" +
                      examObject.detail.gradeDefeatRatio +
                      "%的人)"
                      : examObject.detail.gradeRankPart
                    : "..."}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  班级最高分
                </div>
                <div className="font-medium">
                  {examObject?.rank
                    ? advancedMode
                      ? examObject.rank.highest.class
                      : "根据要求，该数据不允许展示"
                    : "..."}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  年级最高分
                </div>
                <div className="font-medium">
                  {examObject?.rank
                    ? advancedMode
                      ? examObject.rank.highest.grade
                      : "根据要求，该数据不允许展示"
                    : "..."}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  班级平均分
                </div>
                <div className="font-medium">
                  {examObject?.rank
                    ? advancedMode
                      ? examObject.rank.avg.class
                      : "根据要求，该数据不允许展示"
                    : "..."}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  年级平均分
                </div>
                <div className="font-medium">
                  {examObject?.rank
                    ? advancedMode
                      ? examObject.rank.avg.grade
                      : "根据要求，该数据不允许展示"
                    : "..."}
                </div>
              </div>
            </div>
            <div className="h-80 w-80 justify-self-center">
              {radarChartData ? (
                <Radar data={radarChartData} datasetIdKey="radar"/>
              ) : (
                <div/>
              )}
            </div>
            {/* 快照弹窗 */}
            {isExamSnapshotWindowOpen && (
              <Snapshot
                onClose={() => {
                  setIsExamSnapshotWindowOpen(false);
                }}
                examObject={examObject}
                papersObject={papersObject}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>各科分析</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {examObject?.detail?.papers.map((item) => {
                let component;
                !displayedPapersMode[item.paperId]
                  ? (component = (
                    <PaperHidingComponent
                      paper={item}
                      changeDisplayMode={changeDisplayedMode}
                      key={item.paperId}
                    />
                  ))
                  : (component = (
                    <PaperShowingComponent
                      paper={item}
                      changeDisplayMode={changeDisplayedMode}
                      advancedMode={advancedMode}
                      router={router}
                      examId={String(examObject?.detail?.examId)}
                      setPapersObject={setPapersObject}
                      key={item.paperId}
                    />
                  ));
                return component;
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
                className="ml-1"
              >
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
            Powered by{" "}
            <a href="https://vercel.com" target="_blank" className="underline">
              Vercel
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}