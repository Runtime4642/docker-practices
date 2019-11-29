## 2. Docker Image & Container

#### 2-1. 컨테이너로 애플리케이션 실행하기
1. __도커 컨테이너을 사용하는 기본 과정__
    1) 도커 이미지 만들기(이미지 빌드)
        - 실행할 서버 애플리케이션을 작성한다.
        - 서버 애플리케이션의 실행환경 및 빌드환경 설정(Dockerfile)
        - 이미지 빌드
    2) 컨테이너 실행
    3) 포트 포워딩을 통해 컨테이너안의 서버 애플리케이션 접근(애플리케이션 사용)

2. __초간단 Web Server hellodocker(node.js) 작성__
    1) 실습 디렉토리 hellodocker 만들기
        
        <img src="http://assets.kickscar.me:8080/markdown/docker-practices/docker-basics/20002.png" width="800px" />
        <br>
    
    2) server.js 작성
    
        ```js
             var port = 3000;
             var http = require('http');
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
        - 실행화면

            <img src="http://assets.kickscar.me:8080/markdown/docker-practices/docker-basics/20002.png" width="800px" />
            <br>
        
        - 클라이언트 테스트
        
            <img src="http://assets.kickscar.me:8080/markdown/docker-practices/docker-basics/20003.png" width="800px" />
            <br>
                
        
3. __Dockerfile 작성__
    1) Dockerfile
        
        ```dockerfile
            FROM node:10-alpine 
             
            RUN  mkdir /hellodocker
            COPY server.js /hellodocker
             
            CMD  node /hellodocker/server.js
        ```
        - FROM : docker image의 base image를 지정  
        - RUN  : docker image를 빌드핧 때 container 안에서 실행할 명령을 정의  
        - COPY : host machine의 file이나 directory를 container 안으로 복사 (cf. ADD Intruction 참고)  
        - CMD  : docker container를 실행할 때 container 안의 실행 할 process를 지정 (cf. CMD 명령 오버라이드 참고)  
        - 다른 주요 Instructions
            LABEL :  
            ENV   :  
            ARG   :  

4. __Docker Image 빌드 및 확인__

    <img src="http://assets.kickscar.me:8080/markdown/docker-practices/docker-basics/20004.png" width="800px" />
    <br>

    1) 옵션 -t를 사용하여 이미지 이름을 지정한다. 지정하지 않으면 해시값으로 이미지를 구분해야하기 때문에 반드시 지정해야 하는 옵션이다.
    2) 이미지명 충돌을 피하기 위해 /와 함께 namespace를 사용하는 것이 좋다.
    3) :와 함께 태그명을 지정하는데 생략하면 자동으로 latest가 붙는다.
    4) ls 명령으로 방금 빌드된 이미지 kickscar/helloworld 가 성공적으로 빌드된 것을 확인할 수 있다.

5. __Docker Container 실행/정지 및 상태확인__

    <img src="http://assets.kickscar.me:8080/markdown/docker-practices/docker-basics/20004.png" width="800px" />
    <br>

    1) 컨테이너 실행 시, 옵션 -d를 사용하여 백그라운드(Daemon) 실행을 한다.(기본은 foreground 실행이다.)
    2) 옵션 -p는 port forwarding 옵션이다.
        - node가 실행한 간단 Web Server는 컨테이너 안에서 실행된다.
        - 컨테이너는 하나의 독립된 머신이다.
        - 컨테이너 내부에서 3000번으로 연결을 요청하면 연결이 되겠지만 컨테이너 밖에서는 불가능하다.
        - 컨테이너 밖으로부터 오는 요청을 컨테이너 안의 애플리케이션으로 전달하기 위해 포트 포워딩을 사용해야 한다. 
        - 호스트포트:컨터이너포트 형식으로 지정하면 된다.
    3) 실행된 컨테이너의 상태를 확인하기 위해 ps명령을 사용한다.
    4) 컨테이너 안의 서버 애플리케이션은 3000번 포트로 Listen 때문에 종료되지 않는다. 따라서 컨테이너는 계속 실행 중이다.
    5) 컨테이너 실행과 컨테이너 안의 서버 애플리케이션 실행 그리고 포트포워딩 설정등을 확인하기 위해 8080로 접속을 한다.
    6) 실행 중인 컨테이너를 정지 하기 위해서는 stop 명령을 사용하고 정지하려는 컨테이너 아이디를 뒤에 명시한다.
  

#### 2-2. Docker Image 기본작업(Basic Operation)
1. __이미지 관련 서브명령어 확인__
    1) help
        ```bash
            $ docker image --help
        ```

2. __이미지 빌드__

    ```bash
        $ docker image build -t 이미지명[:태그명] Dockerfile경로
    ```

    1) -f : Dockerfile의 다른 이름을 사용할 때  
    2) --pull: 베이스 이미지를 빌드할 때마다 새롭게 받아온다. (--pull=true)
     
3. __이미지 검색__

    ```bash
        $ docker search centos7 --limit 10
    ```
     
4. __이미지 내려받기__

    ```bash
        $ docker image pull 레포지토리명[:태그명]
    ``` 

    ```bash
        $ docker image pull kickscar/helloworld
    ``` 
     
5. __이미지 목록__

    ```bash
        $ docker image ls
    ```
   
    1) -a: 자세하게, 이름과 태그가 없는 이미지까지 출력
     
6. __이미지 ID에 태그 부여하기__
    
    ```bash
        $ docker tag kickscar/hellodocker:latest kickscar/echo:latest
    ```
     
7. __이미지를 외부에 공개하기(Docker Hub 등록)__
    
    ```bash
        $ docker image push kickscar/hellodocker:latest
    ```
    참고) 도커허브 로그인    
    ```bash
        $ docker login -u kickscar -p
    ```


#### 2-3. Docker Container 기본작업(Basic Operations)

1. __Container 생명주기(Life Circle)__

    [ 실행 ] <-> [ 정지 ] -> [ 파기 ]

2. __컨테이너 생성 및 실행__
    
    ```bash
        $ docker container run [options] IMAGE_ID [명령] [명령인자...]
    ``` 
    
    1) -i : 컨테이너 표준 입력과의 연결을 그대로 유지, **컨테이너 셀에 들어가 명령을 작업**할 수 있다  
    2) -t : 터미널 활성화
    3) --rm : 컨테이너를 종료할 때 컨테이너를 파기
    4) -v : 호스트와 컨테이너 간에 디렉토리나 파일을 공유하기 위해 사용
    5) -d : 데몬실행 시 백그라운드 실행
    6) -p : 포트 포워딩

3. __컨테이너 실행 후, |정지|재시작|시작|__
    ```bash
        $ docker container [start|stop|restart]
    ```

4. __명령 및 명령인자__
    1) 사용예1
    
        ```bash
            $ docker image pull alpine:3.7
            $ docker container run -it alpine:3.7
            / # ls
            bin    dev    etc    home   lib    media  mnt    proc   root   run    sbin   srv    sys    tmp    usr    var
            / # exit
            $
        ```
       
    2) 사용예2 :  명령과 명령인자로 library/alpone:3.7 CMD 인스트럭션 /bin/sh 오버라이딩 하기  
    
        ```bash
            $ docker container run -it alpine:3.7 ifconfig -a
        ```
       
5. __컨테이너 이름 붙이기__

    ```bash
        $ docker container run -d -p 3000:3000 --name kickscar-echo kickscar/hellodocker
        $ docker container ps
        $ docker container stop kickscar-echo
        $ docker container ps
    ```
       
6. __컨테이너 목록__

    ```bash
        $ docker container ls [options]
    ```
    
    1) -q : 컨테이너 아이디만 추출
    2) --filter: 목록필터  
            
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
          
    3) -a : 종료된 컨테이너를 포함한 컨테이너 목록 전부(all) 볼 수 있다.

7. __컨테이너 정지__
    
    ```bash
        $ docker container stop [CONTAINER-ID|CONTAINER-NAME]
    ```
     
8. __컨테이너 재시작__

    ```bash
        $ docker container restart [CONTAINER-ID|CONTAINER-NAME]
    ```
     
9. __컨테이너 파기__
  1) 기본 명령
     ```bash
     $ docker container rm [CONTAINER-ID|CONTAINER-NAME] (여러개도 가능)
     ```
  2) Options     
     -f  
     실행중인 컨터이너 정지와 함께 파기할 때!

10. __표준 출력 연결하기__
    
    ```bash
        $ docker container logs [options] [CONTAINER-ID|CONTAINER-NAME]
    ```
    
    1) -f : 새로 출력되는 내용을 계속 출력한다.

11. __실행중인 컨테이너에서 명령 실행__
    
    ```bash
        $ docker container run -d -p 3000:3000 --rm --name kickscar-echo kickscar/hellodocker
        $ docker container exec kickscar-echo pwd
        $ docker container exec -it kickscar-echo sh  -> container에서 쉘 실행시키기
    ```
     
12. __실행중인 컨테이너로 파일 복사__

    ```bash
        $ touch dummy.txt
        $ docker container cp ./dummy.txt kickscar-echo:/
        $ docker container exec ls
        $ docker container exec kickscar-echo rm -f dummy.txt
        $ docker container exec ls
    ``` 
     

#### 2-4. Miscellaneous Operation

1. __실행 중이 아닌 모든 컨테이너 파기__
    
    ```bash
        $ docker container prune
    ```
      
2. __tag가 붙지 않은 dagling image 삭제__

    ```bash
        $ docker image prune
    ```
   
3. __사용하지 않은 모든 리소스(이미지,컨테이너,볼륨,네트워크..) 일괄삭제__

    ```bash
        $ docker system prune
    ```
   
4. 컨테이너 상태 모니터링
    
    ```bash
        $ docker container stats [대상 컨테이너 아이디...]
    ```