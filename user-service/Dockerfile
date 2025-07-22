FROM node:18

# تثبيت nodemon عالميًا لتعمل أوامر nodemon داخل الحاوية
RUN npm install -g nodemon

# تحديد مجلد العمل
WORKDIR /app

# نسخ ملفات الباكدج فقط لتقليل إعادة بناء الصورة عند تغييرات الكود
COPY package*.json ./

# تثبيت الحزم
RUN npm install --legacy-peer-deps

# نسخ بقية الكود بعد التثبيت
COPY . .

# فتح البورت المناسب
EXPOSE 3000

# أمر التشغيل الرئيسي
CMD ["nodemon", "server.js"]
