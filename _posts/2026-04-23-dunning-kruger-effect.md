---
layout: post
title: "The Dunning-Kruger Effect: Why Your First 6 Months With a Framework Are a Lie"
date: 2026-04-23
excerpt: "Your first 6 months with a framework: 'I can build anything.' Two years in: 'I know nothing.' Let's talk about why."
tags: [software engineering, software development, backend development, programming, ai]
comments: true
---


Hi there! I love learning. Who doesn't? I'm a firm believer that learning compounds over time and is the greatest leverage anyone has, in every area of life. But the *process* of learning has a sneaky trap built into it.

You usually start with an idea of what you want to learn and then go searching. Websites, books, videos, online courses — all fair game. At the beginning, everything makes sense. Concepts make sense, tutorials work on the first try, and you get that warm feeling: *"Hey, this isn't so hard after all."*

Then you start going deeper. And that's when you realize... it's not so straightforward.

## The Dunning-Kruger Effect

<figure>
    <a href="/assets/img/dunning-kruger-effect/Dunning–Kruger-effect-g.jpeg"><img src="/assets/img/dunning-kruger-effect/Dunning–Kruger-effect-g.jpeg"></a><figcaption style="text-align: center">Source: <a href="https://thedecisionlab.com/biases/dunning-kruger-effect">The Decision Lab</a></figcaption>
</figure>

The Dunning-Kruger effect is a cognitive bias where people with low ability in a given area overestimate their competence. The less you know, the less equipped you are to recognize what you don't know.

Take learning a new language. After picking up your first hundred words, you might think: *"Give me a few months and I'll be having conversations."* But a few months in, you realize conjugation tables go on forever, idioms make no sense and native speakers talk way too fast. The mountain suddenly looks a lot taller from up close.

The inverse is just as real. Highly competent people tend to underestimate their knowledge, which often leads to impostor syndrome. As Socrates supposedly put it: *"I only know that I know nothing."*


## My Beautiful Big Ball of Mud

<figure>
    <a href="/assets/img/dunning-kruger-effect/journey-to-competence.jpg"><img src="/assets/img/dunning-kruger-effect/journey-to-competence.jpg"></a><figcaption style="text-align: center">Source: <a href="https://thedecisionlab.com/biases/dunning-kruger-effect">The Decision Lab</a></figcaption>
</figure>

What software engineer wasn't once the naive, just-graduated engineer straight out of college, ready to take on the world? I certainly was.

My bachelor's project was built with Django. At the start, I had a loads of confidence. I could build anything. Features kept coming in and I kept piling them on. Technical debt was growing, but I didn't know better.

By the end of the semester, the main project file — [`views.py`](https://github.com/diogodanielsoaresferreira/IoTCity/blob/master/Projeto/IoTcity_services/server/server/mainserver/views.py) — had **2,621 lines** (yes, I went back to check). That single file contained basically all the business logic of the entire application. It was my beautiful big ball of mud. Thankfully, no one had the burden of maintaining it for very long.

The pattern is universal among developers. Your first six months with a framework: *"I can build anything."* Two years in: *"I know nothing."*


## The Dunning-Kruger effect can be dangerous

The Dunning-Kruger effect can be genuinely dangerous, both professionally and personally.

In software, it leads to unmaintainable systems, mounting technical debt and architecture decisions that haunt teams for years. Think about the developer who decides their monolith needs microservices after reading a blog post, or the one who reaches for the shiniest new framework without understanding the tradeoffs. Without the experience to know what can go wrong, everything looks like a good idea.

This is exactly why mentorship matters so much. Senior engineers aren't just there to write better code, they're there to help junior engineers see the edges of what they don't yet know. Without that guidance, a lot of systems end up in rough shape fast.

The same principle applies beyond tech. Someone who just started managing their own money might feel like they've got it figured out after a few good months (VWCE & chill, right?), right up until the market corrects and they realize they were never managing risk at all.


## The Age of Vibe Coding

This feels especially relevant right now. With AI-assisted coding, it's easier than ever to build something that *works* without understanding *why* it works. You can vibe-code your way to a functional prototype in an afternoon, and the Dunning-Kruger peak has never been easier to reach.

That's not necessarily bad: faster prototyping is great! But it does mean the gap between "it runs" and "it's maintainable, secure, and scalable" is wider than ever. And if you don't know the gap exists, you won't know to close it.


## The Antidote

The good news is that awareness is half the battle. If you know about the Dunning-Kruger effect, you can watch for it in yourself. A few things that help:
- Seek out people who know more than you and actually listen to them. Find mentors, read code written by experienced engineers, and resist the urge to dismiss feedback that doesn't match your self-assessment.
- Stay curious and stay humble. The more you learn, the more you realize how much there is left to learn, and that's not a bad thing (although it can feel bad to know we did something wrong). That's the whole point.
- The peak of Mount Stupid is a fun place to visit. Just don't build your house there.

Thanks for reading!
