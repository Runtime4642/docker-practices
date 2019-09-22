## 2. Deploy Docker Container


### 2-1. Execute Application as Container

#### 1. __Create Simple Echo Server with Node.js__
  1) Create Directory /docker-practices/docker-basics/hellodocker
  2) Write server.js
     ```js
     var http = require('http');
     
     var port = 3000;
     
     var server =  http.createServer( function( request, response ) {
         console.log( "request[" + request.url + "] received");
         response.writeHead( 200, {
             "Content-Type": "text/html"
         });
         response.end(  "Hello Docker\n"  );
     
     } );
     
     server.listen( port, function() {
         var addr = server.address();
         var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
         console.debug('Listening on ' + bind);
     });
     ```

#### 2. __Write Dockerfile__
  1) Dockerfile
     ```
     FROM node:10-alpine 
     
     RUN  mkdir /hellodocker
     COPY server.js /hellodocker
     
     CMD  node /hellodocker/server.js
     ``` 
  2) Instruction  
     
     FROM : docker image의 base image를 지정  
     RUN  : docker image를 빌드핧 때 container 안에서 실행할 명령을 정의  
     COPY : host machine의 file이나 directory를 container 안으로 복사 (cf. ADD)  
     CMD  : docker container를 실행할 때 container 안의 실행 할 process를 지정 (cf. CMD 명령 오버라이드)  

  3) Other Instructions

     LABEL :  
     ENV   :  
     ARG   :  

#### 3. __Build Docker Image__
  1) Build  
     ```bash
     $ docker image build -t kickscar/hellodocker:latest .
     ```

  2) Options  
     -t :   
     이미지 이름 (tag명 생략시 자동으로 latest가 붙음, 생략시 해시값으로 이미지를 구분해야하기 때문에 말이 안된다)  
     이미지명 충돌을 피하기 위해 / 로 시작하는 namespace를 사용하는 것이 좋다.

  3) Verify  
     ```bash
     $ docker image ls
     ```

#### 4. __Run Docker Container__
  1) Run    
     ```bash
     $ docker container run -t -p 3000:3000 kickscar/hellodocker
     ```
  2) Options  
     -d: daemon, background 실행 (기본적으로 foreground 실행)  
     -p: port forwarding
  
  3) Verify Running
     ```bash
     $ docker container ps
     ```
  4) Stop Running Container 
     ```bash
     $ docker container stop [container id]
     ```
  5) Verify Status
     ```bash
     $ curl http://localhost:3000/
     ```


### 2-2. Working with Docker Image

#### 1. __이미지 관련 서브명령어 확인__
  1) Help    
     ```bash
     $ docker image --help
     ```
#### 2. __이미지 빌드__
  1) Build
     ```bash
     $ docker image build -t 이미지명[:태그명] Dockerfile 경로
     ```
  2) Options  
     -f  
     Dockerfile의 다른 이름을 사용할 때  
      
     --pull  
     베이스 이미지를 빌드시 매번 새롭게 받아온다. (--pull=true)
#### 3. __이미지 검색__
  1) 검색 예  
     ```bash
     $ docker search centos7 --limit 10
     ```
#### 4. __이미지 내려받기__
  1) 명령
     ```bash
     $ docker image pull 레포지토리명[:태그명]
     ``` 
  2) 예
     ```bash
     $ docker image pull kickscar/helloworld
     ``` 
#### 5. __이미지 목록__
  1) 기본 사용 예
     ```bash
     $ docker image ls
     ```
  2) Options  
     -a  
     자세하게, 이름과 태그가 없는 이미지까지 출력
#### 6. __이미지 ID에 태그 부여하기__
  1) 기본 사용 예
     ```bash
     $ docker tag kickscar/hellodocker:latest kickscar/echo:latest
     ```
##### 7. __이미지를 외부에 공개하기(Docker Hub 등록)__
  1) 기본 사용 예
     ```bash
     $ docker image push kickscar/hellodocker:latest
     ```
  2) 허브 로그인
     ```bash
     $ docker login -u kickscar -p
     ```


#### 2-3. 도커 컨테이너 다루기

##### 1. __Life Circle of Container__
  1) 상태 
      
     [ 실행 ] <-> [ 정지 ] -> [ 파기 ]

##### 2. __컨테이너 생성 및 실행__
  1) 기본 명령
     ```bash
     $ docker container run [options] IMAGE_ID [명령] [명령인자...]
     ``` 
  2) Options  
     
     -i  
     컨테이너 표준 입략과의 연결을 그대로 유지, 컨테이너 쪽 셀에 들어가 명령을 실행할 수 있다  

     -t  
     터미널 활성화

     --rm  
     컨테이너를 종료할 때 컨테이너를 파기

     -v  
     호스트와 컨테이너 간에 디렉토리나 파일을 공유하기 위해 사용

     -d  
     데몬실행 시 백그라운드 실행

     -p  
     포트 포워딩

##### 3. __컨테이너 실행 후, 정지|재시작|시작__
  1) 기본 명령
     ```bash
     $ docker container [start|stop|restart]
     ```

##### 4. __명령 및 명령인자__
  1) 사용 예
     ```bash
     $ docker image pull alpine:3.7
     $ docker container run -it alpine:3.7
     ```
  2) 사용 예2 :  
     명령과 명령인자로 library/alpone:3.7 CMD 인스트럭션 /bin/sh 오버라이딩 하기  
     ```bash
     $ docker container run -it alpine:3.7 ifconfig -a
     ```
##### 5. __컨테이너 이름 붙이기__
  1) 사용 예
     ```bash
     $ docker container run -d -p 3000:3000 --name kickscar-echo kickscar/hellodocker
     $ docker container ps
     $ docker container stop kickscar-echo
     $ docker container ps
     ```
##### 6. __컨테이너 목록__
  1) 기본 명령
     ```bash
     $ docker container ls [options]
     ```
  2) Options  
  
     -q   
     컨테이너 아이디만 추출
     ```bash
     $ docker container ls -q
     ```
     --filter: 목록필터  
     
     예) 컨테이너 이름으로  
     ```bash
     $ docker container ls --filter='name=kickscar-echo'
     ```
     예) 이미지 이름으로   
     ```bash
     $ docker container ls --filter='ancestor=kickscar/hellodocker' 
     ```

     예) 정지된 컨테이너만  
     ```bash
     $ docker container ls --filter='status=exited'
     ```

     -a  
     종료된 컨테이너를 포함한 컨테이너 목록 전부(all) 볼 수 있다.

##### 7. __컨테이너 정지__
  1) 기본 명령
     ```bash
     $ docker container stop [CONTAINER-ID|CONTAINER-NAME]
     ```
     
##### 8. __컨테이너 재시작__
  1) 기본 명령
     ```bash
     $ docker container restart [CONTAINER-ID|CONTAINER-NAME]
     ```
     
##### 9. __컨테이너 파기__
  1) 기본 명령
     ```bash
     $ docker container rm [CONTAINER-ID|CONTAINER-NAME] (여러개도 가능)
     ```
  2) Options     
     -f  
     실행중인 컨터이너 정지와 함께 파기할 때!

##### 10. __표준 출력 연결하기__
  1) 기본 명령
     ```bash
     $ docker container logs [options] [CONTAINER-ID|CONTAINER-NAME]
     ```
  2) Options   
     -f  
     새로 출력되는 내용을 계속 출력한다.

##### 11. __실행중인 컨테이너에서 명령 실행__
  1) 사용예
     ```bash
     $ docker container run -d -p 3000:3000 --rm --name kickscar-echo kickscar/hellodocker
     $ docker container exec kickscar-echo pwd
     $ docker container exec -it kickscar-echo sh  -> container에서 쉘 실행시키기
     ```
     
##### 12. __실행중인 컨테이너로 파일 복사__
  1) 사용예
     ```bash
     $ touch dummy.txt
     $ docker container cp ./dummy.txt kickscar-echo:/
     $ docker container exec ls
     $ docker container exec kickscar-echo rm -f dummy.txt
     $ docker container exec ls