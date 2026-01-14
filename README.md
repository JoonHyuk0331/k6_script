# K6_script
loadtest for matchday api server

테스트 대상 서버와 동일한 JWT_SECRET 키를
.env 파일에 넣고 다음 커맨드를 입력하세요
.env 파일에 공백이 있어선 안됩니다



```
# .env 파일 내용을 읽어서 k6 실행 시 주입
export $(cat .env | xargs) && k6 run 실행할자바스크립트파일.js
```