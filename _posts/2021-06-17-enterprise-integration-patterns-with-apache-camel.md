---
layout: post
title: "Enterprise Integration Patterns With Apache Camel"
date: 2021-06-17
excerpt: "Why Apache Camel is awesome when dealing with complex dependencies"
tags: [apache camel, programming, java, frameworks]
comments: true
---

<figure>
    <a href="/assets/img/camel/camel.jpeg"><img src="/assets/img/camel/camel.jpeg" style="max-width: 80%"></a>
    <figcaption style="text-align: center">Photo by <a href="https://unsplash.com/@kristianegelund" target="_blank">Kristian Egelund</a> on Unsplash</figcaption>
</figure>


Hi there! I want to tell you about a great open-source tool that is AWESOME and it does not get the love it deserves: **[Apache Camel](https://camel.apache.org/)**.

Apache Camel is an integration framework. What does that mean? Let's suppose you are working on a project that consumes data from Kafka and RabbitMQ, reads and writes from and to various databases, transforms data, logs everything to files and outputs the processed data to another Kafka topic. You also have to implement the error handling of the service (retries, dead letter channel, etc.) for everything to run flawlessly. It seems hard.

Apache Camel helps you to integrate with many components, such as databases, files, brokers, and much more, while keeping the simplicity and promoting [enterprise integration patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/). Let's see some examples, based on integration patterns. You can find the code in [this repository](https://github.com/diogodanielsoaresferreira/apache_camel_demo).

We will start by consuming events from a Kafka topic and output to another one, taking advantage of the **[Event-Driven Consumer](https://www.enterpriseintegrationpatterns.com/patterns/messaging/EventDrivenConsumer.html)** pattern. The events will be representation of text messages sent by a user.

<script src="https://gist.github.com/diogodanielsoaresferreira/0cdbb84d9a038679091c07ae7e5e5387.js"></script>


<script src="https://gist.github.com/diogodanielsoaresferreira/0591c76be64e9b131328ad15e2aa771b.js"></script>


That's about it! We also added the log for us to see the message body in the logs. The log argument is passed using the Simple language, an Apache Camel language used to evaluate expressions.

Now let's implement a **[message filter](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Filter.html)**. This pattern filters out the messages that do not match certain conditions. In our case, we will only process those that have the type "chat".

<script src="https://gist.github.com/diogodanielsoaresferreira/e09cdb48d69e76ab1cb10c4af4bc6104.js"></script>

Easy, right? We now unmarshal the message from JSON to the UserMessage POJO to be able to filter by type. We marshal again in JSON before sending it to another Kafka topic.

<script src="https://gist.github.com/diogodanielsoaresferreira/0f871fea43680f80ee14406c74e0450e.js"></script>

Now suppose we want to store all messages in a file. Besides, for the messages where the emitter is "John Doe", we want to store them in a different file, for testing purposes. For that, we can use the **[content-based router](https://www.enterpriseintegrationpatterns.com/patterns/messaging/ContentBasedRouter.html)** pattern.

<script src="https://gist.github.com/diogodanielsoaresferreira/35e23fd77e0c7eba5490b3b4b89f95d2.js"></script>

If the file already exists, we will append the events and add a newline at the end of each event. For other emitters, we will do the same, but stores them in another file. It does look like an 'if' construct, right?

We can see a list of "devices" in the event, and we want to log them one by one. How can we do that? Using the **[Splitter](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Sequencer.html)** pattern, we can iterate through any list. We can do it sequentially or parallelly. Let's try to do it sequentially in this example.

<script src="https://gist.github.com/diogodanielsoaresferreira/09fa1bef4dfeb39f97fc6ce8258177e8.js"></script>

We can split by any field that is an Iterable. As you can see, we are using again the Simple language to access the content of the event.

Let's try something harder. We are receiving messages with text from various emitters, but we want to aggregate multiple text messages and create a new message with all messages for an emitter. To do that, we can use the **[Aggregator](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Aggregator.html)** pattern. The aggregator pattern allows events to be buffered and wait for other events. When another event is received, it can be performed a custom aggregation, based on our needs. A new event is sent when a condition is met. That condition can be based on the number of events received, a timeout, or any other custom condition.

In our case, we will create a new POJO that will aggregate the text messages from an emitter. The new event will be sent after 5 seconds of the first event received for the emitter.

<script src="https://gist.github.com/diogodanielsoaresferreira/c008156c4f83f1e3c6e7b7aaf90b9546.js"></script>

We are using an in-memory aggregation, but we could use other data stores, such as Postgres or Redis. We are using simple language to aggregate the emitter of the message, and we created a custom aggregation strategy, shown below.

In the custom aggregation strategy, for the first event (oldExchange==null), we create a new CombinedUserMessage with the text of the message. For all other events, we add the text of the message to the combined event.

<script src="https://gist.github.com/diogodanielsoaresferreira/718f4cd50a4d534f9cb165d00fae44d1.js"></script>

This is all great, but how do we apply transformations to a field? We now have a combined event, but what was great was if we could somehow process the combined event and turn it into plain text, by combining the multiple elements of the text messages. We can do that using the **[Message Translator](https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageTranslator.html)** pattern.

<script src="https://gist.github.com/diogodanielsoaresferreira/3e1ab2d97d959d852f8585242d2a0448.js"></script>

<script src="https://gist.github.com/diogodanielsoaresferreira/c7a1ed32df2606f554a1a752a228bb76.js"></script>

We can call bean functions directly from a Camel Route and perform all the transformations that we need,using plain Java code. Neat!

We can see that our Camel Routes are becoming bigger. How do we do if we want, for example, to separate them between files? Two in-memory components that allow us to do that: **Direct** and **SEDA**.

**Direct** is a synchronous endpoint that works like a call from a route to another route. Let's use it to separate the route that stores the event in a file.

<script src="https://gist.github.com/diogodanielsoaresferreira/a68c674081b169fc5f575a81f846fd19.js"></script>

Great! There is another in-memory component that will be useful for us: **SEDA**. SEDA works like Direct but is asynchronous, which means that puts the message in a queue for other thread to process. Let's use SEDA to decouple the receiving of the message from Kafka from the routes that consume it.

<script src="https://gist.github.com/diogodanielsoaresferreira/09731355e56b2a12378237549b44c583.js"></script>

Now our routes are much simpler. Suppose we need to perform a periodic task, such as a cleanup. We can take advantage of the **Timer** endpoint. Let's exemplify it by creating a route that runs every 5 seconds.

<script src="https://gist.github.com/diogodanielsoaresferreira/3c17f8dbf10065f55fced89e0638c51c.js"></script>

Now that our application is almost ready for production, we have to improve fault tolerance. What happens if, for some reason, a message gets an error while in a route? Let's implement the **[Dead Letter](https://www.enterpriseintegrationpatterns.com/patterns/messaging/DeadLetterChannel.html)** pattern. When there is an error in the route, the message is sent to another Kafka topic, so that later it can be reprocessed.

<script src="https://gist.github.com/diogodanielsoaresferreira/6bc2f0623d14fe37058073d6846d95ff.js"></script>

And that's it! The error handler configuration applies to all routes in the class. We send the original message to the topic (the one that was first received in the route). We could also configure retry policies, with timeouts and other common fault tolerance configurations, but as we don't need it, we will leave it as is.

Now that we are reaching the end of this article, I also wanted to show you something: it is possible to configure **REST** endpoints as Camel routes.

<script src="https://gist.github.com/diogodanielsoaresferreira/4993e2d298b912e222f586237f5bc783.js"></script>

As simple as that! We just configured a GET for the URL /api/hello, to be answered with "Hello World!".
As you can see, Apache Camel is a framework that simplifies the integration with other components, supporting the enterprise integration patterns and making it easier to create data pipelines.

I hope you have liked it! Thanks for reading!
