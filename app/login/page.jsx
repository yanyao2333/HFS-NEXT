"use client"
import React from "react";
import {Select, SelectItem} from "@nextui-org/select";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";

const loginType = [
    {label: "家长登录", value: 2, description: "一般都是这个"},
    {label: "学生登录", value: 1, description: "学生版"}
]

function SelectLoginType({ type, setType }) {
    // const [type, setType] = React.useState(new Set([]));

    return (
        <div className="flex w-full max-w-xs flex-col gap-2">
            <Select
                label="登录类型"
                variant="bordered"
                placeholder="选择你的登录类型"
                selectedKeys={type}
                className="max-w-xs"
                onSelectionChange={setType}
                isRequired={true}
            >
                {loginType.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                        {type.label}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
}

export default function LoginPage(){
    const [type, setType] = React.useState(new Set([]));
    const [isSubmit, setIsSubmit] = React.useState(false);
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState("");

    return (
        <div className="flex min-h-full justify-center gap-4 flex-col">
            <div>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    登录你的好分数账号
                </h2>
            </div>
            <div className="flex flex-col gap-5 self-center">
                <Input label="name" placeholder="用户名/手机号/邮箱" isRequired={true} type={"text"} onValueChange={setName} value={name} />
                <Input label="password" placeholder="密码" isRequired={true} type={"password"} onValueChange={setPassword} value={password} />
                <SelectLoginType type={type} setType={setType} />
                <div className="flex flex-row gap-5 self-center">
                    <Button color={"primary"} onPress={() => setIsSubmit(!isSubmit)}>给我登！</Button>
                </div>
            </div>
        </div>
    )
}