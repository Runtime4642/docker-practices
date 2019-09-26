## 4. Docker Swarm


### 4-1. What is Docker Swarm?
  1) a Clustering and Scheduling Tool for Docker Containers
  2) 여러 Docker Host를 Cluster로 묶어주는 Container Ochestration Tool
  3) Embeded in Docker


### 4-2. Compose vs Swarm vs Service vs Stack
  1) Compose : 다수 컨터이너로 구성된 어플리케이션 관리(single host)
  2) Swarm   : 컨테이너들의 클러스터 구축 및 스케줄링과 같은 관리용도로 쓰인다(multi hosts)
  3) Service : Service in Swarm Cluster, a Set of One Container More (주로 개별적 서비스 관리에 사용할 수 있다)
  4) Stack   : Manage Application Grouped Swarm's Services (그니깐, 주로 멀티 서비스 관리에 적용할 수 있다)


### 4-3. __practice01: Swarm Cluster 구성해 보기__

#### 1. __여러 대의 도커 호스트에 실해되는 컨테이너 구성__
  1) DIND(Docker in Docker) 를 사용해 여러 호스트내의 도커 컨테이너 구성
  2) 컨테이너 종류
     + registry(1) : 도커 레지스트리 역활 (도커인 도커에서 도케 호스트안의 도커는 도커 허브에서 이미지를 다운로드 할 수 없다. 일종의 inhouse registry)
     + manager(1) : Swarm Cluster 전체를 제어하는 역할
     + worker(3) : 실제 서비스 이미지를 실행하는 컨테이너를 구동하는 도커 호스트다.
  3) docker-compose.yml 작성
     ```bash
     version: "3"
     services:
       hellodocker-registry:
         container_name: hellodocker-registry
         image: registry:2.6
         ports:
           - 5000:5000
         volumes:
           - "./registry-data:/var/lib/registry"
    
       hellodocker-manager:
         container_name: hellodocker-manager
         image: docker:18.05.0-ce-dind
         privileged: true
         tty: true
         ports:
           - 8000:80
           - 9000:9000
         depends_on:
           - hellodocker-registry
         expose:
           - 3375
         command: "--insecure-registry hellodocker-registry:5000"
         volumes:
           - "./stack:/stack"
    
       hellodocker-worker01:
         container_name: hellodocker-worker01
         image: docker:18.05.0-ce-dind
         privileged: true
         tty: true
         depends_on:
           - hellodocker-manager
           - hellodocker-registry
         expose:
           - 7946
           - 7946/udp
           - 4789/udp
         command: "--insecure-registry hellodocker-registry:5000"
    
       hellodocker-worker02:
         container_name: hellodocker-worker02
         image: docker:18.05.0-ce-dind
         privileged: true
         tty: true
         depends_on:
           - hellodocker-manager
           - hellodocker-registry
         expose:
           - 7946
           - 7946/udp
           - 4789/udp
         command: "--insecure-registry hellodocker-registry:5000"
    
       hellodocker-worker03:
         container_name: hellodocker-worker03
         image: docker:18.05.0-ce-dind
         privileged: true
         tty: true
         depends_on:
           - hellodocker-manager
           - hellodocker-registry
         expose:
           - 7946
           - 7946/udp
           - 4789/udp
         command: "--insecure-registry hellodocker-registry:5000"
     ```
     + 도커 레지스트리 접근은 https -> http 로 바꾸기 위해 --insecure-registry 옵션을 사용했다.
      
  4) compose 실행
     ```bash
     $ docker compose up -d
     ```
  5) verify
     ```bash
     $ docker container ls
     CONTAINER ID  IMAGE                    STATUS        PORTS                                       NAMES
     717c3bd59b6e  docker:18.05.0-ce-dind   Up 2 minutes  2375/tcp, 4789/udp, 7946/tcp, 7946/udp      hellodocker-worker01
     4c08452c11fb  docker:18.05.0-ce-dind   Up 2 minutes  2375/tcp, 4789/udp, 7946/tcp, 7946/udp      hellodocker-worker03
     1c3bb264420f  docker:18.05.0-ce-dind   Up 2 minutes  2375/tcp, 4789/udp, 7946/tcp, 7946/udp      hellodocker-worker02
     a21626a9507d  docker:18.05.0-ce-dind   Up 2 minutes  2375/tcp, 3375/tcp, 0.0.0.0:9000->9000/tcp, hellodocker-manager
                                                          0.0.0.0:8000->80/tcp  
     ca2805bfd7ca  registry:2.6             Up 2 minutes  0.0.0.0:5000->5000/tcp                      hellodocker-registry
     
     ```
  6) Activate Swarm Mode
     manager 호스트 marking 작업을 통해 swarm 모드가 활성화 된다.  
     ```bash
     $ docker container exec -it hellodocker-manager sh
     / # docker swarm init
     Swarm initialized: current node (abssnhoxe924c82u4rw0ngiz7) is now a manager.

     To add a worker to this swarm, run the following command:

          docker swarm join --token SWMTKN-1-5dwkn4saljbvc9nmdyn74wet1othsuyj9loyq8om6b4grx6gpw-a2b8rdxgcqjk86uw8kfqlfq0b 172.22.0.3:2377

     To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.

     / # exit     
     ```
     + 출력에 join token 확인할 것(Cluster 구성에 Worker Continer를 참여 시키기 위해 반드시 필요)
     
  7) Join Worker Container in Swarm Cluster
     Worker Container에서 Manager Container에 Token 전송한다
     
     ```bash
     $ docker container exec -it hellodocker-worker01 sh
     / # docker swarm join --token SWMTKN-1-5dwkn4saljbvc9nmdyn74wet1othsuyj9loyq8om6b4grx6gpw-a2b8rdxgcqjk86uw8kfqlfq0b hellodocker-manager:2377
     This node joined a swarm as a worker.
     / # exit
     ```

     ```bash
     $ docker container exec -it hellodocker-worker02 sh
     / # docker swarm join --token SWMTKN-1-5dwkn4saljbvc9nmdyn74wet1othsuyj9loyq8om6b4grx6gpw-a2b8rdxgcqjk86uw8kfqlfq0b hellodocker-manager:2377
     This node joined a swarm as a worker.
     / # exit
     ```

     ```bash
     $ docker container exec -it hellodocker-worker03 sh
     / # docker swarm join --token SWMTKN-1-5dwkn4saljbvc9nmdyn74wet1othsuyj9loyq8om6b4grx6gpw-a2b8rdxgcqjk86uw8kfqlfq0b hellodocker-manager:2377
     This node joined a swarm as a worker.
     / # exit
     ```
  8) Verify 'hellodocker-swarm' Swarm Cluster   
     ```bash
     $ docker container exec -it hellodocker-manager sh
     / # docker node ls
     ID                            HOSTNAME       STATUS   AVAILABILITY  MANAGER STATUS  ENGINE VERSION
     ndirb43uj2qwwflgpzakf4oa9     1c3bb264420f   Ready    Active                        18.05.0-ce
     neqc8fm3bt67l2gb51dpzne0x     4c08452c11fb   Ready    Active                        18.05.0-ce
     16dpy0tj2fn2ywojrnm13sweo     717c3bd59b6e   Ready    Active                        18.05.0-ce
     abssnhoxe924c82u4rw0ngiz7 *   a21626a9507d   Ready    Active        Leader          18.05.0-ce
     / # exit
     ```
  9) Register Image into Docker Registry (Operating Private Registry)
     태그 붙이기   
     ```bash
     $ docker image tag kickscar/hellodocker:latest localhost:5000/kickscar/hellodocker:latest
     ```
     
     등록하기
     ```bash
     $ docker image push localhost:5000/kickscar/hellodocker:latest
     ```
 10) Downloading Image registered in Worker Host (Operating Private Registry)  
      
     Worker01 Host Container  
     
     ```bash
     $ docker container exec -it hellodocker-worker01 sh
     / # docker image pull hellodocker-registry:5000/kickscar/hellodocker:latest
     latest: Pulling from kickscar/hellodocker
     e7c96db7181b: Pull complete 
     50958466d97a: Pull complete 
     56174ae7ed1d: Pull complete 
     284842a36c0d: Pull complete 
     83cf8dfbb24f: Pull complete 
     15c6e96168ae: Pull complete 
     Digest: sha256:1d21c142f6ddf12db08e37be0cbd5b1d029e141f3d6efe4fc2a008548ecec302
     Status: Downloaded newer image for hellodocker-registry:5000/kickscar/hellodocker:latest
     / # exit
     ```      
  
     Worker02 Host Container  
      
     ```bash
     $ docker container exec -it hellodocker-worker02 sh
     / # docker image pull hellodocker-registry:5000/kickscar/hellodocker:latest
     latest: Pulling from kickscar/hellodocker
     Digest: sha256:1d21c142f6ddf12db08e37be0cbd5b1d029e141f3d6efe4fc2a008548ecec302
     Status: Downloaded newer image for hellodocker-registry:5000/kickscar/hellodocker:latest
     / # exit
     ```      
      
     Worker03 Host Container  
      
     ```bash
     $ docker container exec -it hellodocker-worker03 sh
     / # docker image pull hellodocker-registry:5000/kickscar/hellodocker:latest
     latest: Pulling from kickscar/hellodocker
     Digest: sha256:1d21c142f6ddf12db08e37be0cbd5b1d029e141f3d6efe4fc2a008548ecec302
     Status: Downloaded newer image for hellodocker-registry:5000/kickscar/hellodocker:latest
     / # docker image ls
     REPOSITORY                                       TAG      IMAGE ID       CREATED        SIZE
     hellodocker-registry:5000/kickscar/hellodocker   latest   ea9c0fcdd86b   4 days ago     76.4MB
     / # exit
     ```      
#### 2. __Service__
 
  1) 도커 서비스란?  
     + 애플리케이션을 구성하는 일부 컨테이너를 제어하기 위한 단위
     + 하나의 컨테이너일 수도 있고 여러 종류 컨테이너로 구성될 수도 있다.
     
  2) 서비스 생성 및 실행
     ```bash
     $ docker container exec -it hellodocker-manager sh
     / # docker service create --replicas 1 --publish 8000:8080 --name hellodocker hellodocker-registry:5000/kickscar/hellodocker
     1/1: running   [==================================================>] 
     verify: Service converged 
     / # docker service ls
     ID            NAME          MODE          REPLICAS     IMAGE                                                   PORTS
     gkqfr3aque64  hellodocker   replicated    1/1          hellodocker-registry:5000/kickscar/hellodocker:latest   *:8000->8080/tcp
     
     ```
  3) Scale Out
  
     ```bash
     $ docker container exec -it hellodocker-manager sh
     / # docker service scale hellodocker=6
     hellodocker scaled to 6
     overall progress: 6 out of 6 tasks 
     1/6: running   [==================================================>] 
     2/6: running   [==================================================>] 
     3/6: running   [==================================================>] 
     4/6: running   [==================================================>] 
     5/6: running   [==================================================>] 
     6/6: running   [==================================================>] 
     verify: Service converged 
     ```

  3) 노드 분산 배치 확인하기
     ```bash
     $ docker container exec -it hellodocker-manager sh
     / # docker service ps hellodocker
     ID                  NAME                IMAGE                                                   NODE                DESIRED STATE       CURRENT STATE                ERROR               PORTS
     paox1l3u1y8r        hellodocker.1       hellodocker-registry:5000/kickscar/hellodocker:latest   a21626a9507d        Running             Running 7 minutes ago                            
     jwqkc97mghmb        hellodocker.2       hellodocker-registry:5000/kickscar/hellodocker:latest   1c3bb264420f        Running             Running about a minute ago                       
     h9mvf2ma38mo        hellodocker.3       hellodocker-registry:5000/kickscar/hellodocker:latest   717c3bd59b6e        Running             Running about a minute ago                       
     vr3ubull2a8q        hellodocker.4       hellodocker-registry:5000/kickscar/hellodocker:latest   717c3bd59b6e        Running             Running about a minute ago                       
     y3ek5dzqhk30        hellodocker.5       hellodocker-registry:5000/kickscar/hellodocker:latest   a21626a9507d        Running             Running about a minute ago                       
     d7bggjwlxbae        hellodocker.6       hellodocker-registry:5000/kickscar/hellodocker:latest   4c08452c11fb        Running             Running about a minute ago                       
     / # 
     ```
  4) 서비스 제거
     ```bash
     $ docker container exec -it hellodocker-manager sh
     / # docker service rm hellodocker
     / # 
     ```
            