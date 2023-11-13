FROM node:20-bullseye-slim AS build

WORKDIR /src

COPY . /src/

RUN npm ci

RUN npm run build

FROM gcr.io/distroless/nodejs20-debian11

WORKDIR /src

COPY --from=build /src/Build/producer.js /src/index.js

USER nonroot

CMD ["index.js"]
