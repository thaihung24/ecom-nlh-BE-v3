# sử dụng image chứa Node.js 18.x
FROM node:18.14.0

# tạo thư mục làm việc cho ứng dụng
WORKDIR /usr/src/app

# sao chép các tệp package.json và package-lock.json để cài đặt các gói phụ thuộc
COPY package*.json ./


# cài đặt các gói phụ thuộc
RUN npm install
# sao chép tất cả các tệp trong thư mục dự án của bạn vào thư mục làm việc
COPY . .

EXPOSE 5000
# chạy ứng dụng
CMD ["npm", "start"]
