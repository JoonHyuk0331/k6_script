import http from 'k6/http'
import {check,sleep} from 'k6'

const serverIP = '13.125.253.54'
const getTeamsUrl = 'http://'+serverIP+'/open-api/v1/teams'

export default function(){

    const page=0
    const size=5
    const res = http.get(getTeamsUrl+`?page=${page}&size=${size}`)
    const result=res.json()

    console.log(result)
}