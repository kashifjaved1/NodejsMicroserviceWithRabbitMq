# Node.js Microservices with RabbitMQ

A comprehensive microservices architecture implemented using Node.js, Express, MongoDB, and RabbitMQ for inter-service communication. This project includes a gateway service and multiple microservices (user, product, client, order) that communicate through RabbitMQ.

## Architecture Overview

The project follows a clean architecture pattern with clear separation of concerns between different layers:

```
[Configuration Layer]
        ↓
[API Gateway Layer]
        ↓
[Express Logic Layer]
        ↓
[API Layer]
        ↓
[Service Layer]
        ↓
[Repository Layer]
        ↓
[Model Layer]
```

## System Components

### 1. API Gateway Layer
- Acts as the single entry point for all client requests
- Implements service discovery and routing
- Handles cross-cutting concerns:
  - Authentication/Authorization
  - Rate limiting
  - Request validation
  - Error handling
  - Logging
  - Circuit breaking

### 2. Microservices
- **User Service**: Handles user authentication and authorization
- **Product Service**: Manages product catalog and inventory
- **Client Service**: Handles client-specific operations
- **Order Service**: Manages order processing and fulfillment

### 3. RabbitMQ Messaging Layer

#### Core Components
1. **Exchange**
   - Routing mechanism that receives messages from producers
   - Types:
     - Direct: Routes messages to queues based on exact match of routing key
     - Fanout: Broadcasts messages to all bound queues
     - Topic: Routes messages based on pattern matching
     - Headers: Routes messages based on message headers

2. **Queue**
   - Buffer that stores messages
   - Consumers read messages from queues
   - Queues are durable and can persist messages
   - Supports multiple consumers

3. **Binding**
   - Connection between exchange and queue
   - Uses binding keys to determine message routing
   - Example:
     ```
     Exchange: ORDER-EXCHANGE
     Queue: ORDER-QUEUE
     Binding Key: order.*
     ```

4. **Message Acknowledgment**
   - Ensures reliable message delivery
   - Types:
     - Automatic: Consumer automatically acknowledges messages
     - Manual: Consumer explicitly acknowledges messages
   - Example:
     ```javascript
     // Manual acknowledgment
     channel.consume(queue, (msg) => {
         try {
             // Process message
             channel.ack(msg);
         } catch (error) {
             // Requeue on error
             channel.nack(msg, false, true);
         }
     });
     ```

5. **Message Properties**
   - Delivery Mode: Persistent (2) or Non-persistent (1)
   - Priority: 0-255
   - TTL: Time-to-live for messages
   - Headers: Additional metadata

#### Message Flow

```
[Producer Service]
   ↓
[Exchange] (with routing key)
   ↓
[Queue] (bound with binding key)
   ↓
[Consumer Service]
```

1. **Publishing Messages**
   - Producer creates message with routing key
   - Message sent to exchange
   - Example:
     ```javascript
     channel.publish(
         'ORDER-EXCHANGE',
         'order.created',
         Buffer.from(JSON.stringify(order)),
         { persistent: true }
     );
     ```

2. **Routing Process**
   - Exchange receives message
   - Uses routing key to determine destination
   - Places message in appropriate queue(s)
   - Example:
     ```
     Routing Key: order.created
     Exchange Type: Direct
     Queue: ORDER-QUEUE
     ```

3. **Consuming Messages**
   - Consumer subscribes to queue
   - Message delivered in FIFO order
   - Consumer processes message
   - Acknowledgment sent back
   - Example:
     ```javascript
     channel.consume('ORDER-QUEUE', (msg) => {
         const order = JSON.parse(msg.content.toString());
         // Process order
         channel.ack(msg);
     });
     ```

#### Advanced Features

1. **Dead Letter Queues (DLQ)**
   - Queue for failed messages
   - Configured with x-dead-letter-exchange
   - Example:
     ```javascript
     channel.assertQueue('ORDER-QUEUE', {
         arguments: {
             'x-dead-letter-exchange': 'DLX'
         }
     });
     ```

2. **Message Retries**
   - Configurable retry attempts
   - Exponential backoff
   - Example:
     ```javascript
     channel.assertQueue('ORDER-QUEUE', {
         arguments: {
             'x-dead-letter-exchange': 'DLX',
             'x-message-ttl': 5000, // 5 seconds
             'x-dead-letter-routing-key': 'order.retry'
         }
     });
     ```

3. **Connection Pooling**
   - Maintains multiple connections
   - Handles connection failures
   - Example:
     ```javascript
     const pool = new Pool({
         max: 10,
         create: () => amqplib.connect('amqp://localhost'),
         destroy: (conn) => conn.close()
     });
     ```

#### Best Practices

1. **Queue Naming**
   - Use descriptive names
   - Include service name and purpose
   - Example: `order.processing`, `user.notification`

2. **Error Handling**
   - Implement proper try-catch blocks
   - Use DLQ for failed messages
   - Log errors appropriately

3. **Monitoring**
   - Monitor queue sizes
   - Track message rates
   - Watch for slow consumers

4. **Security**
   - Use TLS for connections
   - Implement proper authentication
   - Restrict queue access

5. **Scalability**
   - Use multiple queues for different message types
   - Implement proper connection pooling
   - Configure proper message TTL

## Data Flow

```
[Client Request]
   ↓
[API Gateway]
   ↓
[Service Discovery]
   ↓
[Service Proxy]
   ↓
[Microservice]
   ↓
[Message Broker (RabbitMQ)]
   ↓
[Other Microservices]
```

### Service Communication Flow
1. Client -> Gateway: HTTP/REST
2. Gateway -> Services: HTTP/REST
3. Service-to-Service: RabbitMQ (Message Broker)

### Error Handling Flow
```
Error -> Gateway -> Service Discovery -> Fallback Service -> Circuit Breaker -> Response
```

## Prerequisites

- Install [Node.js](https://nodejs.org/en/)
- Install [RabbitMQ](https://www.rabbitmq.com/) or run it in a Docker container with the included compose file. Alternatively you can use their cloud solution at [CloudAMQP](https://www.cloudamqp.com/)
- MongoDB for database storage
- Environment variables properly configured in `.env` files