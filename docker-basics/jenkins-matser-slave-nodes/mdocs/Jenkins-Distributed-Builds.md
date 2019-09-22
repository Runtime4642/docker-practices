## Jenkins Distributed Builds: Master/Slave Mode

#### 1. Basic Concepts

1. Jenkins architecture is fundamentally Master + Agent  
   주: 기본이 마스터 + 에이전트 구조로 Salve라 함은 Agent가 실행되는 호스트라 보면 되겠다.  

2. Master: GUI and API Endpoint

3. Slave: Perform the Works  
   주: Works는 마스터의 모든 일을 나눠할 수 있을 것 같지만 꼭 그렇지는 않다.   
      젠킨스는 보통 다음과 같은 일을 한다. 소스 컨트롤 폴링, LDAP 인증, 작업 실행, 테스트 보고서 파싱, 알림 등이다   
      이 중, 마스터는 GUI, 소스컨트롤 폴링, 알림 등의 가볍고 핵심적인 작업을 하고 슬래이브는 자원을 많이 쓰는 작업을  
      하여야 한다.
         
4. many reasons for this architecture
   + Security
   + Best "Farmed-Out" for Workloads
   + Different Target Platforms

5. EC2, Azure, Google Cloud와 같은 클라우드 환경 뿐만 아니라, Vitual Machine, Docker Container, Kebernetese  
   등과 같은 다양한 가상 컨테이너 환경에  젠킨스 업무를 분산(Distribution), 확장(Extention), 다중플랫폼지원(MutiPlatform)  
   지원에 시용한다.  

#### 2. Understanding Master / Slave Architecture: How does this work?   

#### 3. Creating Slave Node

#### 4. Different ways of starting agents

#### 5. Management of Jenkins Slave: Node Monitoring

#### 6. Node Labels for Agent: and group

#### 7. Load Balancing: Scheduling strategy

fucking a lot!!(존나많네!!!!)
Example 만들기...
 


   
  

     