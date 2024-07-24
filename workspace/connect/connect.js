// mongodb+srv://app:1234@app.yk55qkd.mongodb.net/

//⭐connect 함수를 정의하여,호출하면 MongoDB와 연결을 시도하고, 
// 성공 또는 실패 여부에 따라 적절한 메시지를 콘솔에 출력하게 하는 로직


// mongoose 모듈 import
// mongoose는 MongoDB와 쉽게 상호작용할 수 있도록 도와주는 ODM(Object Data Modeling) 라이브러리
import mongoose from "mongoose";

// mongodb 연결
const connect_url = `mongodb+srv://app:1234@app.yk55qkd.mongodb.net/`;

// mogodb와 연결시키는 connect함수 정의
const connect = () => {
    // 디버그모드 설정 = 노드의 서버가 배포환경이 아닐때,
    if(process.env.NODE_ENV !== "production"){
        // mongoose의 debug-mode 활성화
        // => debug-mode는 MongoDB와의 상호작용에 대한 자세한 정보를 콘솔에 출력합니다.
        mongoose.set("debug", true);
    }
    // mongoose.connect 메서드를 사용하여 MongoDB에 연결을 시도
    mongoose
        .connect(connect_url, {
            // connect_url과 데이터베이스 이름(dbName: "express")을 설정
            dbName : "express"
    
        })
        .then(() => {
            //연결이 성공하면 콘솔에 "Connected to MongoDB" 메시지를 출력
            console.log('Connected to MongoDB')
        })
        .catch((err) => {
            // 연결이 실패하면 콘솔에 "Connected fail to MongoDB" 메시지와 함께 에러를 출력
            console.error('Connected fail to MongoDB')
            console.log(err);
        })

}

export default connect;