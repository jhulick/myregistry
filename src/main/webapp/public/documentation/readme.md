Registry Documentation
======================

Eureka Architecture
-------------------

### What is Eureka?

Eureka is a REST based service that is used in a micro-service environment for locating services for the purpose of 
load balancing and failover of middle-tier servers. Eureka also comes with a Java-based client component,the Eureka 
Client, which makes interactions with the service much easier. The client also has a built-in load balancer that does 
basic round-robin load balancing. A more sophisticated load balancer can provide weighted load balancing based on 
several factors like traffic, resource usage, error conditions etc to provide superior resiliency. 

### What is the need for Eureka?

In cloud environments, because of its inherent nature, servers come and go. Unlike the traditional load balancers which 
work with servers with well known IP addresses and host names, in the Cloud, load balancing requires much more sophistication 
in registering and de-registering servers with load balancer on the fly. Eureka fills a big gap in the area of mid-tier load balancing.

