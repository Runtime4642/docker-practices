## 3. 기타 Operation

##### 3-1. 실행 중이 아닌 모든 컨테이너 파기
   1) 명령
      ```bash
      $ docker container prune
      ```
##### 3-2. tag가 붙지 않은 dagling image 삭제
   1) 명령
      ```bash
      $ docker image prune
      ```
##### 3-3. 사용하지 않은 모든 리소스(이미지,컨테이너,볼륨,네트워크..) 일괄삭제
   1) 명령
      ```bash
      $ docker system prune
      ```
##### 3-4. 컨테이너 상태 모니터링
   1) 명령
      ```bash
      $ docker container stats [대상 컨테이너 아이디...]
      ```