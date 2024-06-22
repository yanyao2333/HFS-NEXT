"use client"

import {useEffect, useState} from "react";

export default function SwitchAdvancedMode() {
    let [advancedMode, setAdvancedMode] = useState<boolean>(false);

    useEffect(() => {
        const nowAdvancedMode = localStorage.getItem("advancedMode")
        if (0 === Number(nowAdvancedMode)) {
            setAdvancedMode(false)
        } else {
            setAdvancedMode(true)
        }
    }, []);

    function handleSwitchCheckbox(enabled: boolean) {
        localStorage.setItem("advancedMode", (enabled) ? "1" : "0")
        setAdvancedMode(enabled)
    }

    return (
        <div>
            <p className="font-bold text-xl">AdvancedMode:
                是否显示被好分数隐藏的内容？（例如最高分、平均分、以及...不可说）</p>
            <p className="font-bold text-xl">当前AdvancedMode状态为：{
                (advancedMode) ? <span style={{color: "green"}}>已开启</span> :
                    <span style={{color: "red"}}>未开启</span>}
            </p>
            <br/>
            <input className="h-5 w-5" type="checkbox" id="advancedMode"
                   onChange={(e) => handleSwitchCheckbox(e.target.checked)}
                   checked={advancedMode}/>
            <label htmlFor="advancedMode" className="h-5 w-5">AdvancedMode开关</label>
        </div>
    )
}