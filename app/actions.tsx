"use server";
import { fillTemplate } from "@/utils/string";

export async function fetchHFSApi(
	url: string,
	init: {
		token: string;
		method: "POST" | "GET";
		// Post请求需要发送的json数据
		postBody?: Object;
		// Get请求需要的param，会预先解析并填充到url中
		getParams?: Object;
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
			return { errMsg: res.statusText, ok: false };
		}

		const json_data = await res.json();
		if (json_data.code === 0) {
			return { payload: json_data.data, ok: true };
		}
		return { ok: false, errMsg: json_data.msg };
	} catch (e) {
		return { ok: false, errMsg: String(e) };
	}
}
