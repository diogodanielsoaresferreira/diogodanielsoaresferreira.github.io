---
layout: post
title: "Why Quarkus Native (probably) does not fit your project"
date: 2024-02-19
excerpt: "What is Quarkus Native and comparison with JVM application"
tags: [java, software development, quarkus, native, cloud]
comments: true
---

<figure>
    <a href="/assets/img/quarkus-native/space.jpg"><img src="/assets/img/quarkus-native/space.jpg"></a>
    <figcaption style="text-align: center">Photo by <a href="https://www.flickr.com/photos/nicholasjones/" target="_blank">Nicholas Jones</a> on Flickr</figcaption>
</figure>

Hi there! I've been using Quarkus framework for some years now (since version 0.20.0), and I've noticed some hesitation regarding using native executables. Although for most use cases the drawbacks are bigger than the benefits, for some specific use cases, the native mode can really make the difference in a project.

Let's understand better what is Quarkus Native images and if it can benefit your project!


# What is Quarkus?

Before diving into native images, let's talk a bit about Quarkus.

If you've used Spring Boot, you'll notice the similarities. Quarkus is another Java framework with a similar approach to develop Web applications, but focusing on some key aspects, namely:
- **Developer joy** - Quarkus is focused on everything working with little to no configuration, with some features on this area being the development mode with live coding, a unified configuration file, a development UI, automatic provisioning of external services and continuous testing, to name a few.
- **Lower Boot time, lower resource utilization and higher efficiency** - Quarkus does many preprocessing steps at build-time, while other frameworks do them at runtime. Some of those steps are configuration parsing, classpath scanning and feature toggle based on classloading.
- **Made for cloud, serverless and containerized environments** - Quarkus applications are designed to run in containers from the start, with many extensions ready for Kubernetes, AWS Lambda, Azure Functions and Google Cloud Functions, as well as providing tracing, health and metrics tools that can easily integrate with Kubernetes, making it the perfect match.

<figure>
    <a href="/assets/img/quarkus-native/build-time-principle.png"><img src="/assets/img/quarkus-native/build-time-principle.png" style="background-color:black;"></a>
    <figcaption style="text-align: center">Image in <a href="https://quarkus.io/container-first" target="_blank">Quarkus website</a> showing the differences in the build and runtime steps when using traditional frameworks or Quarkus.</figcaption>
</figure>


# What is a native image?

By default, Java code is compiled to run in the JVM (Java Virtual Machine). However, it's possible to compile it to a native executable binary. To do that, we must use GraalVM. GraalVM compiles Java applications to standalone libraries using AOT (Ahead-Of-Time) compilation, instead of JIT (Just-In-Time) compilation used by the JVM. By doing that, the resulting native executable can run outside the Java Virtual Machine, just like any other executable. Because it uses AOT, it includes only the code required at runtime. Both Quarkus and Spring Boot support building native images.

# Why using Native images?

There are some advantages when using native images:
- **Run without JVM** - there is no need to use the JVM, since the native image can run as a standalone application.
- **Smaller startup time** - the startup time of a native image is much smaller because there is no need to perform tasks such as loading classes, initializing data structures or optimize bytecode, as it was already done in build time.
- **Lower memory usage** - JVM applications require memory to store the runtime environment, including the JVM itself, java standard library and other data structures. In the native image that is not needed, thus resulting in a much lower memory usage.
- **Reduced attack surface** - the attack surface of an application is reduced when using a native image because, among other things, all the unused code and dependencies are removed at build time and there is no dynamic class loading.
- **No warmup time** - the JVM has a substantial warmup time before reaching peak performance. That happens, among other things, because of lazy class loading. The native image has no warmup time because all classes are compiled to machine code and optimized during the build process. This means that the native application starts running at peak performance immediately after it is launched.


<figure>
    <a href="/assets/img/quarkus-native/warmup_issue.png"><img src="/assets/img/quarkus-native/warmup_issue.png"></a>
    <figcaption style="text-align: center">Slide from a <a href="https://youtu.be/zTG66zOL_rM?si=XRXpp9ZVm2iIAXL7&t=283" target="_blank">presentation done by Kevin Dubois in FOSDEM 2023</a>, showing the warmup issue and comparing Quarkus Native with Quarkus JVM.</figcaption>
</figure>


If a native image it's all that great, then why should't I be using it?


# Downsides of using native images

Using native images also has some disadvantages:
- **Slower execution** - native images are slower than JVM-based execution because they have little runtime optimization.
- **Slower compilation** - the compilation time of a native application is also bigger than a JVM-based application because there are more steps to perform during build-time.
- **Bigger file size** - the native binary consists mostly of two parts: the code of the application compiled to binary and the "image heap" of the preinitialized data structures and other components that are necessary for your application. This enables the startup time to be fast, because there is no need to initialize the heap memory (since it's already done), with the downside that the resulting executable file is usually bigger than the Jar file.
- **Worst monitoring (debugging and profiling)** - since the executable does not run on a JVM, it can be harder to monitor the application, since native images lack most debugging and profiling capabilites probided by the JVM, such as JMX or other known Java Agents.


Now that we know more about Native vs Non-native images, let's benchmark them!


# Benchmarks

For these benchmarks, I compare three applications: a Spring Boot Application running in JVM, a Quarkus application running in JVM and the same Quarkus application running as a native binary.
The applications have just one endpoint: `/hello`, which answers `Hello World`.

Let's start by comparing the build time.

- **Spring Boot**: 1.381 s
- **Quarkus**: 3.555 s
- **Quarkus Native**: 42.428 s

The difference in the build time is clear. Even in a machine with 32 GB and a dummy application with just one endpoint, the build time of Quarkus Native is much bigger than the JVM applications. For bigger applications or more limited resources, the build time of native applications can take several minutes (or more!). The build time of Quarkus is also substantially higher than the Spring Boot application, due to the optimizations that are done by Quarkus in build time.

Let's check the the output size of the application.
- **Spring Boot**: 19,7 MB
- **Quarkus**: 176,4 kB
- **Quarkus Native**: 49,6 MB

The Quarkus Native application has the bigger size, as expected and explained before. Also, out-of-the-box Quarkus Jar is impressively small, mainly due to many of the optimizations done at build-time.

We will now compare the startup time of each application:
- **Spring Boot**: 1.084 s
- **Quarkus**: 1.507 s
- **Quarkus Native**: 0.018 s

This is one of the biggest advantages of native executions: the startup time is blazing fast!

Now that we have our applications running, let's do some requests and measure the average memory usage of each one.
- **Spring Boot**: 56 MB
- **Quarkus**: 155 MB
- **Quarkus Native**: 2.4 MB

This is another big advantage when running native applications: the application resources used by the native executable are very small when compared with JVM-based execution.

Finally, let's compare the response time of the requests. For that, we will use <a href="https://locust.io/" target="_blank">Locust</a> , an open source load testing tool. The tests will run for 5 minutes, and will increase 4 requests per second every second until they reach 1000 requests per second.
Average response times:
- **Spring Boot**: 232 ms
- **Quarkus**: 322 ms
- **Quarkus Native**: 746 ms

As it can be seen, the Quarkus Native execution response time is slower than the other two JVM executions.

For reference, these tests were ran on a machine with the following specs:
- Memory: 32 GB
- CPU: AMD Ryzen 9 3900x 12-core processor, 24 threads
- Operating System: Ubuntu 22.04.4 LTS

Unfortunately, it was not possible to reach more than 1000 requests per second without being limited by limiting the RAM memory. A more extensive setup would be beneficial, with a dedicated and more powerful host running the load testing tool.

Thankfully, such analysis was already done <a href="https://quarkus.io/blog/runtime-performance/" target="_blank">in this Quarkus Blog Post</a>, which compares Quarkus JVM, Quarkus Native and Thorntail, and shows that Quarkus Native has a small penalty in terms of response time.


# After all, should I use Native images?

Native applications have some benefits when compared to JVM applications, mainly when it comes to startup time and resource usage. As such, there are three scenarios for which native images can be beneficial for you:
- Running applications in **resource-constrained environments**, such as small hardware devices (Paspberry Py-like devices) where resources are scarce.
- Running an application in a **cloud environment, as serverless applications**, where it's possible to scale to zero. In those scenarios, a small startup time is essential for the application to be readily available after its start.
- Creating standalone executables for **easy deployment and distribution** where a JVM is not available.

<figure>
    <a href="/assets/img/quarkus-native/AOTvsNative.png"><img src="/assets/img/quarkus-native/AOTvsNative.png"></a>
    <figcaption style="text-align: center">Slide from a <a href="https://youtu.be/zTG66zOL_rM?si=Ey3Za-Tk6xuugCBS&t=1069" target="_blank">presentation done by Kevin Dubois in FOSDEM 2023</a>, showing the tradeoffs between using AOT with GraalVM vs JIT with OpenJDK.</figcaption>
</figure>

I hope that's been useful to you. Thanks for reading!
