# ==========================================
# Build Stage (Maven + Java 21)
# ==========================================
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml and cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and package executable JAR
COPY src src
RUN mvn clean package -DskipTests

# ==========================================
# Runtime Stage (Lightweight JRE 21 Alpine)
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S busbuddy && adduser -S busbuddy -G busbuddy
USER busbuddy

# Copy packaged jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
