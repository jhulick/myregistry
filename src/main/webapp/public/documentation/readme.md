Registry Documentation
======================

Eureka Architecture
-------------------

### What is Eureka?

Eureka is a REST based service that is used in a micro-service environment for locating services for the purpose of load balancing and failover of middle-tier servers. Eureka also comes with a Java-based client component, the Eureka Client, which makes interactions with the service much easier. The client also has a built-in load balancer that does basic round-robin load balancing. A more sophisticated load balancer can provide weighted load balancing based on several factors like traffic, resource usage, error conditions etc to provide superior resiliency. 

### What is the need for Eureka?

In cloud environments, because of its inherent nature, servers come and go. Unlike the traditional load balancers which work with servers with well known IP addresses and host names, in the Cloud, load balancing requires much more sophistication in registering and de-registering servers with load balancer on the fly. Eureka fills a big gap in the area of mid-tier load balancing.

### How does the application client and application server communicate?

The communication technology could be anything you like. Eureka helps you find the information of the services you would want to communicate with but does not impose any restrictions on the protocol or method of communication. For instance, you can use Eureka to obtain the target server address and use protocols such as thrift, http(s) or any other RPC mechanisms.

### High level architecture

![Alt text](./documentation/eureka_architecture.png)

Services register with Eureka and then send heartbeats to renew their leases every 30 seconds. If the client cannot renew the lease for a few times, it is taken out of the server registry in about 90 seconds. The registration information and the renewals are replicated to all the Eureka nodes in the cluster. The clients from any zone can look up the registry information (happens every 30 seconds) to locate their services (which could be in any zone) and make remote calls.

### Non-java services and clients

For services that are non-java based, you have a choice of using an existing implemention of the client part of Eureka in the language of the service, or you can run a Spring Cloud "sidecar" which is essentially a Java application with an embedded Eureka client that handles the registrations and heartbeats. REST based endpoints are also exposed for all operations that are supported by the Eureka client. Non-java clients can use the REST endpoints to query for information about other services.
 
### Configurability

With Eureka you can add or remove cluster nodes on the fly. You can tune the internal configurations from timeouts to thread pools. 

### Resilience

Eureka benefits from the experience gained over many years operating on Netflix AWS infrastructure, with resiliency built into both the client and the servers. Eureka clients are built to handle the failure of one or more Eureka servers. Since Eureka clients have the registry cache information in them, they can operate reasonably well, even when all of the Eureka servers go down.

Eureka Servers are resilient to other Eureka peers going down. Even during a network partition between the clients and servers, the servers have built-in resiliency to prevent a large scale outage.

### Monitoring

Eureka uses a utility called Servo to track information in both the client and the server for performance, monitoring and alerting. 


