## 4. Docker Compose


### 4-1. What is Docker Compose?
  1) 여러 컨테이너들의 실행을 한번에 관리해주는 Docker Management Tool
  2) Fig라는 이름으로 개발된 관리 도구
  3) 보통 시스템은 여러 컨테이너들 간에 서로 통신과 연동으로 구축된다.

#### 1. __practice01: Docker Compose 명령으로 여러 컨테이너 실행__
  1) Create Directory /docker-practices/docker-basics/hellodocker-compose
  2) Write docker-compose.yml
     ```yml
     version: "3"
     services:
        hellodocker:
           image: kickscar/hellodocker
           ports:
              - 3030:3000     
     ```
  3) Run Containers
     ```bash
     docker-compose up -d
     ``` 
     
     -d : daemon(background) 실행
  4) Verify
     ```bash
     docker container ls
     ```
  5) Test
     ```bash
     curl 'http://localhost:3030'
     ```
  6) Stop all Containers
     ```bash
     $ docker-compose [start|stop|restart]
     $ docker conatiner l -a
     ```
  7) Start or Stop or Restart all Container
     ```bash
     $ docker-compose [start|stop|restart]
     $ docker conatiner l -a
     ```
     
#### 2. __practice02: 이미지 빌드와 함께 여러 컨테이너 실행__
  1) Create Directory /docker-practices/docker-basics/hellodocker-compose-build
  2) Must be Dockerfile, server.js in Directory
  2) Write docker-compose.yml
     ```yml
     version: "3"
     services:
        hellodocker:
           build: .
           ports:
              - 3030:3000     
     ```
  3) Run Containers
     ```bash
     docker-compose up -d --build
     ``` 
     -d : daemon(background) 실행  
     --build : 강제 빌드(forced)
  4) Verify
     ```bash
     docker container ls
     ```
  5) Test
     ```bash
     curl 'http://localhost:3030'
     ```


### 4-2. 실전: 여러 젠킨스 컨테이너 실행하기
