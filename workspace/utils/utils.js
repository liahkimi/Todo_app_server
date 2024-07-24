// moment라이브러리 설치 > yarn add moment
import moment from "moment";

// 현재 시간

const getCurrentTime = () => {
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    return now;
}
export { getCurrentTime}