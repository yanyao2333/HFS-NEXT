"use server"

export async function loginAction(name: string, passwd: string, role: number): Promise<string> {
    // console.log("login action", name, passwd, role)
    const res = await fetch("https://hfs-be.yunxiao.com/v2/users/sessions", {
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({
            "loginName": name,
            "password": btoa(passwd),
            "roleType": role,
            "loginType": 1,
            "rememberMe": 2
        }),
        "method": "POST"
    });
    if (!res.ok) {throw Error("Login failed. Error: " + res.statusText);}
    const json_data = await res.json()
    // console.log(json_data)
    if (json_data["code"] === 0) {
        return json_data["data"]["token"]
    }else {
        throw Error("Login failed. Error: " + json_data["msg"]);
    }
}

export async function ValidateTokenAction(token: string): Promise<boolean> {
    const res = await fetch("https://hfs-be.yunxiao.com/v2/user-center/user-snapshot", {
        "headers": {
            "Content-Type": "application/json",
            "Hfs-token": token
        },
        "method": "GET"
    });
    if (!res.ok) {throw Error("Validate token failed. Error: " + res.statusText);}
    const json_data = await res.json()
    // console.log(json_data)
    if (json_data["code"] === 3001) {
        console.log("登录失效")
        return false
    }else if (json_data["code"] === 0) {
        return true
    }else {
        throw Error("Validate token failed. Error: " + json_data["msg"]);
    }
}