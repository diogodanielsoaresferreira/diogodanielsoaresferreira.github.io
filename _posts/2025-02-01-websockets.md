---
layout: post
title: "Using WebSockets to make an online multiplayer pong game"
date: 2025-02-01
excerpt: "How to use websockets to make an online multiplayer game"
tags: [programming, websockets,python, backend development, software development]
comments: true
---

<figure>
    <a href="/assets/img/pong/pong_game.gif"><img src="/assets/img/pong/pong_game.gif" style="max-width: 90%"></a>
</figure>

Hi there! Full-duplex communication is becoming essential modern application. The days of relying solely on traditional request/response models with REST APIs are long gone. From multiplayer games to chat apps and collaborative editing, **real-time updates are everywhere**.

One of the most popular technologies for enabling real-time communication is WebSockets. In this post, I'll walk you through **how I used WebSockets to implement a Pong game**. You can play the game and check out the code in [this repository](https://github.com/diogodanielsoaresferreira/pong).

---------------------

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

WebSockets were designed to work over the HTTP protocol, which means that it will work on current web architectures without the need for changes in network or client configurations.

The websocket protocol is simple: it starts with a handshake that is initiated by the client and acknowledged by the server. From there, a bidirectional channel is setup, and the client or the server can send messages in the channel. In the same way, any part in the exchange can close the channel.

This solves the problem of overloading the server because there is no polling. Because the server can send data to the channel without being prompted, there is no need for the client to constantly check if the server has new messages.

It also eliminates much of the overhead required in other implementations by relying on HTTP.


---------------------

My goal was to implement a 2-player network pong game. To do that, I used Python and the library websockets.

In my pong game implementation, there is a client and a server, which exchange messages using WebSockets to communicate the actions and the state of the game.

When a client wants to start a game, it sends a "create" message to the server, which has the name of the game to be created. The server should hopefully answer with a "created" message, which means that the game was created and it's waiting for another player to join.

When the second player joins, it sends a "join" message to the server with the name of the game that it wants to join. If all goes well, the server should answer with a "joined" message.

We now have both players in the connection, so the game is on! The server will broadcast for both players the state of the game: where the ball is and where each paddle is. Each player can also send "move" messages, that make their paddle move in one direction: up, down, or none.

Notice that each player can only send "move up" or "move down" messages, and cannot say "move to position x". This is important to avoid clients from cheating. Only the server should manage the game state and clients should only send actions to the server, not state messages.

---------------------


I used the python library PyGame to implement the UI. It's important to clearly separate the UI from the game engine, since the game engine will be used only by the server, and the client will be only rendering the game.

The game engine is pretty simple. There are two paddles that can only move up or down, and a ball that moves at a constant velocity, but speeds up everytime it hits on a paddle. When a ball hits a paddle, it shifts its direction depending on where it hit the paddle. If the ball moves past the paddle, it's a point for the other player.

Try the game and see how it feels. I also added the option for playing against an AI, or two players in the same keyboard. The game is the same without the need for the messages between the client and the server.

---------------------


In this guide, I implemented a simple version of pong without caring too much about the lag. The truth is that with more complex games that require more precision and where timing is essential (for example Online FPS), a high lag can really degrade the game experience, or even make the game completely unusable. How to solve this?

There are two techniques that can be used to combat network latency.

- Client-side Prediction
In this case, the client tries to predict the result of the action of the player without waiting for the server message. In most cases, the server should confirm the prediction and the user should not even see the difference. However, if the server sends a different state of the player, it can cause a hitch in the player position. In the pong game, this would mean to change move the paddle up or down without waiting for the server to confirm the move.

- Lag Compensation
Imagine that you are playing a first-person shooter and you are sure that you hit the target's head. But somehow you still miss. How is that possible? Maybe the action reached the server too late and the target was not there anymore.
In this case, lag compensation should fix the problem. The idea here is for the client to not only send the action, but also to send the state of the world as is known by the client. In that state of the world, the target should be shot. The server can then reconstruct the world at that instant and update the world state.
The tradeoff is that the target, which can be another player, can find it weird being shot, specially if meanwhile is moved to be behind a wall - the truth is that it should have been killed a few moments earlier.

IMAGE https://developer.valvesoftware.com/wiki/Lag_Compensation

If you want to go more in-depth, there is a great guide in Valve developer community (https://developer.valvesoftware.com/wiki/Latency_Compensating_Methods_in_Client/Server_In-game_Protocol_Design_and_Optimization).

For such a simple game such techniques would bring little benefit, so they were not applied.

---------------------

Now that you’ve seen how WebSockets enable real-time communication, why not experience it yourself? Feel free to clone the repository, play the game, and improve it with your own ideas.

Thanks for reading!