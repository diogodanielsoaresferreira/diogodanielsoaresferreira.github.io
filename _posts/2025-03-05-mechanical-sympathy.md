---
layout: post
title: "Beyond AI Code Generation: The Art of Mechanical Sympathy"
date: 2025-03-05
excerpt: "Should you still bother learning programming languages?"
tags: [programming, c, backend development, software development, ai]
comments: true
---

<figure>
    <a href="/assets/img/mechanical-sympathy/writing_code.jpg"><img src="/assets/img/mechanical-sympathy/writing_code.jpg" style="max-width: 90%"></a><figcaption style="text-align: center">Getty Images</figcaption>
</figure>

Hi there! With the advent of AI tools capable of writing code at the level of a junior engineer, is the software developer job at risk? Should you still bother learning programming languages?

----------

## The Power of Mechanical Sympathy

Jackie Stewart, a former racing driver, once said "You don't have to be an engineer to be a racing driver, but you do have to have **Mechanical Sympathy**". A driver doesn't need to know every detail of the engine, but understanding how components work together makes them better at their craft.

The same applies to software engineering. This is also why **learning about assembly language and CPU architectures and memory management** is in most computer science courses curriculum. Learning about those topics is crucial, even if you don’t write assembly daily. It allows you to write more efficient code and debug issues faster.

**This knowledge is one of the key differences between a good and a great software engineer.**

-----------

## Debugging and Performance

Understanding what’s happening under the hood also helps when **developing assumptions** about the code:
- If a request to your relational database is slow, should you use a NoSQL database? Or would a simple indexing change fix it?
- If your program crashes randomly, is it a race condition, a memory leak, or CPU cache contention?
- If your high-performance loop is slow, is it due to inefficient memory access patterns or branch mispredictions?

By knowing how things work at a lower level, you can make **educated assumptions** about performance issues and bugs instead of relying purely on trial and error.

------------

## A Hands-On Example: Loop Optimization

Let's take a look at an example. The loop below just sums all numbers in a list. When I run it in my PC for 100000000 numbers, it takes 0.339 seconds.

```c
void sum(int *arr, int size, int *result) {
    *result = 0;
    for (int i = 0; i < size; i++) {
        *result += arr[i];
    }
}
```

The code below does the same thing. But when I run it under the same conditions is faster - 0.252 seconds.

```c
void sum(int *arr, int size, int *result) {
    *result = 0;
    int i = 0;
    for (; i + 3 < size; i += 4) {
        *result += arr[i] + arr[i+1] + arr[i+2] + arr[i+3];
    }
    for (; i < size; i++) {
        *result += arr[i];
    }
}
```

Why is the second version of code faster?
- **Instruction-Level Parallelism (ILP)**: Modern CPUs can execute multiple independent instructions in parallel. The second version allows more additions to be processed simultaneously.
- **Loop Control Overhead**: The first version has four times more loop condition checks (i < size), which add unnecessary CPU instructions.
- **Branch Mispredictions**: CPUs predict whether a loop will continue. If mispredicted, the pipeline must be flushed and restarted. The first loop has four times more branches, leading to more mispredictions and stalls.

Let's take a look at another example. Consider summing all elements of a 2D matrix stored in memory. The code below takes 0.171 seconds.

```c
#define N 1000
int matrix[N][N];

void sum() {
    long sum = 0;
    for (int col = 0; col < N; col++) {
        for (int row = 0; row < N; row++) {
            sum += matrix[row][col];
        }
    }
}
```

The code below does the same thing, but it takes only 0.129 seconds.

```c
void sum() {
    long sum = 0;
    for (int row = 0; row < N; row++) {
        for (int col = 0; col < N; col++) {
            sum += matrix[row][col];
        }
    }
}
```

Why is the latter faster?
- **CPU Cache Efficiency**: Memory is fetched in contiguous blocks (cache lines). Since C stores 2D arrays row-by-row, row-major traversal (the second version) follows memory order, maximizing cache hits.
- **Cache Misses in Column-Major Order**: The first version jumps across rows, repeatedly causing expensive cache misses and slowing execution.

---------------

## Why Engineers Still Matter

As systems are getting more complex, distributed and scalable, **AI lacks the ability to develop mechanical sympathy** for a system’s inner workings. Understanding how software interacts with hardware gives engineers an edge in writing high-performance code, debugging complex, low-level issues and making informed trade-offs in architecture decisions.

And how can you improve the mechanical sympathy for your systems? A way to do that is to join an on-call rotation. Watching systems break in real time teaches you more about performance bottlenecks than any AI-generated explanation ever will.

----------------

Understanding the layer beneath what you work on **makes you a better engineer**. It gives you an intuition for how your code interacts with the hardware and helps you make better decisions, whether you're debugging a tricky performance issue or designing scalable systems.

AI can assist in writing code, but **true expertise comes from understanding the system as a whole**, which is something that AI struggles to do.

Thanks for reading!
