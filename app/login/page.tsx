"use client";

import {fetchHFSApi} from "@/app/actions";
import {HFS_APIs} from "@/app/constants";
import {Button} from "@/components/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/card";
import {Input} from "@/components/input";
import {Label} from "@/components/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/select";
import {GithubSVGIcon} from "@/components/svg";
import {useRouter} from "next/navigation";
import {useEffect, useState, useTransition} from "react";
import toast from "react-hot-toast";

enum loginRoleType {
  parent = 2,
  student = 1,
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(loginRoleType.parent.toString());
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("hfs_token");
    if (token) {
      fetchHFSApi(HFS_APIs.userSnapshot, {
        token: token,
        method: "GET",
      }).then((status) => {
        if (status.ok) {
          toast("你已经登录过了 重定向到主页");
          router.push("/");
          return;
        }
      });
    }
    router.prefetch("/");
  }, [router]);

  async function handleSubmit(): Promise<void> {
    startTransition(async () => {
      if (!email || !password) {
        toast.error("你还没写账号/密码呢！！！");
        return;
      }
      const _token = await fetchHFSApi(HFS_APIs.login, {
        method: "POST",
        token: "114514",
        postBody: {
          loginName: email,
          password: btoa(password),
          roleType: role,
          loginType: 1,
          rememberMe: 2,
        },
      });
      if (!_token.ok) {
        toast.error("登录失败，原因：" + _token.errMsg);
        return;
      }
      toast.success("登录成功 进入新世界");
      localStorage.setItem("hfs_token", _token.payload.token);
      router.push("/");
    });
  }

  return (
    <div
      className="flex flex-col px-4 pt-3 pb-2 md:px-4 md:pt-6 md:pb-2 mx-auto bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>HFS NEXT</CardTitle>
            <CardDescription>你的下一个好分数，何必是好分数？</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱/用户名/手机号</Label>
              <Input
                id="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                required
                type="password"
                value={password}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mode">登录方式</Label>
              {/*@ts-ignore*/}
              <Select id="mode" value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="选择模式"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={loginRoleType.parent.toString()}>
                    家长端
                  </SelectItem>
                  <SelectItem value={loginRoleType.student.toString()}>
                    学生端
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <text className="text-sm text-gray-500 dark:text-gray-400">
              忘记账号密码？
              <a
                href="https://www.haofenshu.com/findPwd/?roleType=2"
                target="_blank"
                className="underline hover:text-gray-700"
              >
                点我去官网重置
              </a>
              <br/>
              <br/>
              没有账号密码（微信登录）请先在手机端绑定手机号并设置密码
            </text>
          </CardContent>
          <CardFooter className="flex-col">
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isPending}
            >
              立即登录
            </Button>
            <div className="py-2"/>
            <Button
              className="w-full bg-gray-500"
              onClick={() => {
                router.push("/snapshot");
              }}
            >
              已有试卷快照？点我上传
            </Button>
          </CardFooter>
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
