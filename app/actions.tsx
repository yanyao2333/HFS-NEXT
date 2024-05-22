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
            "roleType": 2,
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