# --- Build Stage ---
FROM node:20-slim AS builder
WORKDIR /app

RUN corepack enable

# 1. Copy root files for Yarn (package.json, .yarnrc.yml, yarn.lock)
COPY .yarnrc.yml yarn.lock package.json ./

# copy package.json frontend package
COPY packages/frontend ./packages/frontend

#install deps for frontend
RUN yarn workspaces focus frontend

# 6. Build
RUN yarn build:frontend


# --- Production Stage ---
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Xóa file mặc định
RUN rm -rf ./*

# Copy folder dist từ stage builder
# Lưu ý: Vite mặc định build ra folder 'dist'
COPY --from=builder /app/packages/frontend/dist ./

# Copy nginx config
# Đảm bảo bạn có file này để handle Single Page App (React Router)
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]