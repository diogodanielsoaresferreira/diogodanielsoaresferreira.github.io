---
layout: post
title: "Give your AI agent superpowers with MCP"
date: 2025-07-17
excerpt: "Building an MCP Server with Java and Quarkus: Hands-On With Model-Context Protocol"
tags: [software engineering, software development, backend development, programming, ai, java, quarkus, mcp]
comments: true
---

<figure>
    <a href="/assets/img/mcp/connected.jpg"><img src="/assets/img/mcp/connected.jpg"></a><figcaption style="text-align: center">Photo by <a href="https://unsplash.com/@choys_?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Conny Schneider</a> on <a href="https://unsplash.com/photos/a-blue-background-with-lines-and-dots-xuTJZ7uD7PI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a></figcaption>
</figure>

Hi there! There are very exciting times ahead with the industry-wide adoption of **MCP (Model Context Protocol)**. But what is MCP? And from where did it come from?

## The limits of LLMs without tools

With the growing usage of AI agents, there is a need to integrate with external data and tools. Without access to the outside world, an agent is limited to operating within its confined environment, usually generating text, images or similar outputs. Tools provide an agent access to its environment, making it much more powerful and useful.

In the early days of LLMs (Large Language Models), it was common to see them write **"I don't have access to real-time information"**. These models were trained on static datasets and did not have access to anything beyond their training data. What if you wanted your agent to close the garage door, or to send an email? The agent couldn't do it, because it had no access to the outside world.

## Providing AI agents with external tools

To work around this limitation, developers began building custom tools. This meant creating a custom integration for each model-tool combination. Frameworks like LangChain or LlamaIndex introduced the concept of **Tools**, which provided a structured way to for models to invoke external functions. However, each tool still had to be implemented manually and depended heavily of the model being used.

Things improved with the introduction of **RAG (Retrieval Augmented Generation)**. RAG is a technique to retrieve and incorporate new external information into the prompt context. The model could now access up-to-date information, however it could not act on it. It was essentially read-only.

## Introducing MCP

<figure>
    <a href="/assets/img/mcp/mcp.png"><img src="/assets/img/mcp/mcp.png"></a><figcaption style="text-align: center">Image by <a href="https://www.anthropic.com/news/model-context-protocol">Anthropic</a></figcaption>
</figure>

To solve this problem, Anthropic introduced the MCP as an open stardard in November 2024. **MCP allows models to access tools and resources** in an unified and consistent way. Developers can also expose their tools without worrying about which model will use them. AI agents can now discover available tools choose the most appropriate one for their task.

## MCP Architecture

MCP follows a client-server architecture. MCP Hosts are typically AI applications (Claude Desktop, Cursor, etc.) that have a client that connects to an MCP server. The server provides the AI applications context and capabilities, such as external tools (for example, to access an API or a database).

There are mainly two ways of communicating between the client and the server: **Stdio (Standard Input/Output)**, used when the client and the server run on the same machine, and **SSE (Server-Sent Events)**, used when they connect over HTTP.

## MCP Capabilities

MCP provides four capabilities:
- **Tools** - Actions that the model can execute, such as sending an e-mail or querying a database;
- **Resources** - Data that the model can access to retrieve context, similar to a GET request in a REST API (eg. access a file);
- **Prompts** - Templates or workflows that guide the interaction between the model and the MCP server;
- **Sampling** - Requests initiated by the MCP server for the model to perform an interaction, typically used as part of a tool's execution.

## MCP Server Implementation using Quarkus

Let’s build a simple MCP server that helps a car dealership sell cars. Since tools are the core of MCP, we’ll implement three tools in our server:

- A tool to **list** all available cars;
- A tool to **fetch the price** of a specific car;
- A tool to **purchase** a car.

The project is done using Java and Quarkus. The full implementation can be found in <a href="https://github.com/diogodanielsoaresferreira/mcp-demo" target="_blank">this repository</a>.

```java
@Singleton
public class McpResource {

    @Tool(description = "Get the information about the available cars")
    public List<String> fetchAvailableCars() {
        return List.of(
                "Mercedes-Benz C-Class",
                "Mercedes-Benz E-Class",
                "Mercedes-Benz S-Class",
                "Mercedes-Benz GLC",
                "Mercedes-Benz GLE",
                "Toyota Camry",
                "Toyota Corolla",
                "Toyota Land Cruiser",
                "Honda Civic",
                "Honda Accord",
                "Ford Focus",
                "Ford Mustang",
                "Chevrolet Cruze",
                "Chevrolet Malibu",
                "Nissan Altima",
                "Nissan Leaf",
                "Kia Optima",
                "Hyundai Elantra",
                "Hyundai Sonata",
                "Renault Clio",
                "Renault Megane",
                "Peugeot 208",
                "Peugeot 308",
                "Volvo S60",
                "Volvo V60",
                "Mazda3",
                "Mazda CX-5");
    }

    @Tool(description = "Get information about a price of a car")
    public String fetchCarInfo(@ToolArg(name = "brand") String brand) {
        if (brand.equals("Mercedes-Benz C-Class")) {
            return "80000";
        } else {
            return "100000";
        }
    }

    @Tool(description = "Buy a car")
    public String buyCar(@ToolArg(name = "userName") String name, @ToolArg(name = "brand") String brand) {
        return "Successful transaction";
    }

}
```

Now that the server is implemented, let's test it locally with Claude.
To do that, we need to configure the MCP server in the claude MCP configuration as follows.

```json
{
  "mcpServers": {
    "carDealershipTools": {
      "command": "java",
      "args": [
        "-jar", "~/Desktop/mcpdemo/target/mcpdemo-1.0-SNAPSHOT-runner.jar"
      ]
    }
  }
}
```

<figure>
    <a href="/assets/img/mcp/claude_4.png"><img src="/assets/img/mcp/claude_4.png"></a>
</figure>

Looks like the tools are correctly configured! Let's prompt Claude to buy a car and see if it works correctly.

<figure>
    <a href="/assets/img/mcp/claude_1.png"><img src="/assets/img/mcp/claude_1.png"></a>
    <a href="/assets/img/mcp/claude_2.png"><img src="/assets/img/mcp/claude_2.png"></a>
    <a href="/assets/img/mcp/claude_3.png"><img src="/assets/img/mcp/claude_3.png"></a>
</figure>

There it is, our MCP server is providing the tools for a car dealership chatbot to aid customers in buying cars.

There are already many useful **MCP servers available**, ranging from weather services and file system tools to integrations with YouTube or Spotify. You can explore curated lists of these servers [here](https://mcpservers.org) or [here](https://mcp.pipedream.com/).

## The Dangers of MCP Access

MCP servers can act as an interface between AI agents and your APIs. But before rushing to build them, it’s important to understand the risks that come with granting agents access to powerful MCP tools.

While MCP tools significantly enhance the capabilities of AI agents, they also introduce **serious risks** if not properly managed. Granting an agent access to tools like file systems, payment processors, or external APIs means it can perform real-world actions with real-world consequences. Without strict controls, validation, and sandboxing, **a poorly instructed or malicious agent could delete data, leak sensitive information, or make unauthorized transactions**. The more powerful the tools, the higher the responsibility on developers to enforce safeguards, including permissioning, auditing, and limiting tool access to only what’s absolutely necessary.

As many things, **with great power comes great responsibility**.

Thanks for reading!
