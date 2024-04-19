---
layout: post
title: "Using contract testing for your microsservices"
date: 2024-04-15
excerpt: "How to use contract testing to deploy faster, easier and more often"
tags: [python, testing, software development, backend development]
comments: true
---

<figure>
    <a href="/assets/img/contract-testing/train.jpg"><img src="/assets/img/contract-testing/train.jpg"></a>
    <figcaption style="text-align: center">Photo by <a href="https://www.flickr.com/photos/10157133@N08/" target="_blank"> Norbert Clausen</a> on Flickr</figcaption>
</figure>

Hi there! Contract testing is a great tool for building microservices architectures, enabling the fast development of interacting components while maintaining confidence in the integrity of the system as a whole. By defining and verifying contracts between services, teams can iterate rapidly without the fear of inadvertently breaking downstream dependencies. In this blog post, we'll explore the fundamentals of contract testing, its benefits, and practical tips for implementation. Let's get started!

---

Contract testing is a way to define and test an **interface between two services that need to communicate**. It can be between a web server and a front-end client, but it can also be between a consumer and a provider of a message broker.

Many times, two teams agree on an interface for two services to communicate, only to discover in integration testing (or worse, in production) that there was some misconception about how the services should interact. This often results in frustrating delays, costly rework, and a lot of finger-pointing.

Contract testing aims to address this issue head-on by providing a mechanism for teams to validate their assumptions about service contracts early and continuously throughout the development lifecycle. By detecting discrepancies in expectations upfront, teams can preemptively resolve issues and ensure smoother integrations down the line.

The goal of contract testing is not to replace integration testing. However, it's to reduce the amount of integration testing needed, by testing the contract earlier in the development cycle, allowing for faster feedback loops to speed up software delivery.

<figure>
    <a href="/assets/img/contract-testing/testing_pyramid.png"><img src="/assets/img/contract-testing/testing_pyramid.png"></a>
    <figcaption style="text-align: center">Source: Consumer-Driven Contract Tests for Microservices: A Case Study, Lehvä, J., Mäkitalo, N., Mikkonen, T. (2019)</figcaption>
</figure>


---

Let's look at an example to understand how it works.

Every contract needs at least one consumer and at least one producer. We will implement in Python (using Flask) a simple client-server interaction. The server has an endpoint for requesting the stock ticker of a company. For example, when performing a rest request to /ticker/Amazon, it should answer with "AMZN".

```python
from flask import Flask

app = Flask(__name__)

ticker = {
    "ASML": "ASML",
    "Amazon": "AMZN",
    "Microsoft": "MSFT"
}

@app.route('/ticker/<company>')
def get_company_ticker(company):
    return ticker[company] if company in ticker else ""

if __name__ == '__main__':
    app.run(debug=True, port=5001)
```

The client has the goal of discovering in which stock exchange the company is listed. Amazon, for example, is listed in NASDAQ stock exchange.

```python
import requests

class StockExchange(object):
    def __init__(self, base_uri):
        self.base_uri = base_uri

    def get_company_stock_exchange(self, company):
        stock_exchange = {
            "AMZN": "NASDAQ",
            "MSFT": "NASDAQ",
            "ASML": "NASDAQ"
        }
        uri = self.base_uri + '/ticker/' + company
        response = requests.get(uri)
        if response.status_code == 404:
            return None
        return stock_exchange[response.text] if response.text in stock_exchange else ""
```

As you can see, the StockExchange class requests the ticker of a company to the previous service.
How can we test this interaction? We have three options.

## Integration Testing

<figure>
    <a href="/assets/img/contract-testing/integration_tests.gif"><img src="/assets/img/contract-testing/integration_tests.gif"></a>
    <figcaption style="text-align: center">Source: <a href="https://pactflow.io/how-pact-works/?utm_source=ossdocs&utm_campaign=getting_started#slide-1">PactFlow</a></figcaption>
</figure>

We start an instance of the server everytime we want to test the client. This scenario would be the closest to the production environment. However, it would also be the most costly option in terms of time and resources. Setting up and tearing down the server for each test can slow down the testing process and make it less efficient, especially as the application grows in complexity. We should fallback on integration tests as little as possible.

## Unit testing

<figure>
    <a href="/assets/img/contract-testing/unit_tests.gif"><img src="/assets/img/contract-testing/unit_tests.gif"></a><figcaption style="text-align: center">Source: <a href="https://pactflow.io/how-pact-works/?utm_source=ossdocs&utm_campaign=getting_started#slide-1">PactFlow</a></figcaption>
</figure>

With unit tesing, we can simulate the behaviour of the server without actually starting it. This means that we do not need to start in instance of it everytime we want to run a test in the client. However, it's also more prone to errors, since the expected implementation of the server can actually diverge from the actual implementation. This means that we may actually be setting up our mock with wrong data and having wrong expectations in tests, and we may never find until the error comes up in integration testing or in a live environment.

## Contract testing

<figure>
    <a href="/assets/img/contract-testing/consumer_test.gif"><img src="/assets/img/contract-testing/consumer_test.gif"></a><figcaption style="text-align: center">Source: <a href="https://pactflow.io/how-pact-works/?utm_source=ossdocs&utm_campaign=getting_started#slide-1">PactFlow</a></figcaption>
</figure>

Contract testing solves the problem of diverging the expectations from the actual implementation without the need to start the server. From the client (or consumer) side, setting up a contract test is very similar to setting up a mock. However, after the test is run, a contract is generated, that can then be tested against the actual server. If the implementation diverges from what is specified in the contract, the test will fail. In this way, we can also test the integration between both parties without the need for a dedicated test environment and removing the need for release coordination, because we have static knowledge about system compatibility.

<figure>
    <a href="/assets/img/contract-testing/provider_test.gif"><img src="/assets/img/contract-testing/provider_test.gif"></a><figcaption style="text-align: center">Source: <a href="https://pactflow.io/how-pact-works/?utm_source=ossdocs&utm_campaign=getting_started#slide-1">PactFlow</a></figcaption>
</figure>

---

To implement contract tests we will be using pytest and Pact, the most popular tool for designing contract tests.
Let's start by implementing the tests on the client side. First, let's set up pact.

```python
import pytest
import os

from client import StockExchange
from pact import Consumer, Provider

PACT_MOCK_HOST = 'localhost'
PACT_MOCK_PORT = 1234
PACT_DIR = os.path.dirname(os.path.realpath(__file__))

@pytest.fixture
def client():
    return StockExchange(
        'http://{host}:{port}'
        .format(host=PACT_MOCK_HOST, port=PACT_MOCK_PORT)
    )

@pytest.fixture(scope='session')
def pact(request):
    pact = Consumer('StockExchange').has_pact_with(
        Provider('TickerService'), host_name=PACT_MOCK_HOST, port=PACT_MOCK_PORT,
        pact_dir=PACT_DIR)
    pact.start_service()
    yield pact
    pact.stop_service()
```

Now we only need to implement the tests just as we would do with a mock.

```python
def test_get_ASML_stock_exchange(pact, client):
    (pact
     .given('Stock exchange')
     .upon_receiving('company ticker ASML')
     .with_request('get', '/ticker/ASML')
     .will_respond_with(200, body="ASML"))

    with pact:
        result = client.get_company_stock_exchange("ASML")
    
    assert result == "AMS"

def test_get_AMZN_stock_exchange(pact, client):
    (pact
     .given('Stock exchange')
     .upon_receiving('company ticker Amazon')
     .with_request('get', '/ticker/Amazon')
     .will_respond_with(200, body="AMZN"))

    with pact:
        result = client.get_company_stock_exchange("Amazon")
    
    assert result == "NASDAQ"
```

And it's done! We can run the tests with the following command:

```
$ pytest
...
======================== 2 passed, 16 warnings in 2.15s ========================
```

After the tests have run, pact generates a contract that states what the client expects from the server. This is called "provider contract".

```json
{
  "consumer": {
    "name": "StockExchange"
  },
  "provider": {
    "name": "TickerService"
  },
  "interactions": [
    {
      "description": "company ticker ASML",
      "providerState": "Stock exchange",
      "request": {
        "method": "get",
        "path": "/ticker/ASML"
      },
      "response": {
        "status": 200,
        "headers": {
        },
        "body": "ASML"
      }
    },
    {
      "description": "company ticker Amazon",
      "providerState": "Stock exchange",
      "request": {
        "method": "get",
        "path": "/ticker/Amazon"
      },
      "response": {
        "status": 200,
        "headers": {
        },
        "body": "AMZN"
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "2.0.0"
    }
  }
}
```

In this case, given a get request `/ticker/ASML`, the server should answer with `ASML`, and given a get request `/ticker/Amazon`, the server should answer with `AMZN`.


With the contract, we can now run the server and test if the expectations apply.

```bash
$ python server.py
...
$ pact-verifier --provider-base-url=http://localhost:5001 --pact-url=stockexchange-tickerservice.json
...
2 interactions, 0 failures
```

Let's introduce an error in the server and run again.

```python
...
ticker = {
    "ASML": "ASML",
    "Amazon": "ERROR",
    "Microsoft": "MSFT"
}
...
```

```bash
$ python server.py
...
$ pact-verifier --provider-base-url=http://localhost:5001 --pact-url=stockexchange-tickerservice.json
...
       Matching keys and values are not shown

       -"AMZN"
       +"ERROR"
       

       Description of differences
       --------------------------------------
       * Expected "AMZN" but got "ERROR" at $

2 interactions, 1 failure
```

As we can see, using only mocks we would not have catched the error.


A common mistake of many developers when making contract testing is to test the contract itself.
In this case, it would be to test that the server returns "ASML" or "AMZN".
However, the goal of contract testing is to be able to test the client funcionality and not the contract itself. When using contract testing, **be sure to not test the mock and test the funcionality instead**.

Pact is not the only implementation available, but it's the most widely used. It's also possible to integrate your OpenAPI schema with Pact and have more extensive testing. It's also possible to use a Pact Broker to share contracts across clients and producers, which can be very useful in a large organization.

If you want to find out more, check out this <a href="https://martinfowler.com/bliki/ContractTest.html">great article on Contract Testing by Martin Fowler</a>, or check <a href="https://docs.pact.io/faq/convinceme">this Pact page</a> on why to use contract testing.

Thanks for reading!
