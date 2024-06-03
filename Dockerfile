# Etapa de compilación
# Usar una imagen base de Node
FROM node:20.11.1

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el package.json y package-lock.json (si está disponible)
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto 4200
EXPOSE 4200

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
