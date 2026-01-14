// 답없는 금쪽이 api 사람만들기 프로젝트
// GET /api/v1/competitions/{competitionId}/leagues/{leagueId}/statistics
import { createAccessToken } from "./jwt_util.js";
import http from 'k6/http'
import {check,sleep} from 'k6'

const BASE_URL = __ENV.BASE_URL
//jwt 관련
const USER_ID = __ENV.USER_ID
const USER_EMAIL = __ENV.USER_EMAIL
const USER_ROLE = __ENV.USER_ROLE
const JWT_SECRET = __ENV.JWT_SECRET

let competitionId = 6
let leagueId = 4
const getStatisticsURL = `${BASE_URL}/api/v1/competitions/${competitionId}/leagues/${leagueId}/statistics`

//부하 옵션
export const options = {

    // 부하를 생성하는 단계(stages)를 설정
    stages: [
    // 10분에 걸쳐 vus(virtual users, 가상 유저수)가 10에 도달하도록 설정
        { duration: '5m', target: 10 }
    ],
};

//초기 셋팅
export function setup(){
    const accessToken = createAccessToken(USER_ID, USER_EMAIL, USER_ROLE, JWT_SECRET);
    return { token: accessToken }
}

export default function(data){

    // HTTP 헤더 설정 (JWT 토큰 포함)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
    };

    const param = { headers }
    const url= getStatisticsURL 
    const res = http.get(url,param)

    console.log(res.json())
}