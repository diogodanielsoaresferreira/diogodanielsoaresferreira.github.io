---
layout: post
title: "How to structure your code? Hexagonal Architecture!"
date: 2024-02-15
excerpt: "Learn to structure your code using Hexagonal Architecture"
tags: []
comments: true
---

Hi there! When I started to build services, I never knew how to structure the code. In Python it was easy: I would start with a single file and later split it if needed. However, for large projects, that would not do it: the complexity grew so much that **it was needed a better way to structure the code**. But how?

---

In my first projects I used a **3-tiered architecture**. And it worked like a charm! I separated the logical concerns of accessing a database in the data access layer, the business logic in its own layer, and exposed REST services in the presentation layer. That was enough for most database-oriented services.

<figure>
    <a href="/assets/img/hexagonal-architecture/3-tier.png"><img src="/assets/img/hexagonal-architecture/3-tier.png"></a>
</figure>
<figcaption style="text-align: center">3-tiered architecture (Source: <a href="https://www.happycoders.eu/software-craftsmanship/hexagonal-architecture/" target="_blank">HappyCoders</a>)</figcaption>


However, in most complex problems, the layers would end up having dependencies between each other, which would create coupling problems, such as difficulty in testing a layer independently or exposing database models in the presentation layer.

To decouple those dependencies it was created the **Hexagonal Architecture (or Ports & Adapters)** by Alistair Cockburn in 2005. He noticed that it was not much different for an application to interact with a database, a filesystem, or any other external application, from the application point of view. That means that business logic can be isolated from the outside world using ports and adapters.

<figure>
    <a href="/assets/img/hexagonal-architecture/3-tier.png"><img src="/assets/img/hexagonal-architecture/3-tier.png"></a>
</figure>
<figcaption style="text-align: center">Hexagonal architecture (Source: <a href="https://www.happycoders.eu/software-craftsmanship/hexagonal-architecture/" target="_blank">HappyCoders</a>)</figcaption>

**But what are ports and adapters?** Having the business logic at its core, it defines ports to communicate with the outside world. The ports are technology-agnostic, and create an interface through which external actors can communicate with an application. It is a contract defined by the application that states how it wants to interact with other systems, without knowing anything about them. The adapters use a port to interact with the application. An example of an adapter can be a database, a REST controller or a message bus.

<figure>
    <a href="/assets/img/hexagonal-architecture/3-tier.png"><img src="/assets/img/hexagonal-architecture/3-tier.png"></a>
</figure>
<figcaption style="text-align: center">Hexagonal architecture implementation (Source: <a href="https://www.happycoders.eu/software-craftsmanship/hexagonal-architecture/" target="_blank">HappyCoders</a>)</figcaption>

---

Let's see an example. We will create a Kotlin application with Spring that receives messages from a RabbitMQ Broker and stores them in a Postgres database.
Let's start by creating the domain entity. In this case, the message.

```java
data class Message(
    val timestamp: OffsetDateTime,
    val value: String
)
```

Let's also create the business logic that will store the messages in the repository.

```java
@Component
class SaveMessageUseCase(
    @Autowired private val repository: MessageRepository
): {

    private val logger: Logger = LoggerFactory.getLogger(this.javaClass)

    override fun execute(message: Message) {
        logger.debug("operation=save, message='saving message {}'", message)
        repository.save(message)
    }
}
```

Now that the business logic is done, let's create the ports. In this case, we will have two ports: the repository to store the messages and the listener to receive the messages.

```java
interface MessageRepository {
    fun save(entity: Message)
}
```

```java
interface MessageListener {
    fun process(event: MessageEvent)
}
```

Great! The only thing that's left now are the adapters. The adapters will implement the ports to their specific use case, in this case, a Postgresql repository and a RabbitMQ listener.

```java
@Repository
class MessageRepositoryImpl(
    @Autowired private val jdbcTemplate: JdbcTemplate
): MessageRepository {

    private val logger: Logger = LoggerFactory.getLogger(this.javaClass)

    override fun save(entity: Message) {
        val insertQuery = """
            INSERT INTO public.message(message_timestamp, message_value)
            VALUES (?, ?, ?)
        """.trimIndent()
        jdbcTemplate.update(insertQuery, entity.timestamp, entity.value)
    }
}
```

```java
@Component
class MessageListenerImpl(
    @Autowired private val saveMessageUseCase: SaveMessageUseCase
) {

    private val logger: Logger = LoggerFactory.getLogger(this.javaClass)

    @RabbitListener(queues = ["\${messages.processor.queue.name}"])
    override fun process(event: MessageEvent) {
        logger.debug("operation=process, message='received MessageEvent {}'", event)
        saveMessageUseCase.execute(event.toMessage())
    }
}
```

---

We now have a fully decoupled application. Can you see how the dependencies are organized? The dependencies flow from the adapters to the domain and not the other way around: the business logic never depends on any adapter, but the adapter depends on the business logic. Any change in the repository implementation or models never affects the business logic or the data exposed to the clients. This is also called the **dependency inversion principle**.

However, even for a simple use case, this architecture can be very verbose. Ideally, each adapter has its data classes independent from the business logic, as well as its mappers, to convert the data between adapters and the business logic. For a minimal CRUD microsservice, it may not be worth the overhead of creating ports and additional data classes and mappers.

---

The code examples in this blog post are based on a personal project, a platform for sensor data (check it out here). If you are interested in knowing more about the hexagonal architecture, there are some resources that go deeper into this topic:
* <https://alistair.cockburn.us/hexagonal-architecture/>
* <https://www.happycoders.eu/software-craftsmanship/hexagonal-architecture/>
* <https://www.youtube.com/watch?v=bDWApqAUjEI>

Thanks for reading!
