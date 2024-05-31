"use client"

import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/card"
import { Label } from "@/components/label"
import { Input } from "@/components/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/select"
import { Button } from "@/components/button"
import {useEffect, useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {loginAction, validateTokenAction} from "@/app/actions";


enum loginRoleType {
    parent=2,
    student=1
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState(loginRoleType.parent.toString());
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("hfs_token");
        if (token) {
            validateTokenAction(token).then((status) => {
                if (!status.tokenExpired) {
                    console.log("你已经登录过了！")
                    router.push("/exams")
                }else if (!status.errMsg) {
                    alert("在查询是否已登录时发生错误：" + status.errMsg)
                    return
                }
            })
        }
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
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>登录</CardTitle>
                        <CardDescription>输入帐号密码登录好分数</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">邮箱/用户名/手机号</Label>
                            <Input id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">密码</Label>
                            <Input id="password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mode">登录方式</Label>
                            {/*// @ts-ignore*/}
                            <Select id="mode" value={mode} onValueChange={setMode}>
                                <SelectTrigger>
                                    <SelectValue placeholder="选择模式" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={loginRoleType.parent.toString()}>家长端</SelectItem>
                                    <SelectItem value={loginRoleType.student.toString()}>学生端</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleSubmit} disabled={isPending}>登录</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
