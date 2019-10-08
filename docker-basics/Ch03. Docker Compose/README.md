## 4. Docker Compose


### 4-1. What is Docker Compose?
  1) 보통 시스템은 여러 컨테이너들 간의 통신과 연동으로 구성.
  2) 여러 컨테이너들의 실행을 한번에 관리해주는 Docker Management Tool  
     (Tool for defining and running multi-container Docker applications)
  3) Using a YAML file to configure application's services
  4) Strting Project is Development of Docker Management Tool 'Fig'

#### 1. __practice01: Docker Compose 명령으로 하나 컨테이너 실행__
  1) Create Directory & Change Directory ./practice01
  
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
     
#### 2. __practice02: 이미지 빌드와 함께 하나 컨테이너 실행__
  1) Create Directory & Change Directory ./practice02

  2) Copy Dockerfile, server.js

  3) Write docker-compose.yml
     ```yml
     version: "3"
     services:
        hellodocker:
           build: .
           ports:
              - 3030:3000     
     ```
  4) Run Containers
     ```bash
     docker-compose up -d --build
     ``` 
     -d : daemon(background) 실행  
     --build : 강제 빌드(forced)
  5) Verify
     ```bash
     docker container ls
     ```
  6) Test
     ```bash
     curl 'http://localhost:3030'
     ```


### 4-2. 2개 젠킨스(Master + Slave) 컨테이너 실행하기

#### 1. __practice03: Jenkins Master Node Container 실행__
  1) Create Directory & Change Directory ./practice03
  
  2) Write docker-compose.yml
     ```yaml
     version: "3"
     services:
        jenkins-master:
           container_name: jenkins-master
           image: jenkins/jenkins
           ports:
              - 8080:8080
           volumes:
              - ./jenkins_home:/var/jenkins_home
     ```
     volumes :
     호스트 파일 시스템의 파일 또는 폴더를 컨테이너와 공유한다.
     
  3) Run Containers
     ```bash
     docker-compose up
     ``` 
     foreground 으로 실행시켜 초기 비밀번호 꼭 복사

     ```yml
     jenkins-master    | Jenkins initial setup is required. An admin user has been created and a password generated.
     jenkins-master    | Please use the following password to proceed to installation:
     jenkins-master    | 
     jenkins-master    | 7a2de9045ab4448bbc796f0110635841
     jenkins-master    | 
     jenkins-master    | This may also be found at: /var/jenkins_home/secrets/initialAdminPassword

     ```     
  4) Verify
     ```bash
     docker container ls
     ```
  5) Test  
     + 브라우저로 접근: http://localhost:8080   
     <img src="http://assets.kickscar.me:8080/markdown/docker-practice/docker-basics/30001.png" width="600px" />
     <br/><br/>  
     
     + 젠킨스 홈 화면  
     <img src="http://assets.kickscar.me:8080/markdown/docker-practice/docker-basics/30002.png" width="600px" />
     <br/><br/>  
       
     Volume 디렉토리 ./jenkins_home 젠킨스 홈 확인할 것.
     
#### 2. __practice02: Jenkins Master/Slave Node 2개 Containers 동시 실행__

  1) Generate Master Jenkins's SSH Key
    
     Master에서 Slave에 Agent 실행은 SSH Tunneling on Unix 방법을 사용한다.
     
     ```ssh
     $ docker container exec -it jenkins-master sh
     $ ssh-keygen -t rsa -C ""
     Generating public/private rsa key pair.
     Enter file in which to save the key (/var/jenkins_home/.ssh/id_rsa): 
     Created directory '/var/jenkins_home/.ssh'.
     Enter passphrase (empty for no passphrase): 
     Enter same passphrase again: 
     Your identification has been saved in /var/jenkins_home/.ssh/id_rsa.
     Your public key has been saved in /var/jenkins_home/.ssh/id_rsa.pub.
     The key fingerprint is:
     SHA256:SIbcFwbkR4uUkxbxTqzdJU4MMxew1i/uqnfRYdrHWQE 
     The key's randomart image is:
     +---[RSA 2048]----+
     |     .**O.o. E.  |
     |   . ==* @     . |
     |    o.*.X = .   .|
     |     o X + +o   .|
     |      o S +=.o o |
     |         .o.o +  |
     |          .. .   |
     |        ...      |
     |      .o.o.      |
     +----[SHA256]-----+
     $ exit
     ```
     
  2) Create Slave Jenkins Container
     ```yaml
     version: "3"
     services:
       master:
         container_name: jenkins-master
         image: jenkins/jenkins
         ports:
           - 8080:8080
         volumes:
           - ../jenkins-master-node/jenkins_home:/var/jenkins_home
         links:
           - slave01

       slave01:
         container_name: jenkins-slave01
         image: jenkins/ssh-slave
         environment:
           - JENKINS_SLAVE_SSH_PUBKEY=ssh-rsa AAAAB3Nza .....     
     ```
     + 환경변수 JENKINS_SLAVE_SSH_PUBKEY 의 값 세팅      
       값은 Volume으로 설정된 디렉토리의 /jenkins_home/.ssh/id_rsa.pub 의 내용이다.
     + master가 slave를 어떻게 찾아 ssh로 agent를 실행하는 방법은 links를 통해 slave 컨테이너를 찾아 통신한다.  
   
  3) Run
     ```ssh
     $ docker-compose up -d
     ```
  4) Verify
     ```ssh
     $ docker container ls
    
     CONTAINER ID        IMAGE                    COMMAND                  CREATED             NAMES
     8a760bb2a766        jenkins/jenkins          "/sbin/tini -- /usr/…"   3 minutes ago       jenkins-master
     3e3517c52fc4        jenkins/ssh-slave        "setup-sshd"             3 minutes ago       jenkins-slave01
     ```
  5) Creating New Slave Node in Master Jenkins
     + Jenkins Master 접속( http://localhost:8080 ) 
     + Jenkins 관리 > 노드 관리
     + 신규노드 메뉴를 눌러 slave01 를 추가       
 
     <img src="http://assets.kickscar.me:8080/markdown/docker-practice/docker-basics/30003.png" width="600px" />
     <br/><br/>  
      
     + 생성 후, slave01 노드 설정
      
     <img src="http://assets.kickscar.me:8080/markdown/docker-practice/docker-basics/30004.png" width="600px" />
     <br/><br/>  
      
      Remote root directory : /home/jenkins  
      Launch method : Launch agent agents via SSH  
      Host : jenkins-slave01 (이름으로 slave 컨테이너를 찾기 때문에 IP대신 컨테이너 이름)  
      Credentials : Jenkins 선택  
      Host Key Verification Strategy : Non Verifying Verification Strategy  
      
     <img src="http://assets.kickscar.me:8080/markdown/docker-practice/docker-basics/30005.png" width="600px" />
     <br/><br/>  
      
      Username : Jenkins
      Private Key : /jenkins_home/.ssh/id_rsa 의 내용  
      Add -> Credentials에서 jenkins를 선택  
      Save  
      
      slave에 연결이 성공하면 Error가 없다.
      
     <img src="http://assets.kickscar.me:8080/markdown/docker-practice/docker-basics/30006.png" width="600px" />
     <br/><br/>  
       
  6) Problems
     + Master/Slave 컨테이너 작업에 운영자가 직접하는 Operation 이 다소 있다.
     + 설정만을 통해 컨테이너 기동만으로 이와 같은 Operation을 생략할 수 있어야 한다.
     