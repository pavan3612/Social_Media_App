FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy everything
COPY . .

# Install Maven & build
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

# Run app
ENTRYPOINT ["java","-jar","target/*.jar"]
