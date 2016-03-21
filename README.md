# MAX Registry

This is the [MAX](http://max.gov) registry service, based on [Eureka](https://github.com/Netflix/eureka) and Spring Cloud Config.

## Architecture

The MAX microservices architecture works in the following way:

- The MAX Registry is a Spring Cloud Eureka runtime application on which all applications or micro-services registers.
- The MAX Gateway that handles Web traffic targeting tenant applications and services. There can be several different gateways, if needed.
- Microservices are MAX-generated application (using application type `microservice application` when you generate them), that handle REST requests. They are stateless, and several instances of them can be launched in parallel to handle heavy loads.

## HTTP requests routing using the gateway

When the MAX Gateway and the micro-services are launched, they will register themselves in the MAX Registry (using the `eureka.client.serviceUrl.defaultZone` key in the `src/main/resources/config/application.yml` file.

The MAX Gateway will automatically proxy all requests to the micro-services, using their application name: for example, when micro-services `fedifm` is registered, it is available on the gateway on the `/fedifm` URL.

For example, if the MAX Gateway is running on `localhost:8080`, you could point to [http://localhost:8080/fedifm/api/rooms](http://localhost:8080/fedifm/api/rooms) to
get the `rooms` resource served by micro-service `fedifm`. If you're trying to do this with your Web browser, don't forget REST resources are secured by default in MAX, so you need to send a MAX Account (see the point on security below).

## Application configuration with the MAX Registry

The MAX Registry is also a Spring Config Server: when applications and services are launched they will first connect to the MAX Registry to get their configuration. This is true for both the MAX Gateway and micro-services.

This configuration is a Spring Boot configuration, like the one found in the MAX `application-*.yml` files, but it is stored in a central server, so it is easier to manage.

Two kinds of configurations are available:

- A `native` configuration, which is used by default in development (using the MAX `dev` profile), and which uses the local filesystem.
- A `Git` configuration, which is used by default in production (using the MAX `prod` profile), and which stores the configuration in a Git server, or in our case MCM. This allows to tag, branch or rollback configurations using the usual Git tools, which are very powerful in this use-case.

As the Gateway routes are configured using Spring Boot, they can also be managed using the Spring Config Server, for example you could map application `app1-v1` to the `/app1` URL in your `v1` branch, and map application `app1-v2` to the `/app1` URL in your `v2` branch. This is a good way of upgrading micro-services without any downtime for end-users.

## Security considerations

In the MAX micro-services architecture, we use MAX CAS for securing our applications. MAX Accounts are checked by the gateway, user session established, and validated CAS tickets sent to the underlying micro-services: as they share a common session store, micro-services are able to validate the ticket, authenticate, and authorize users using that ticket.

The tickets/sessions are self-sufficient: they have both authentication and authorization information, so micro-services do not need to query a database or an external system. This is important in order to ensure a scalable architecture.

## Running the registry

To run the application, like any MAX application, just launch:

    mvn

The registry Web console should be available at [http://127.0.0.1:8761/](http://127.0.0.1:8761/).

The micro-services will be registered on the MAX Gateway, you will be able to see them on the MAX Gateway management screen at [http://127.0.0.1:8080/#/gateway](http://127.0.0.1:8080/#/gateway).
