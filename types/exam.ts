export interface UserSnapshot {
  linkedStudent: {
    studentName: string;
  };
}

export interface ExamObject {
  detail?: ExamDetail;
  rank?: ExamRankInfo;
}

export type PapersObject = { [paperId: string]: Paper }

// 包含在试卷详情中的每科粗略信息
export interface Paper {
  paperId: string;
  pid: string;
  name: string;
  subject: string;
  manfen: number;
  score: number;
  // 1为优 2为正常 可能3为劣
  weakAdvantageStatus: number;
  rank?: PaperRankInfo;
  paperImages?: string[];
}

// 获取到的试卷详情
export interface ExamDetail {
  examId: number;
  name: string;
  time: number;
  manfen: number; // 还有一个manfenBeforeGrading，我猜是赋分后成绩，无所谓，咱们不要
  score: number;
  classStuNum: number;
  gradeStuNum: number;
  classRank: number;
  gradeRank: number;
  classDefeatRatio: number;
  gradeDefeatRatio: number;
  papers: Paper[];
  classRankPart: string;
  gradeRankPart: string;
}

// 获取到的考试排名信息
export interface ExamRankInfo {
  highest: {
    class: number;
    grade: number;
  };
  avg: {
    class: number;
    grade: number;
  };
  rank: {
    class: number;
    grade: number;
  };
  // 这个是人数
  number: {
    class: number;
    grade: number;
  };
  defeatRation: {
    class: number;
    grade: number;
  };
  rankPart: {
    class: string;
    grade: string;
  };
}

// 单科的排名信息
export interface PaperRankInfo {
  highest: {
    class: number;
    grade: number;
  };
  avg: {
    class: number;
    grade: number;
  };
  rank: {
    class: number;
    grade: number;
  };
  // 这个是人数
  number: {
    class: number;
    grade: number;
  };
  defeatRatio: {
    class: number;
    grade: number;
  };
  rankPart: {
    class: string;
    grade: string;
  };
}
