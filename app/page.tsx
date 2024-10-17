"use client";

import {fetchHFSApi} from "@/app/actions";
import {HFS_APIs} from "@/app/constants";
import Navbar from "@/components/navBar";
import {GithubSVGIcon} from "@/components/svg";
import {UserSnapshot} from "@/types/exam";
import {formatTimestamp} from "@/utils/time";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {JSX, SVGProps, useEffect, useState} from "react";
import toast from "react-hot-toast";

// 卡片组件
function ExamCard({
                    name,
                    score,
                    released,
                    examId,
                  }: {
  name: string,
  score: number,
  released: string,
  examId: string,
  router: AppRouterInstance,
}): JSX.Element {
  return (
    <Link
      className="bg-white rounded-lg border shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer dark:bg-gray-900"
      href={"/exam/" + examId}
    >
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
  );
}

export default function ExamSelector() {
  const [examList, setExams] = useState<{ name: any, score: string, released: string, examId: any }[]>([]);
  const router = useRouter();
  const [userSnapshot, setUserSnapshot] = useState<UserSnapshot>();

  useEffect(() => {
    alert("Hey, 我是 Roitium，HFS-NEXT的开发者。很高兴告诉你：2024/10/17，好分数给所有会员相关的接口都加了鉴权，这意味着普通用户再也无法查看排名等信息了，这个项目也失去了它最大的意义。我很快就会把这个项目 Public Archive 掉，网站关不关闭随心情，祝你好运。以及：FUCK U HFS!!!!!!");
    const token = localStorage.getItem("hfs_token");
    if (!token) {
      setTimeout(() => {
        toast.error("你还没登录，返回登录页");
        router.push("/login");
      });
      return;
    }
    fetchHFSApi(HFS_APIs.examList, {
      method: "GET",
      token: token,
    }).then((exams) => {
      if (!exams.ok) {
        toast.error("获取考试列表失败：" + exams.errMsg);
        return;
      }
      if (!exams.payload["list"]) {
        toast.error("获取考试列表失败：" + exams.errMsg);
        return;
      }
      let newExams = [];
      for (const exam of exams.payload["list"]) {
        newExams.push({
          name: exam["name"],
          score: exam["score"] + "/" + exam["manfen"],
          released: formatTimestamp(exam["time"]),
          examId: exam["examId"],
        });
      }
      setExams(newExams);
    });
    fetchHFSApi(HFS_APIs.userSnapshot, {
      token: token,
      method: "GET",
    }).then((exams) => {
      if (!exams.ok) {
        toast.error("获取用户信息失败：" + exams.errMsg);
        return;
      }
      if (!exams.payload) {
        toast.error("获取用户信息失败：" + exams.errMsg);
        return;
      }
      setUserSnapshot(exams.payload);
    });
  }, [router]);

  // @ts-ignore
  return (
    <div
      className="flex flex-col mx-auto px-4 pt-6 pb-2 md:px-4 md:pt-6 md:pb-2 bg-white dark:bg-gray-900 min-h-screen select-none">
      <Navbar
        userName={
          userSnapshot ? userSnapshot.linkedStudent.studentName : "xxx家长"
        }
        router={router}
        snapshotMode={false}
      />
      <div className=" grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-6 md:pt-6">
        {examList.map((exam: any) => (
          <ExamCard key={exam.key} {...exam} />
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

function ArrowRightIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
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
  );
}