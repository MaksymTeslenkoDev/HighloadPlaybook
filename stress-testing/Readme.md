# Stress Testing

`Stress testing` is a type of software testing that evaluates the behavior of a system or application under high load conditions, beyond the normal usage patterns. It aims to identify the performance limits and potential bottlenecks of a system by simulating the conditions of heavy usage, peak traffic, and unexpected spikes in user activity.

- The purpose of `stress testing` is to ensure that the system or application **can handle the expected and unexpected load**, maintain the required level of performance, and avoid any failures or crashes that could cause inconvenience or harm to the users.
- Stress testing can help to identify and fix performance issues, such as slow response times, high CPU or memory usage, database connectivity problems, or network latency.
- It also helps to `validate the scalability` and resilience of a system, as well as to `determine its maximum capacity and limitations`.
- `Stress testing` is particularly important for high-load software applications that handle large volumes of data or transactions, such as e-commerce platforms, banking systems, social networks, and online games.

**Metrics which we are interested in during stress testing**

- `rps` (requests per seconds)
- `success rate` (amount of the "OK" responses, to N amount of concurrent client)
- `throughtput Mb/s` (how much Mb per second your server is capable to process)
- `amount of fulfilled request` (could be less lower then rps)

## Tools

- [`Apache JMeter`](https://jmeter.apache.org/). Need to mention, that JMeter will run on your local machine. But there is an ability to create a cluster of such "bots" which will be sending requests to your server.
  **\*JMeter First Touch**

  - `Test Plan -> add -> Threads -> Thread Group`
  - `Thread Group -> Add -> Sampler -> Access Log Sampler`
  - `Thread Group -> Add -> Listener -> View Results in Table`
  - `Thread Group -> Add -> Listener -> Graph Results`
  - `Thread Group -> Add -> Listener -> Aggregate Report`

  **\*JMeter Run Test**

  - `Run -> Clear All`
  - `Run -> Start`

- [`Siege`](https://github.com/JoeDog/siege/). It is load testing and web server benchmarking utility.
  **Running siege in docker**:
  ```bash
  git clone https://github.com/yokogawa-k/docker-siege.git
  cd docker-siege
  docker build -t yokogawa/siege .
  ```
  **Siege options**
  -C CONFIGURATION, show the current config.
  -v VERBOSE, prints notification to screen.
  -q QUIET turns verbose off and suppresses output.
  -g GET, pull down HTTP headers and display the
  transaction. Great for application debugging.
  -p PRINT, like GET only it prints the entire page.
  -c CONCURRENT users, default is 25
  -r REPS, number of times to run the test.
  -t TIMED testing where "m" is modifier S, M, or H
  -d Time DELAY, random delay before each request
  -b BENCHMARK: no delays between requests.
  -i INTERNET user simulation, hits URLs randomly.
  -f FILE, select a specific URLS FILE.
  -R RC, specify an siegerc file
  -l LOG FILE. If not specified, default is /var/log/siege.log
  -m mark the log file with a string.
  between .001 and NUM. (NOT COUNTED IN STATS)
  -H Add a header to request (can be many)
  -A Sets User-Agent in request
  -T Sets Content-Type in request
  --no-parser NO PARSER, turn off the HTML page parser
  --no-follow NO FOLLOW, do not follow HTTP redirects
  **Running Siege**
  ```bash
  ./run -d1  -c25  -v -t15s example.com
  ```
- [`Gatling`](https://gatling.io/)
- [`Locust`](https://locust.io/)
- Commercial Tools: LoadRunner, NeoLoad, BlazeMeter, LoadNinja

## Aproaches

- `Load Testing` is the most common approach to stress testing, which involves `simulating the expected user load` on a system or application and measuring its performance. Load testing typically focuses on generating a large number of concurrent users or requests to the system, with the goal of identifying the maximum capacity and limitations of the system.
- `Perfomance Testing` is a stress testing approach that focuses on `measuring the response time of a system or application under different loads` and scenarios. Performance testing involves identifying the key performance indicators (KPIs) of the system, such as response time, throughput, concurrency, and resource utilization, and measuring them under different load conditions. Performance testing can help to identify performance bottlenecks, scalability issues, and other problems that may affect the performance of the system.
- `Spike Testing` is a stress testing approach that involves `simulating sudden spikes` in user activity or load on a system or application. Spike testing is used to evaluate the behavior of the system under sudden and unexpected increases in traffic, such as during a marketing campaign or product launch. Spike testing can help to identify performance bottlenecks, resource constraints, and other issues that may affect the performance of the system under high loads.
- `Endurance Testing` is a stress testing approach that involves `measuring the performance` of a system or application `over an extended period of time`, usually several hours or days. Endurance testing is used to evaluate the system's ability to maintain its performance under a sustained load or stress. Endurance testing can help to identify performance issues such as memory leaks, resource leaks, and other problems that may affect the long-term stability and reliability of the system.

## Worsening Test

We create high load in part of production environment. Results affect real users. By observing the change in hardware metrics we can judge how these changes affect user metrics. So the long story short:
If there is a dependency it should work in both ways. And it always easier to make things slower then faster:) So instead of spending weeks on improving something it’s easier to artificially slow down (worsen) that part and see if there is any impact.

[`Example of stress testing perfoming`](https://github.com/MaksymTeslenkoDev/siege-stress-test-example)
