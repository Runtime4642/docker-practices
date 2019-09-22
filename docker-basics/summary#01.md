## 1. Basic Concepts

#### 1-1. Terminology  
1. docker image : (container file system + application) 하나로 합친 것, 컨테이너를 생성하는 템플릿  
2. docker container : docker image가 실행된 상태

#### 1-2. Image & Container
1. __Download Docker Image & Run Docker Container__
    ```bash
    $ docker image pull kickscar/hellodocker:latest
    $ docker container run -t -p 3030:3000 kickscar/hellodocker
    $ docker container ls
    $ docker container stop [CONTAINER-ID|CONTAINER-NAME]
    ```

2. __Test__
    ```bash
    $ curl http://localhost:3030/
    ```

#### 1-3. Build Docker Image(helloworld)
1. __Make Directory /docker-practices/docker-basics/helloworld__
2. __Script helloworld.sh__
3. __Build Image__  
    ```bash
     $ docker image build -t helloworld:latest .
     ```
4. __Verify Image__
    ```bash
    $ docker images
    ```
5. __Run__
    ```bash
    $ docker run helloworld
    ```