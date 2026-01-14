import { createAccessToken } from "./jwt_util.js";
import http from 'k6/http'
import {check,sleep} from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://13.125.253.54';
//jwt 관련
const USER_ID = __ENV.USER_ID || '2';
const USER_EMAIL = __ENV.USER_EMAIL || 'k6k6k6k6@aaa.com';
const USER_ROLE = __ENV.USER_ROLE || 'SUPER_ADMIN';
const JWT_SECRET = __ENV.JWT_SECRET

const TEAM_ID= '1'

const getTeamsURL = BASE_URL+'/open-api/v1/teams'

export function setup(){
    const accessToken = createAccessToken(USER_ID, USER_EMAIL, USER_ROLE, JWT_SECRET);
    console.log("엑세스 토큰 생성 완료"+accessToken)
    return { token: accessToken }
}

export default function(data){

    // HTTP 헤더 설정 (JWT 토큰 포함)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
    };

    const param = { headers }
    const url= `${BASE_URL}/api/v1/teams/${TEAM_ID}/members/stats`

    console.log("요청 URL:", url);                                                                                                                                                
    console.log("Authorization 헤더 (일부):", headers.Authorization.substring(0, 80) + "...");   

    const res = http.get(url,param)

    console.log(res.json())
}