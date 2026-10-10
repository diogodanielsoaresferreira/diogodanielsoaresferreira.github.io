---
layout: post
title: "What Happens to Software Engineering Salaries When Code Gets Cheap?"
date: 2026-10-10
excerpt: "AI is making code cheap. A bit of economics to understand what that means for our salaries."
tags: [career, software engineering, ai, economics]
comments: true
---

Hi there! A couple of years ago, AI could autocomplete a function. Today it can write a whole feature while I go grab a coffee. Writing code has never been this cheap.

If you're a software engineer, you've probably asked yourself the uncomfortable follow-up: *if code is cheap, am I about to be cheap too?*

Economists have been thinking about this kind of question for a couple of centuries. So let's borrow a few of their tools and see where they take us.

## Economics 101

Prices are set where the demand and supply curves meet. The demand curve shows how much of something buyers want at each price: the cheaper it is, the more they buy. The supply curve shows how much producers are willing to sell at each price: the higher the price, the more they produce. Where the two cross, we get the market price.

<figure>
    <a href="/assets/img/software_economics/01-supply-demand.png"><img src="/assets/img/software_economics/01-supply-demand.png" alt="When supply shifts right, the price drops and the quantity goes up"></a><figcaption style="text-align: center">When supply shifts right, the price drops and the quantity goes up</figcaption>
</figure>

Now apply this to software, the product, not to us. When AI makes code cheaper to produce, companies can build the same software with less effort. In economic terms, the supply curve shifts to the right. The new crossing point has a lower price and a higher quantity. So software gets cheaper and there's more of it.

## Is Software Like Water or Like Flights?

But how much more software do people buy when it gets cheaper? That "how much more" has a name: **elasticity**. Demand is elastic when a drop in price makes people buy a lot more, and inelastic when they keep buying about the same.

Water is the classic inelastic example. If the price of water halved tomorrow, would you shower twice as long? Probably not. Flights are the opposite. When low-cost airlines made flying cheap, people didn't just take the same trips for less money. They started flying to other cities for the weekend.

<figure>
    <a href="/assets/img/software_economics/02-elasticity.png"><img src="/assets/img/software_economics/02-elasticity.png" alt="Same price drop, but an elastic good has much higher quantity bought"></a><figcaption style="text-align: center">Same price drop, but an elastic good has much higher quantity bought</figcaption>
</figure>

So which one is software? Arguably, it's much closer to flights. Every company has a backlog of things nobody builds because they aren't worth the engineering time: internal dashboards, scripts that automate a boring manual process, integrations with legacy systems, etc. Outside tech it's even more obvious. Your local bakery won't pay for custom software today, but it might if it cost a tenth of the price (although whoever builds it might be the owner's nephew with an AI tool, not a software engineer).

## The Jevons Paradox

In 1865, the economist William Jevons noticed something odd. Steam engines had become much more efficient at burning coal, so you would expect Britain to use less of it. The opposite happened. Coal power became cheaper, so it was used for many more things, and total coal consumption went up.

This is the **Jevons paradox**: making a resource more efficient to use can increase how much of it we consume. We've seen it in our own field. The cloud made computing cheaper to rent and companies now spend far more on compute than ever. Compilers and high-level languages made each programmer massively more productive and we ended up with more programmers, not fewer.

<figure>
    <a href="/assets/img/software_economics/03-jevons-paradox.png"><img src="/assets/img/software_economics/03-jevons-paradox.png" alt="Efficiency goes up and so does total use (illustrative)"></a><figcaption style="text-align: center">Efficiency goes up and so does total use (illustrative)</figcaption>
</figure>

But Jevons only tells us we'll consume more *code*. It doesn't promise more *engineers*.

When power looms arrived in 19th-century Britain, cloth got much cheaper and people bought far more of it, just as Jevons would predict. Yet the handloom weavers who used to make that cloth saw their wages collapse and within a few decades most of them had left the trade. The industry as a whole still hired plenty of people, though, because someone had to run the new factories. What disappeared was a specific skill, along with the people who had built their careers on it. That's much closer to the risk we face.

## From Software to Engineers

To get from "more software" to salaries, we need one more idea, which economists call **derived demand**. Companies don't want engineers for their own sake. They want software and they hire us to build it.

That means two forces pull in opposite directions:

- Each feature needs fewer engineering hours, which pushes demand for engineers down.
- Software gets cheaper, so companies want a lot more of it, which pushes demand for engineers up.

<figure>
    <a href="/assets/img/software_economics/04-derived-demand.png"><img src="/assets/img/software_economics/04-derived-demand.png" alt="Two forces pull on the demand for engineers"></a><figcaption style="text-align: center">Two forces pull on the demand for engineers</figcaption>
</figure>

Which one wins depends on the elasticity we talked about. Roughly, if software gets 50% cheaper and companies want more than twice as much of it, there's more work for engineers than before. If they want less than that, fewer engineers are needed.

Salaries are the price of engineering work, so the same supply and demand logic applies one level down. If demand for engineers grows faster than the number of people who can do the job, pay goes up. If it grows slower, or if supply grows faster (new graduates, layoffs, or people outside the profession building things with AI), pay goes down.

All of this assumes every engineering task gets cheaper at the same rate, which isn't the case.

## Code Has Complements

In economics, **complements** are goods that are used together, like printers and ink, or cars and fuel. When one gets cheaper, demand for the other goes up. Cheaper cars meant more people driving, which meant more fuel sold.

Our job is a bundle of tasks, and they don't all get cheaper at the same rate. AI is great at writing well-specified code, boilerplate and tests. It's much weaker at figuring out what should be built in the first place, designing systems that survive years of changing requirements, debugging a problem that spans three teams and being the person who gets paged when it breaks.

<figure>
    <a href="/assets/img/software_economics/05-complements.png"><img src="/assets/img/software_economics/05-complements.png" alt="When one thing gets cheaper, the things used with it are needed more"></a><figcaption style="text-align: center">When one thing gets cheaper, the things used with it are needed more</figcaption>
</figure>

Those harder tasks are complements to code. The more code we can generate, the more we need someone who knows *what* to generate, can check that it's correct and takes responsibility for it running in production. As code gets cheaper, those skills should get more valuable, at least as long as AI doesn't catch up on them too.

## So, What Happens to Our Salaries?

I don't think software engineering salaries will simply go up or down. I think the gap between the lowest and highest paid engineers will grow.

- Entry-level roles will feel the most pressure. Junior engineers often get the most well-defined tasks, which is exactly where AI is strongest. That creates a problem for later, because today's juniors are tomorrow's seniors. Fewer juniors now could mean scarcer (and more expensive) seniors in a few years.
- Engineers who can be trusted with a whole problem will be worth more. If you combine technical depth with domain knowledge and can direct and check AI output, you get a lot more done than you could before.
- The middle might shrink, at least for a while. By the middle I mean engineers whose main job is turning clear tickets into working code. If one engineer can do the work of three, a company with a fixed roadmap will hire fewer people, even if the industry as a whole ends up building more software.

There's a lot of uncertainty here. Nobody knows how elastic software demand really is, and the line between "cheap" and "scarce" tasks moves with every new model. It's also hard to separate the effect of AI from interest rates and funding cycles.

Whatever happens, spend less energy competing with AI on typing speed and more on what it struggles with: understanding the problem, knowing the domain, and checking that the result is right.

Code is cheap. Correct, safe, integrated and useful software is still expensive and scarce.

Thanks for reading!