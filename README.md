
  
# microservices-with-rabbitmq

Basic microservices project that includes a gateway (api-gateway) and microservices (user/product/client/order) and messaging with rmq. On user service there's two options either you can go with session token or with jwt token. Both are shown in gateway to proceed with next as well.
  

### Prerequisites

  

- Install [Node.js](https://nodejs.org/en/)
- Install [RabbitMQ](https://www.rabbitmq.com/) or run it in a Docker container with the included compose file. Alternatively you can use their cloud solution at [CloudAMQP](https://www.cloudamqp.com/)