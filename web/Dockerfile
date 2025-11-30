FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG VITE_BASE_URL
ENV VITE_BASE_URL=http://localhost:8000/api/v1
ARG VITE_ROOT_ROLE_NAME
ENV VITE_ROOT_ROLE_NAME=root
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /dist /app

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]