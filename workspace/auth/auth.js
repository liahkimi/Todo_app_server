import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import User from "../models/userSchema.js";
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// passport 인증 기능 설정
// username, password
const passportConfig = {
    usernameField : 'email',
    passwordField : 'password',
}

// done(error, user, info)
const passportVerify = async (email, password, done) => {
    try{
        // 유저 아이디로 일치하는 유저의 데이터를 검색
        const user = await User.findOne({ email : email });
        if(!user){
            return done(null, false, { message : '존재하지 않는 사용자 입니다.'})
        }

        const passwordMatch = password == user.password;
        if(!passwordMatch){
            return done(null, false, { message : '올바르지 않은 비밀번호입니다.'})
        }

        // 비밀번호가 같다면 유저 데이터를 객체로 전송
        return done(null, user);

    } catch (error){
        console.error(error);
        done(error);
    }
}

// 인증이 끝난 사용자에게 jwt를 통한 인가
const JWTconfig = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(), // 화면쪽에서 token header
    secretOrKey : SECRET_KEY,
}

// JWT전략 추가
const JWTVerify = async (jwtPayload, done) => {
    try{
        // payload의 email값으로 유저의 데이터를 조회한다.
        const user = await User.findOne({email : jwtPayload.email});
        if(!user){
            done(null,false, {reason : '올바르지 않은 인증 정보입니다.'})
        }
        return done(null, user);
    } catch(error){
        console.error(error)
        done(error)
    }
}

// 전략을 사용하여서 검증하는 로직을 만들어준다.
// LocalStrategy(옵션, 내가 만든 로직)
const initializePassport = () => {
    passport.use('local', new LocalStrategy(passportConfig, passportVerify))
    passport.use('jwt', new JWTStrategy(JWTconfig, JWTVerify))
}

export { initializePassport }