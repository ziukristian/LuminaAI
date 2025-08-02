FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY HackSocial.MentalHealthApp.Api.csproj ./
RUN dotnet restore HackSocial.MentalHealthApp.Api.csproj

COPY . ./
RUN dotnet publish HackSocial.MentalHealthApp.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "HackSocial.MentalHealthApp.Api.dll"]
