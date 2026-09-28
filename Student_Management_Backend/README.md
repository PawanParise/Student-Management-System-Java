# 🚀 Student Management Backend (Spring Boot + PostgreSQL)

## Tech Stack
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 21
- **Persistence**: Spring Data JPA & Hibernate ORM
- **Database**: PostgreSQL
- **Documentation**: Springdoc OpenAPI / Swagger UI
- **Build Tool**: Maven with Maven Wrapper (`./mvnw`)

## Configuration
Database settings in `src/main/resources/application.properties`:
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/student_db
spring.datasource.username=postgres
spring.datasource.password=root
```

## Running the Application
```bash
./mvnw clean spring-boot:run
```
Once started:
- API Root: `http://localhost:8080/api/students`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
