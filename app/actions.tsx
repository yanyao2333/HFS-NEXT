"use server";
import {UserSnapshot} from "@/types/exam";
import {fillTemplate} from "@/utils/string";

export async function fetchHFSApi(
  url: string,
  init: {
    token: string,
    method: "POST" | "GET",
    // Post请求需要发送的json数据
    postBody?: Object,
    // Get请求需要的param，会预先解析并填充到url中
    getParams?: Object
  },
): Promise<{ payload?: any; ok: boolean; errMsg?: string }> {
  try {
    const parsedUrl = fillTemplate(url, init.getParams);
    const headers = {
      "Content-Type": "application/json",
      "Hfs-token": init.token,
    };
    const options: RequestInit = {
      headers,
      method: init.method,
    };
    if (init.postBody) {
      options.body = JSON.stringify(init.postBody);
    }

    const res = await fetch(parsedUrl, options);
    if (!res.ok) {
      return {errMsg: res.statusText, ok: false};
    }

    const json_data = await res.json();
    if (json_data["code"] === 0) {
      return {payload: json_data["data"], ok: true};
    } else {
      return {ok: false, errMsg: json_data["msg"]};
    }
  } catch (e) {
    return {ok: false, errMsg: String(e)};
  }
}

export async function validateTokenAction(
  token: string,
): Promise<{ errMsg?: string; tokenExpired: boolean }> {
  const res = await fetch(
    "https://hfs-be.yunxiao.com/v2/user-center/user-snapshot",
    {
      headers: {
        "Content-Type": "application/json",
        "Hfs-token": token,
      },
      method: "GET",
    },
  );
  if (!res.ok) {
    return {errMsg: res.statusText, tokenExpired: false};
  }
  const json_data = await res.json();
  if (json_data["code"] === 3001) {
    console.log("登录失效");
    return {tokenExpired: true};
  } else if (json_data["code"] === 0) {
    return {tokenExpired: false};
  } else {
    return {tokenExpired: false, errMsg: json_data["msg"]};
  }
}

export async function getExamsList(
  token: string,
): Promise<{ examList?: []; ok: boolean; errMsg?: string }> {
  const res = await fetch(
    "https://hfs-be.yunxiao.com/v3/exam/list?start=0&limit=10",
    {
      headers: {
        "Content-Type": "application/json",
        "Hfs-token": token,
      },
      method: "GET",
    },
  );
  if (!res.ok) {
    // throw Error("Login failed. Error: " + res.statusText)
    return {errMsg: res.statusText, ok: false};
  }

  const json_data = await res.json();
  // console.log(json_data)
  if (json_data["code"] === 0) {
    return {examList: json_data["data"]["list"], ok: true};
  } else {
    // throw Error("Login failed. Error: " + json_data["msg"]);
    return {ok: false, errMsg: json_data["msg"]};
  }
}

export async function getUserSnapshotAction(token: string): Promise<{
  payload?: UserSnapshot;
  ok: boolean;
  errMsg?: string;
}> {
  const res = await fetch(
    "https://hfs-be.yunxiao.com/v2/user-center/user-snapshot",
    {
      headers: {
        "Content-Type": "application/json",
        "Hfs-token": token,
      },
      method: "GET",
    },
  );
  if (!res.ok) {
    return {errMsg: res.statusText, ok: false};
  }
  const json_data = await res.json();
  if (json_data["code"] === 0) {
    return {payload: json_data["data"], ok: true};
  } else {
    // throw Error("Login failed. Error: " + json_data["msg"]);
    return {ok: false, errMsg: json_data["msg"]};
  }
}
