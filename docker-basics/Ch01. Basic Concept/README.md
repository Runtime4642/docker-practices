## 1. Basic Concepts

#### 1-1. Terminology  
1. docker image : (container file system + application) 하나로 합친 것, 컨테이너를 생성하는 템플릿  
2. docker container : docker image가 실행된 상태

#### 1-2. Image & Container
1. __Download Docker Image & Run Docker Container__

    ```bash
    $ docker image pull kickscar/helloworld:latest

    $ docker image ls
    REPOSITORY               TAG                 IMAGE ID            CREATED             SIZE
    kickscar/helloworld      latest              6ae68df34147        6 minutes ago       121MB  
   
    $ docker conatiner run kickscar/helloworld:latest
    Hello, World

    $ docker container ls -a
    CONTAINER ID        IMAGE                        COMMAND                  CREATED              STATUS                      NAMES
    e3bf99488a85        kickscar/helloworld:latest   "/bin/sh -c /usr/loc…"   About a minute ago   Exited (0) 29 seconds ago   clever_hermann
   
    $ docker container rm e3bf99488a85
    $ docker container ls -a
    CONTAINER ID        IMAGE                        COMMAND                  CREATED              STATUS                      NAMES

    ```

#### 1-3. Build 'helloworld' Docker Image
1. __Create Directory docker image helloworld__

2. __Change Directory helloworld__

2. __Generate Shell Script helloworld.sh__
    ```bash
    #!/bin/sh
    echo 'Hello, World'        
    ```
3. __Generate Dockerfile__
    ```dockerfile
    FROM ubuntu:16.04 

    COPY helloworld.sh /usr/local/bin
    RUN  chmod +x /usr/local/bin/helloworld.sh

    CMD  /usr/local/bin/helloworld.sh        
    ```

4. __Build Image__  
    ```bash
    $ docker image build -t <your namespace>/helloworld2:latest .
    ```

5. __Verify Image__
    ```bash
    $ docker image ls
    REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
    kickscar/helloworld2   latest              00e37b7becc4        40 seconds ago      121MB
    kickscar/helloworld    latest              6ae68df34147        9 days ago          121MB
    ubuntu                 16.04               657d80a6401d        2 weeks ago         121MB
    ```

6. __Run__
    ```bash
    $ docker container run <your namespace>/helloworld2
    ```