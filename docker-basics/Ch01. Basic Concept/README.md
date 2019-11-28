## 1. Basic Concepts


#### 1-1. 용어정리
1. __docker__
    1) "컨테이너형 가상화 기술" 구현을 위한 플랫폼이 되는 애플리케이션
    2) docker 애플리케이션을 오퍼레이션 하기 위한 CLI(Command Line Instruction, CLI)
    3) 보통, docker를 설치하면 1), 2)가 기본적으로 설치된다.

2. __컨테이너형 가상화 기술__ 
    1) 컨테이너형 가상화 vs 호스트 운영체제 가상화
       - VirtualBox, VMWare와 같은 가상화 소프트웨어를 사용하여 하드웨어를 에뮬레이션하는 방법으로 운영체제의 완벽한 동작을 재현하는 방식을 "호스트 운영체제 가상화"라 한다.
       - 가상화 소프트웨어 없이 운영체제의 리소스와 완전히 격리된 가상운영체제를 "컨테이너"라 한다.
       - 도커는 컨테이너형 가상화 기술을 쉽고 편리하게 사용하여 컨테이너를 만들고 사용하게 해주는 플랫폼이다. 
       - 다양하고 다수의 애플리케이션 운용을 위한 운영체제의 완벽한 가상화가 필요하다면 "호스트 운영체제 가상화"가 필요하다.
       - 특정 애플리케이션의 실행환경만 필요하다면 상대적으로 그 오버헤드가 적은 "컨테이너형 가상화"을 사용한다. 즉, 도커에서 컨테이너를 만들고 실행하면 된다.
    3) 도커에서 컨테이너형 가상화 기술을 사용한다는 것은 컨테이너를 빠르게 만들어 사용하고 부담없이 버리고 다시 만들고 한다는 뜻이다.
    4) 컨테이너를 만드는 이유는 애플리케이션을 실행을 목적으로 한다.
    5) 도커에서는 실행환경과 애플리케이션을 하나로 합쳐진 형태(image)로 다룰 수 있기 때문에 배포와 운영에 매우 민첩하고 편리하게 대응할 수 있다.
    
3. __Docker Image__
    1) Container File System와 Application를 하나로 합친 것
    2) 컨테이너를 생성하는 템플릿
    
4. __Docker Container__
    1) Docker Image가 실행된 상태


#### 1-2. Image & Container 간단 실습
1. __Docker Image 다운로드__
    1) 도커허브를 통해 공개된 이미지를 다운로드하여 컨테이너로 실행할 수 있다.
    2) 깃허브처럼 도커허브에 자신의 레포지토리를 만들어 이미지를 업로드하고 공개할 수 있다.
    3) kickscar/helloworld는 실습용으로 도커허브에 올린 레포지토리/이미지 이름이다.
    4) docker CLI를 통해 image와 container에 대한 오퍼레이션을 할 수 있다.
        
        <img src="http://assets.kickscar.me:8080/markdown/docker-practices/docker-basics/10001.png" width="800px" />
        <br>
        - :latest는 이미지에 붙히는 태그이다.
        - image 다운로드 하는 명령은 pull이고 다운로드된 image를 리스트업하는 명령은 ls이다
            
2. __Docker Container 살행__
    1) 쉽게 이미지의 실행을 컨테이너라 생각하면 된다.
    2) 따라서 Container에 대한 오퍼레이션이 필요하다.
    
        <img src="http://assets.kickscar.me:8080/markdown/docker-practices/docker-basics/10002.png" width="800px" />
        <br>
        - 실행을 위해 run 명령을 사용했다. -a 옵션은 실행이 끝난 컨테이너까지 볼 수 있다.
        - rm은 컨테이너를 제거할 수 있다(컨테이너의 애플리케이션의 실행이 끝났다고 컨테이가 종료되는 것은 아니다. 재실행할 수도 있다.)

#### 1-3. Docker Image 빌드 및 실행
1. __Docker Image 빌드__
    1) 실습 디렉토리 docker-practices/docker-basics/Ch01. Basic Concept/helloworld 만들기
    
        <img src="http://assets.kickscar.me:8080/markdown/docker-practices/docker-basics/10003.png" width="800px" />
        <br>
    
    2) 쉘스크립트 helloworld.sh 작성
        ```bash
            #!/bin/sh
            echo 'Hello, World'        
        ```
       
    3) Dockerfile 작성
        ```dockerfile
            FROM ubuntu:16.04 
        
            COPY helloworld.sh /usr/local/bin
            RUN  chmod +x /usr/local/bin/helloworld.sh
        
            CMD  /usr/local/bin/helloworld.sh        
        ```

    4) Image 빌드 및 확인
    
        <img src="http://assets.kickscar.me:8080/markdown/docker-practices/docker-basics/10004.png" width="800px" />
        <br>
        
        - &lt;namespace&gt;/&lt;image name&gt;:&lt;tag&gt; 형식으로 빌드되는 이미지의 네이밍을 한다.  
        - 빌드하기 위해 베이스가되는 이미지를 다운로드하는 모습을 확인할 수 있다.    

    5) 실행

        <img src="http://assets.kickscar.me:8080/markdown/docker-practices/docker-basics/10005.png" width="800px" />
        <br>
