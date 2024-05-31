"use client"

/*
这是一个被放弃的feature，因为太没用了~
 */

interface subjectList {
    name: string
    score: number
    classRank?: number
    gradeRank?: number
}

interface singleScoreList {
    name: string
    id: number
    subjectList: subjectList[]
    score: number // 总分
    scoreClassRank?: number // 总分班排
    scoreGradeRank?: number
}

// 包含班排、年排、自己成绩
type scoreList = singleScoreList[]

// 根据科目和固定内容生成表头
function genIndexRow(subjectList: subjectList[]) {
    let result = []
    result.push("姓名", "考号")
    for (let i = 0; i < subjectList.length; i++) {
        result.push(subjectList[i].name)
        result.push("班排", "年排")
    }
    result.push("总分", "班排", "年排")
    return result
}

// 根据一条数据生成一行成绩
function genSingleScoreListRow(singleScoreList: singleScoreList) {
    let result = []
    result.push(singleScoreList.name, singleScoreList.id)
    for (let i = 0; i < singleScoreList.subjectList.length; i++) {
        result.push(singleScoreList.subjectList[i].score)
        result.push(singleScoreList.subjectList[i].classRank)
        result.push(singleScoreList.subjectList[i].gradeRank)
    }
    result.push(singleScoreList.score, singleScoreList.scoreClassRank, singleScoreList.scoreGradeRank)
    return result
}

function examScoreReport(scoreList: scoreList) {

    return (
        <div className="grid grid-rows-4 grid-cols-1 grid-flow-row" id="score-report">
            <div className="flex flex-row">
                {genIndexRow(scoreList[0].subjectList).map((item) => {
                    return <div className="font-medium border-1 w-20 text-center flex-shrink-0 flex-grow-0" key={item}>{item}</div>
                })
                }
            </div>
            {scoreList.map((item, index) => {
                let row = genSingleScoreListRow(item)
                return (
                    <div className="flex flex-row" key={index}>
                        {(row.map((item) => {
                                return (
                                    <div className="font-medium border-1 w-20 text-center flex-shrink-0 flex-grow-0"
                                         key={item}>{item}</div>)
                            })
                        )}
                    </div>
                )
            })
            }
        </div>
    )
}

// let scoreList = [
//     {
//         name: "roitium",
//         id: 114,
//         subjectList: [
//             {
//                 name: "math",
//                 score: 22,
//                 classRank: 58,
//                 gradeRank: 11
//             },
//             {
//                 name: "massth",
//                 score: 22,
//                 classRank: 58,
//                 gradeRank: 11
//             },
//             {
//                 name: "3838",
//                 score: 22,
//                 classRank: 58,
//                 gradeRank: 11
//             }
//         ],
//         score: 115,
//         scoreClassRank: 123,
//         scoreGradeRank: 111
//     },
//     {
//         name: "ro",
//         id: 232323,
//         subjectList: [
//             {
//                 name: "math",
//                 score: 22,
//                 classRank: 58,
//                 gradeRank: 11
//             },
//             {
//                 name: "massth",
//                 score: 22,
//                 classRank: 58,
//                 gradeRank: 11
//             },
//             {
//                 name: "3838",
//                 score: 22,
//                 classRank: 58,
//                 gradeRank: 11
//             }
//         ],
//         score: 115,
//         scoreClassRank: 123,
//         scoreGradeRank: 111
//     },
//     {
//         name: "roi",
//         id: 2232314,
//         subjectList: [
//             {
//                 name: "math",
//                 score: 22,
//                 classRank: 58,
//                 gradeRank: 11
//             },
//             {
//                 name: "massth",
//                 score: 22,
//                 classRank: 58,
//                 gradeRank: 11
//             },
//             {
//                 name: "3838",
//                 score: 22,
//                 classRank: 58,
//                 gradeRank: 11
//             }
//         ],
//         score: 115,
//         scoreClassRank: 123,
//         scoreGradeRank: 111
//     }
// ]