# ==========================================
# STAGE 1: Build React Frontend
# ==========================================
FROM node:22-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# ==========================================
# STAGE 2: Build ASP.NET Core Backend
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS server-builder
WORKDIR /app/server
COPY server/*.csproj ./
RUN dotnet restore
COPY server/ ./
RUN dotnet publish -c Release -o /app/publish

# Copy React build artifacts into the published wwwroot directory
COPY --from=client-builder /app/client/dist /app/publish/wwwroot

# ==========================================
# STAGE 3: Final Production Runtime
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Install fontconfig and libgdiplus / standard fonts for QuestPDF rendering
RUN apt-get update && apt-get install -y --no-install-recommends \
    fontconfig \
    fonts-dejavu-core \
    libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=server-builder /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

ENTRYPOINT ["dotnet", "server.dll"]
