import User from "../../models/userSchema.js"
import passport from "passport";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from "fs/promises";
import { constants } from "fs/promises";
// import multer from "multer";
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY;

// 회원 로그인
const loginUser = async (req, res) => {
    const user = await User.findOne({email : req.body.email});

    if(!user){
        // 사용자가 잘못된 인증을 요청한 401 코드
        return res.status(401).json({
            loginSuccess : false,
            message : "존재하지 않는 이메일입니다."
        })
    }else{
        // 비밀번호 맞는지 확인
        const passwordMatch = req.body.password === user.password;
        if(!passwordMatch){
            return res.status(401).json({
                loginSuccess : false,
                message : "비밀번호를 확인해 주세요."
            })
        }

        const { ...userDatas } = user;
        const { password, ...others } = userDatas._doc;
        console.log(others)

        return res.status(200).json({
            user : others, // 최초 로그인시 유저정보
            loginSuccess : true, // 상태
            message : '로그인이 되었습니다', // 메세지
        })

    }
}

// 회원 가입
const registerUser = async (req, res) => {
    console.log(req.body)
    const user = await User.findOne({email : req.body.email });
    if(user){
        // 중복 회원가입 요청 발생했을 시, 409 코드
        return res.status(409).json({
            registerSuccess : false,
            message : "이미 존재하는 이메일 입니다."
        })
    }else{
        // 유저를 파싱
        let register = {
            email : req.body.email,
            password : req.body.password
        }
        // 유저를 등록
        await User.create(register);
        fs.access(`./upload/profile/${register.email}`, constants.F_OK | constants.W_OK | constants.R_OK)
        .then(() => { // 폴더가 존재하고 모든 권한이 있을 경우
            return Promise.reject('이미 폴더 있음');
        })
        .catch(err => {
            if (err.code === 'ENOENT') { // 폴더가 존재하지 않을 경우에만 발동
                console.log('폴더 없음');
                return fs.mkdir(`./upload/profile/${register.email}`);
            }

            // 폴더가 존재하고 모든 권한이 있을 경우
            // 폴더가 존재하고 권한이 없을 경우
            return Promise.reject(err); 
        })
        .then(() => {
            console.log('폴더 만들기 성공');
            // 여기서 fs는 Promise객체이다. 프로미스를 리턴하기에 다음 then()으로 넘어감
        })
        .catch(err => {
            console.log(err);
        });
        return res.status(200).json({
            registerSuccess : true,
            message : "축하합니다. 회원가입이 완료 되었습니다."
        })
    }
}
const updateUser = async (req, res) => {}
const deleteUser = async (req, res) => {}

// passport Login
const passportLogin = async (req, res, next) => {
    try {
        passport.authenticate('local', (error, user, info) => {
            if(error || !user) {
                res.status(400).json({message : info.reason });
                return
            }
            req.login(user, {session : false}, async (loginError) => {
                if(loginError){
                    res.status(401).send(loginError)
                    localStorage.clear();
                    return;
                }
                // 여기에서 검증된 회원을 처리
                // 검증된 회원에게 jwt토큰 생성 후 전달
                const token = jwt.sign(
                    {
                        email : user.email,
                        issuer : 'sangwon', 
                    },
                    SECRET_KEY,
                    {
                        expiresIn : '24h' //유효시간 24시간
                    }
                )

                // 검증 (선택) 안해도 무관
                // .lean();
                const loginUser = await User.findOne({email : user.email}).lean();
                console.log(loginUser)

                // 민감한 정보를 제거 후 
                // 유저와 토큰을 발급해서 화면으로 보낸다
                const { password, ...others } = loginUser;
                res.status(200).json({
                    user : others,
                    token : token,
                })
            })
            // console.log('authenticate', error, user, info)
        })(req, res, next)
    } catch (error) {
        console.error(error);
        next(error);
    }
}

// 토큰을 이용해서 인증받은 라우팅
const authLocation = async (req, res, next) => {
    try {
    // 인가가 완료된 유저는 req.user 담긴다.
    console.log("authLocation", req.user)
    const {password, ...others} = req.user;
    res.status(200).json({
        message : '자동 로그인 성공',
        ...others._doc,
    });
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const uploadUserImg = async (req, res) => {
    // const upload = multer({ 
    //     dest:`./upload/profile/${}`, // 이미지 업로드 경로
    // })
    console.log(req.body)
    res.status(200).json({
        message : "업로드 성공"
    })
}

export { loginUser, registerUser, updateUser, deleteUser, passportLogin, authLocation, uploadUserImg}