"use server"

export async function getExamsList(token: string): Promise<[]> {
    const res = await fetch("https://hfs-be.yunxiao.com/v3/exam/list?start=0&limit=10", {
        "headers": {
            "Content-Type": "application/json",
            "Hfs-token": token
        },
        "method": "GET"
    });
    if (!res.ok) {throw Error("Login failed. Error: " + res.statusText);}
    const json_data = await res.json()
    console.log(json_data)
    if (json_data["code"] === 0) {
        return json_data["data"]["list"]
    }else {
        throw Error("Login failed. Error: " + json_data["msg"]);
    }
}