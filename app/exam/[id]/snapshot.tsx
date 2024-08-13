"use client";

import { useState } from "react";

export default function Snapshot({ onClose }: { onClose: any }) {
  const [nowStage, setNowStage] = useState<number>(NaN);
  const stages = [
    { name: "保存试卷数据（from /exam/overview）", id: "overview" },
    { name: "保存等级数据（from /exam/rank-info）", id: "rank-info" },
    {
      name: "保存答题卡图片（from /exam/papers/answer-picture）",
      id: "answer-pic",
    },
  ];

  const handleStart = async () => {
    // for (let index = 0; index < stages.length; index++) {
    //     setNowStage(index);
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    // }
    // setNowStage(stages.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-auto p-4 max-w-64 lg:min-w-96 lg:max-w-lg">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            创建试卷快照
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div>
          {isNaN(nowStage) ? (
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <span style={{ color: "red" }} className="text-xl">
                  开发中
                </span>
              </p>
              <div className="flex justify-center gap-8">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:dark:bg-gray-500 hover:bg-gray-400"
                >
                  我不要
                </button>
                <button
                  onClick={handleStart}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  点左边的
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">保存进度:</p>
              <ul className="space-y-2">
                {stages.map((stage, index) => (
                  <li
                    key={index}
                    className={
                      index === nowStage
                        ? "text-yellow-500"
                        : index > nowStage
                          ? "text-gray-400"
                          : "text-green-500"
                    }
                  >
                    {stage.name}：
                    {index === nowStage
                      ? "处理中..."
                      : index > nowStage
                        ? "未处理"
                        : "已完成"}
                  </li>
                ))}
              </ul>
              {nowStage >= stages.length && (
                <div className="flex justify-end mt-4">
                  <a
                    href="https://www.bilibili.com/video/BV1GJ411x7h7"
                    target="_blank"
                  >
                    <button className="px-4 py-2 rounded bg-green-600 text-white">
                      下载文件(别点)
                    </button>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
