"use client"

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/card"
import {Label} from "@/components/label"
import {Input} from "@/components/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/select"
import {Button} from "@/components/button"
import {useEffect, useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {loginAction, validateTokenAction} from "@/app/actions";


enum loginRoleType {
    parent = 2,
    student = 1
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState(loginRoleType.parent.toString());
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [loginButtonContent, setLoginButtonContent] = useState("")

    useEffect(() => {
        setLoginButtonContent(Math.random() < 0.4 ? "登录" : "Ciallo～(∠・ω< )")
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("hfs_token");
        if (token) {
            validateTokenAction(token).then((status) => {
                if (!status.tokenExpired) {
                    console.log("你已经登录过了！")
                    router.push("/exams")
                } else if (!status.errMsg) {
                    alert("在查询是否已登录时发生错误：" + status.errMsg)
                    return
                }
            })
        }
        router.prefetch("/exams")
    })

    async function handleSubmit(): Promise<void> {
        startTransition(async () => {
            const _token = await loginAction(email, password, Number(mode))
            if (!_token.ok) {
                alert("登录失败，原因：" + _token.payload)
                return
            }
            localStorage.setItem("hfs_token", _token.payload)
            router.push("/exams")
        })
    }

    // @ts-ignore
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
                            <Input id="email" required type="email" value={email}
                                   onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">密码</Label>
                            <Input id="password" required type="password" value={password}
                                   onKeyDown={(e) => {
                                       if (e.key === "Enter") {
                                           handleSubmit()
                                       }
                                   }}
                                   onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mode">登录方式</Label>
                            {/*// @ts-ignore*/}
                            <Select id="mode" value={mode} onValueChange={setMode}>
                                <SelectTrigger>
                                    <SelectValue placeholder="选择模式"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={loginRoleType.parent.toString()}>家长端</SelectItem>
                                    <SelectItem value={loginRoleType.student.toString()}>学生端</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <text className="text-sm text-gray-500 dark:text-gray-400">
                            忘记账号密码？<a href="https://www.haofenshu.com/findPwd/?roleType=2" target="_blank"
                                            className="underline hover:text-gray-700">点我去官网重置</a><br/><br/>没有账号密码（微信登录）请先在手机端绑定手机号并设置密码
                        </text>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleSubmit}
                                disabled={isPending}>{loginButtonContent}</Button>
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
    );
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