---
layout: post
title: "On Building a Platform from zero"
date: 2026-02-08
excerpt: "Some reflections on building a platform from zero"
tags: [career, software engineering, tips, software development]
comments: true
---

<figure>
    <a href="/assets/img/on-building-a-platform/platform.jpg"><img src="/assets/img/on-building-a-platform/platform.jpg"></a><figcaption style="text-align: center">Photo by <a href="https://unsplash.com/@davealmine?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Dawid Zawiła</a> on <a href="https://unsplash.com/photos/bare-tree-emerging-from-soft-morning-mist-hbUh0mnK7Tw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></figcaption>
</figure>

At Timefold we are building a platform for everyone to use planning models through a REST API. **Building a software platform from the ground up** is something thas has always fascinated me. It's amazing to see the progress done month after month in terms of scalability, performance and reliability. It's also interesting to look back and see where we failed, where we had unecessary complexity or when our assumptions were wrong.

Over these (more than) two years, here are **some of my learnings** on building a platform, in no particular order.

## Logging, Metrics & Alarms from day one
Logging, metrics and alarms are crucial to know what is happenning in the platform. You don't want to deploy a platform to production where you have no insight into it, behaving like a black box. To be able to improve its performance and reliability **you need to measure and understand the behaviour of your platform**. To define what metrics are important to track, think of the main use cases that your platform supports. As you improve your platform over time, add logging, metrics and alarms where you think you don't have enough observability, for example when your users report a bug before you can detect it.

## Audit logs for every operation done by a user
A useful feature to have in a platform it's an audit log. For every relevant action in the platform, it **records the identity of the requesting user along with the request parameters**. With an reliable audit log you can reconstruct the operations that led the platform to become in a specific state. This can be important from a security perspective, to identify malicious actors in your system, but also from a debugging perspective, to reproduce bugs reported by clients.

## Keep it simple
If there is a simple way to do something, that's the preferred approach to do it. **Don't overcomplicate your architecture**. This will make your platform easier to use, better adapted to the user needs and easier to modify. When building a platform from scratch, there are a lot of features that will be changed or even removed. By building a simple architecture, you will be saving yourself effort later.

## Keep the monolith as long as you can
This is a corollary of the previous point, but I decided to adress it separately because it's a common mistake (I certainly made it before). There are good reasons to split a single service into multiple services, such as different scaling requirements or if they are managed by different teams. However, if you don't have those requirements, don't do it. **Separate services have their own headaches**. With more moving parts comes harder debugging, increased latency and more complex coordination. A good rule of thumb is to keep the monolith for as long as you can and only split it if you really have to.

## Use cloud services to offload your team
It can be tempting to build everything ourselves (tip: don't reinvent the wheel!). It can also be tempting to host everything on-prem because it will be cheaper. However, nowadays many platform teams are small and are focused on shipping fast. The more components a team maintains (eg. storage, message queues, etc.), the more it will slow them down, and the more incidents they will have. **The solution is to rely on platforms as a service**. Yes, the visible cost may be higher than on-prem, but in the long-term (usually) the most expensive item of your platform is not the platform itself, but the engineers that maintain it. If your team can be focused on developing their own platform and not on maintaining external services, the total platform cost will almost always be less.

## Document (almost) everything
Document, document, document. **Every team decision should be documented in a shared space**. This includes code decisions (why is the code structured as is?), architectural decisions (why are we using service x instead of y), or product decisions (why is the API done like this?). Documenting everything is essential because as team elements come and go, context can be kept within the team and not lost. Even if the team elements do not change, the reason of many decisions will be forgotten in a few months if not written down. There are many ways to document decisions - Git repository, Confluence, Shared folder in Google Drice, Slack - any that fit your workflow is good enough.

## Be careful about cloud vendors lock-in
It's easy to start using a cloud vendor (eg. AWS, Google Cloud or Azure) and to use their services. However, **it's not wise to lock yourself into a specific vendor**. If their price goes up, their service becomes degraded, or by any other reason, you may want to switch from cloud provider. Trying to keep an independent approach towards cloud vendors is smart. If you need a specific service from them, you can always build an adaptor for your application that uses that service and that can be switched later to any other vendor, if needed.

## Understand the economics of your application
How are users paying for your platform? Is it per time spent in the platform? Is it with a subscription? Is it a one-time payment? All these questions are relevant for you to build the architecture of your platform. After all, you don't want to build a platform that costs more to run than what the users are paying for it. **Keep track of the cost of running your platform** (per user, if possible). Is there a way to make it run cheaper without degrading the service?

## Have users and gather feedback as early as possible
When building a platform from zero, you will have many assumptions about how users will use the platform, and you will build the architecture around it. But many of those assumptions will inevitably be wrong, and you will discover it once you start to see users interacting with it. Having that feedback as early as possible **helps you to course-correct and fix possible issues** with the architecture.

## Understand the bigger picture
I have to admit that this was my biggest mistake at the beginning (and of many junior engineers). Sometimes I was so focused on doing my task that I didn't ask why it was needed, and if it could be done in a better way. This is actually one of the key differences between a junior and a more experienced engineer: while the junior engineer is focused on doing its task well, **the experienced engineer is able to see the bigger picture beyond the task, understand the importance of each task in the context of the platform, and above all is able to ask the right questions**. If you can understand the reason behind each task and how it correlates with the platform vision, you'll be able to work much faster and reliably.

## An experienced team gives you a jump-start
Team members that have already built platforms from scratch can be the difference between building a useful platform or building an MVP that will have to be rebuilt once users start interacting with it. 
That’s because **experienced engineers have already made mistakes in the past and know how to avoid them**. They may be more expensive to hire, but they will pay for themselves in the long term.

Thanks for reading!
