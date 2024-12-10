FROM node:22.4-slim AS build
WORKDIR /work
COPY . /work
RUN npm ci && npm run build

FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /work
COPY --from=build /work /work

CMD ["index.js"]