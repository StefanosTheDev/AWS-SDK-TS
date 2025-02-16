# 🔹 1️⃣ Use an Official Node.js Image (Alpine-based)
# Why? This is a lightweight Node.js image based on Alpine Linux.
# - Reduces container size -> Faster deployments.
# - More secure -> Less unnecessary packages.
# - More efficient -> Uses fewer system resources.
FROM node:18-alpine

# 🔹 2️⃣ Set the Working Directory Inside the Container
# Why? Ensures all subsequent commands run inside /app.
# - Keeps the file structure clean inside the container.
# - Prevents files from scattering across different directories.
WORKDIR /app

# 🔹 3️⃣ Copy package.json Separately to Optimize Docker's Cache
# Why? Copying only package.json first allows Docker to cache `npm install`.
# - If package.json hasn't changed, Docker reuses the cached dependencies.
# - This speeds up rebuilds, avoiding unnecessary re-installations.
COPY package.json package-lock.json ./

# 🔹 4️⃣ Install Dependencies
# Why? Ensures all project dependencies are installed before adding source files.
# - Installs all packages defined in package.json.
RUN npm install

# 🔹 5️⃣ Copy the Rest of the Application Files
# Why? Now that dependencies are installed, we copy everything else.
# - Ensures source files are added without invalidating the `npm install` cache.
COPY . .

# 🔹 6️⃣ Generate Prisma Client
# Why? Prisma needs to generate database client files for queries to work.
# - Runs `prisma generate` to create client files inside `node_modules/.prisma`.
RUN npx prisma generate



# 🔹 8️⃣ Expose Port 3000
# Why? This tells Docker that the application will listen on port 3000.
# - However, this does *not* actually publish the port! It just documents it.
# - You still need to map this port with `docker run -p 3000:3000`.
EXPOSE 3000

# 🔹 9️⃣ Start the Server
# Why? This command starts the application when the container runs.
# - Uses `npm start`, which should point to `node dist/devServer.js` in package.json.
# - Runs the compiled JavaScript version of the app inside `/dist`.
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/devServer.ts"]
