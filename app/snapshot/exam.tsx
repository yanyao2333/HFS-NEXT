"use client";
import {PaperHidingComponent, PaperShowingComponent} from "@/app/snapshot/paper";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/card";
import Navbar from "@/components/navBar";
import {ExamObject, PapersObject} from "@/types/exam";
import {formatTimestamp} from "@/utils/time";
import {Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip} from "chart.js";
import html2canvas from "html2canvas";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {Radar} from "react-chartjs-2";
import toast from "react-hot-toast";


export function ExamPage({papersObject, examObject}: { papersObject: PapersObject, examObject: ExamObject }) {
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
  );
  const router = useRouter();
  const [displayedPapersMode, setDisplayedPapersMode] = useState<{
    [index: string]: boolean;
  }>({}); // true为显示 false为隐藏
  const [radarChartData, setRadarChartData] = useState<any>();
  const pageRef = useRef(null);
  const advancedMode = true;

  useEffect(() => {
    setRadarChartData({
      labels: examObject.detail?.papers.map((item: { name: string }) => item.name),
      datasets: [
        {
          label: "你的得分",
          data: examObject.detail?.papers.map((item: { score: number }) => item.score),
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
          data: examObject.detail?.papers.map(
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
  }, [examObject.detail?.papers]);

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
    link.download = "exam_" + examObject.detail?.examId + "_screenshot.png";
    link.click();
  }

  return (
    <div
      className="flex flex-col mx-auto px-4 pt-6 pb-2 md:px-4 md:pt-6 md:pb-2 bg-white dark:bg-gray-900 min-h-screen select-none"
      ref={pageRef}
    >
      <Navbar
        router={router}
        userName="试卷快照"
        snapshotMode={true}
      />
      <div className="flex flex-col gap-6 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {examObject.detail?.name}
            </CardTitle>
            <div
              data-html2canvas-ignore="true"
              className="flex flex-row pt-3 gap-3"
            >
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>各科分析</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.keys(papersObject).map((paperId) => {
                let component;
                !displayedPapersMode[paperId]
                  ? (component = (
                    <PaperHidingComponent
                      paper={papersObject[paperId]}
                      changeDisplayMode={changeDisplayedMode}
                      key={paperId}
                    />
                  ))
                  : (component = (
                    <PaperShowingComponent
                      paper={papersObject[paperId]}
                      changeDisplayMode={changeDisplayedMode}
                      key={paperId}
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

function GithubSVGIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="50"
      viewBox="0 0 16 16"
      width="15"
      aria-hidden="true"
      className=""
    >
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      ></path>
    </svg>
  );
}
