# LookforX Auth Service

This is the authentication microservice for the LookforX platform, built with Spring Boot.

## Features

- User authentication (login, signup)
- JWT token generation and validation
- OAuth2 integration (Google)
- Role-based authorization
- Password reset functionality
- Email verification

## Tech Stack

- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Database**: PostgreSQL
- **Security**: Spring Security with JWT
- **Documentation**: Springdoc OpenAPI (Swagger)
- **Build Tool**: Maven
- **Containerization**: Docker
- **Deployment**: Kubernetes (GKE)

## Getting Started

### Prerequisites

- JDK 21 or later
- Maven 3.8.x or later
- PostgreSQL 14.x or later
- Docker (optional)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/lookforx-auth-service.git
cd lookforx-auth-service
```

2. Configure the database in `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/lookforx_auth
    username: postgres
    password: your_password
```

3. Build the application:

```bash
mvn clean install
```

### Running Locally

Start the application:

```bash
mvn spring-boot:run
```

The service will be available at http://localhost:8081/api

### Running with Docker

1. Build the Docker image:

```bash
docker build -t lookforx/auth-service .
```

2. Run the container:

```bash
docker run -p 8081:8081 lookforx/auth-service
```

## API Documentation

API documentation is available via Swagger UI at http://localhost:8081/api/swagger-ui.html when the application is running.

### Key Endpoints

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Authenticate a user
- `POST /api/v1/auth/refresh-token` - Refresh an access token
- `GET /api/v1/oauth2/google/url` - Get Google OAuth2 authorization URL
- `POST /api/v1/auth/google/login` - Login with Google

## Project Structure

```
├── src/
│   ├── main/
│   │   ├── java/com/lookforx/auth/
│   │   │   ├── config/           # Configuration classes
│   │   │   ├── controller/       # REST controllers
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── entity/           # JPA entities
│   │   │   ├── exception/        # Custom exceptions
│   │   │   ├── repository/       # Data repositories
│   │   │   ├── security/         # Security configurations
│   │   │   ├── service/          # Business logic
│   │   │   └── AuthApplication.java  # Main application class
│   │   └── resources/
│   │       ├── application.yml   # Application configuration
│   │       └── messages.properties # Internationalization
│   └── test/                     # Unit and integration tests
├── k8s/                          # Kubernetes deployment files
├── .github/workflows/            # CI/CD pipeline
├── pom.xml                       # Maven configuration
└── Dockerfile                    # Docker configuration
```

## Security

The service implements the following security measures:

- JWT-based authentication
- Password encryption using BCrypt
- CSRF protection
- Role-based access control
- OAuth2 integration for social login

## Deployment

The service is deployed to Google Kubernetes Engine (GKE) using GitHub Actions CI/CD pipeline.

### Kubernetes Deployment

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For any questions or support, please contact the LookforX team.