---
layout: post
title: "Using WebSockets to make an online pong game"
date: 2025-02-08
excerpt: "How to use websockets to make an online game"
tags: [programming, websockets,python, backend development, software development]
comments: true
---

<figure>
    <a href="/assets/img/pong/pong_game.gif"><img src="/assets/img/pong/pong_game.gif" style="max-width: 90%"></a>
</figure>

Hi there! Full-duplex communication is becoming essential modern application. The days of relying solely on traditional request/response models with REST APIs are long gone. From multiplayer games to chat apps and collaborative editing, **real-time updates are everywhere**.

One of the most popular technologies for enabling real-time communication is WebSockets. In this post, I'll walk you through **how I used WebSockets to implement a Pong game**. You can play the game and check out the code in [this repository](https://github.com/diogodanielsoaresferreira/pong).

---------------------
# Why Websockets?

Before WebSockets became a standard in 2011, real-time communication was typically handled by **polling**, where the client repeatedly sent HTTP requests to check for new data. However, this approach causes some problems:
- **High server load** - If 1000 clients poll the server every second, the server has to handle at least 1000 requests per second. As the number of client grows, the server can quickly become overwhelmed, processing a large number of redundant requests even when there is no new data.
- **High overhead** - Every HTTP request starts a new connection, requiring a new TCP handshake and potentially a TLS handshake (for HTTPS). This adds significant overhead, mainly for frequent small requests.
- **Increased Latency** - Clients receive updates only at fixed intervals, meaning real-time events can be delayed, leading to a slower and less responsive experience, which is especially problematic in applications like gaming, chat and live collaboration.

Because of these reasons, HTTP polling often results in a laggy, inefficient and resource-intensive experience, making it a poor choice for real-time applications.

There are other options to implement low-latency communication between a client and a server:

- **Server-Sent Events (SSE)** are a simple and efficient way for the server to push updates to the client over a persistent connection. However, SSE are unidirectional, meaning the client cannot send messages back to the server over the same channel.
- **WebRTC** is primarily designed for Peer-to-Peer (P2P) communication and excels in media streaming and real-time video/audio. However, for most applications, it’s overly complex, requiring significant setup, high CPU usage, and intricate network handling.
- **Comet** is the predecessor to WebSockets, and enables the server to push updates to clients using long polling (keeping an HTTP connection open until new data is available). While it reduces latency, it wastes resources by keeping multiple HTTP connections open and still requires separate client requests for sending data.
- **Raw Sockets** (TCP/UDP) provide true bidirectional, low-latency communication, but they don’t work well through firewalls and NATs since they don’t use standard HTTP ports. UDP is especially useful for high-performance applications like real-time multiplayer games, where minimizing latency is crucial.

While each of these approaches has its place, WebSockets strike the right balance between efficiency, simplicity, and broad compatibility for most real-time applications.

---------------------
# How do Websockets work?

WebSockets are designed to work over the **existing HTTP infrastructure**, ensuring compatibility with modern web architectures without requiring changes to network or client configurations.

<figure>
    <a href="/assets/img/pong/Websocket_connection.png"><img src="/assets/img/pong/Websocket_connection.png"></a>
    <figcaption style="text-align: center">By Brivadeneira - Own work, CC BY-SA 4.0, <a href="https://commons.wikimedia.org/w/index.php?curid=82810859">Wikipedia</a></figcaption>
</figure>

The protocol is straightforward: the client initiates a handshake over HTTP, which is acknowledged by the server. From there, a persistent bidirectional channel is setup, and the client or the server can send messages at any time without waiting for a request. Either party can close the channel when needed.

This solves the server overload problem because **there is no polling**. The client no longer needs to repeatedly request updates, as the server can push data in real time.

It also reduces the protocol overhead required by relying on HTTP handshake for the connection establishment while maintaining an efficient and lightweight communication channel.


---------------------
# Implement an online Pong game

My goal was to implement a 2-player online pong game using Python and the websockets library.

The game follows a client-server model, where both players communicate with a central server via WebSockets to exchange game actions and state updates.

<figure>
    <a href="/assets/img/pong/pong_interaction_diagram.png"><img src="/assets/img/pong/pong_interaction_diagram.png"></a>
</figure>

## Creating a game

- A player sends a `create` message to the server, with a chosen game name.
- The server responds with a `created` message. indicating that the game was created and it's waiting for an opponent.

## Joining a game

- The second player sends a `join` message to the server with the name of the game that they want to join.
- The server answers with a `joined` message.

## Game loop

- We now have both players connected, so the game is on! The server will broadcast for both players the state of the game: the ball position and paddle positions.
- Each player can send `move` messages to control their paddles: `up`, `down`, or `none`.

## Preventing Cheating

Each player can only send `up` or `down` messages, and cannot directly update their position (`move to position x`). This is important to avoid players from cheating. Only the server should manage the game state and players should only send actions to the server, not state messages.

---------------------
# What about Network Latency?

In this guide, I implemented a simple version of pong without focusing on network lag. However, in more complex, time-sensitive games, such as first-person shooters (FPS) or real-time strategy (RTS) games, **high latency can degrade the game experience**, or even make the game unplayable. How to solve this problem?

There are two common techniques that can be used to compensate for network latency.

## Client-side Prediction
In this case, the **client predicts the result of the player's action** without waiting for the server's response. In most cases, the server should confirm the prediction and the player won't notice any difference. However, if the server sends a different state of the player, the client must correct the player's position, potentially causing a visual hitch.

In the pong game, this would mean to move the paddle instantly when a player presses a key, without waiting for the server's confirmation. If the server later corrects the position, the paddle might appear to "jump" slightly.

## Lag Compensation
Imagine you're playing a first-person shooter and you clearly hit the enemy's head. But somehow you still miss. How is that possible? Maybe the action reached the server too late and the enemy was not there anymore.

In this case, lag compensation should fix the problem. **The client should not only send the action, but also the state of the world**. In that state of the world, the enemy would be shot. The server can then reconstruct the game state at that moment and process the action accordingly.

While this makes shooting feel fairer for the attacker, it can feel frustrating for the target. For example, a player who already moved behind cover might still get hit because, in the past game state, they were still exposed.

<figure>
    <a href="/assets/img/pong/Lag_compensation.jpg"><img src="/assets/img/pong/Lag_compensation.jpg"></a>
    <figcaption style="text-align: center">Historic client enemy position (red) versus server enemy position (blue), <a href="https://developer.valvesoftware.com/w/index.php?curid=1969">Valve Developer Community</a></figcaption>
</figure>

If you want to learn more about this topic, there is a great guide about it in [Valve developer community](https://developer.valvesoftware.com/wiki/Latency_Compensating_Methods_in_Client/Server_In-game_Protocol_Design_and_Optimization).

For such a simple game such techniques would bring little benefit, so they were not applied.

---------------------

Now that you’ve seen how WebSockets enable real-time communication, why not experience it yourself? [**Give the game a try and see how it feels!**](https://github.com/diogodanielsoaresferreira/pong) You can play against an AI or even with two players on the same keyboard, a version that runs entirely locally without the need for WebSocket communication.

Feel free to [clone the repository](https://github.com/diogodanielsoaresferreira/pong), play the game, and improve it with your own ideas.

Thanks for reading!