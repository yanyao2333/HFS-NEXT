export function formatTimestamp(timestamp: number) {
    // 创建一个新的Date对象，使用时间戳作为参数
    const date = new Date(timestamp);

    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    let day: string | number = date.getDate();

    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    return year + "-" + month + "-" + day;
}
