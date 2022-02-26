MYSQL과 mongoDB를 express 프로젝트에 적용시키면 어떻게 다른지 보기 위한 코드입니다.

docker-compose.yml로 컨테이너를 올려서 api를 실행해볼 수 있습니다

mongodb 폴더는 도커 컨테이너를 켜면 바로 실행되지만, mysql 폴더는 설명을 위해서 web 컨테이너는 켜고 나서 접속한 후에 작업하도록 만들어져 있습니다.

- mongodb 실제로 작동 시키는 법
  1. 도커 켜기: docker-compose up -d
  2. 새로운 터미널을 켜서 밑의 `API 실행해보기`를 해본다.
- mongodb 도커 끄는 법: docker-compose down
- mysql 실제로 작동 시키는 법
  1. 도커 켜기: docker-compose up -d
  2. 도커 컨테이너 접속하기: docker-compose exec web bash
  3. 패키지 설치하기: npm i
  4. DB 마이그레이션 하기: node migrations/create_note
  5. 서버 켜기: npm start
  6. 새로운 터미널을 켜서 밑의 `API 실행해보기`를 해본다.
  7. 컨테이너를 나올때는 exit이라고 치면 된다.
- mysql 도커 끄는 법: docker-compose down

# API 실행해보기
## 생성
```
curl -X POST -H "Content-Type: application/json" -d "{\"title\": \"first note\", \"content\": \"hello world\"}" http://localhost:3000/api/notes
```
## 전체조회
```
curl -H "Content-Type: application/json" http://localhost:3000/api/notes
```
혹은 다음 URL 접속
http://localhost:3000/api/notes

## 일부 조회
```
curl -H "Content-Type: application/json" http://localhost:3000/api/notes/:id
```
혹은 다음 URL 접속

http://localhost:3000/api/notes/:id

## 수정
```
curl -X PUT -H "Content-Type: application/json" -d "{\"title\": \"edited note\", \"content\": \"hello world\"}" http://localhost:3000/api/notes/:id
```

# 삭제
```
curl -X DELETE -H "Content-Type: application/json" http://localhost:3000/api/notes/:id
```
