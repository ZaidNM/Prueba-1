# Prueba Coches — API REST + Frontend

Backend Node/Express con **SQL ** `mysql2`
migraciones y seed en

frontend **React** con catálogo, filtros, detalle y panel protegido con JWT.


Prueba 1/
├─ frontend/                  React + Vite + Tailwind
│  ├─ public/imagenes/        fotos de los coches (/imagenes/<archivo>)
│  ├─ src/routes.jsx          todas las rutas (BrowserRouter + providers en main.jsx)
│  ├─ src/api.js              cliente fetch compartido (token JWT)
│  ├─ src/components/
│  │  ├─ layout/              Layout con header, footer y <Outlet />
│  │  ├─ cards/               CocheCard
│  │  └─ catalogo/            Filtros y Paginacion
│  ├─ src/modules/
│  │  ├─ auth/                api, context (login + guard) y pages/Login
│  │  ├─ coches/              api de coches/marcas y pages/Catalogo, DetalleCoche
│  │  └─ admin/               pages/Admin y pages/AdminCoche
└─ backend/
   ├─ index.js                express, rutas, estáticos, swagger, errores y listen
   ├─ config.js               variables de .env
   ├─ db.js                   pool de mysql2
   ├─ helpers/                SELECT y mapeo de coches
   ├─ controllers/            consultas SQL de cada recurso
   ├─ routes/                 endpoints → controladores
   ├─ middlewares/            JWT, validación de id, errores
   ├─ validators/             esquemas Zod (DTOs)
   ├─ migraciones/            base de datos en Python
   │  ├─ sql/001_init.sql     esquema (marcas, coches, usuarios)
   │  ├─ migrate.py           crea la BD y aplica migraciones pendientes
   │  ├─ seed.py              datos de prueba (idempotente)
   │  ├─ requirements.txt
   │  └─ .venv/               entorno virtual local (no se copia)
   ├─ uploads/                imágenes subidas desde el panel (se crea sola)
   └─ docs/openapi.json       documentación Swagger


## 1. Base de datos MySQL local 

MySQL local en **localhost:3306**, usuario `root`, contraseña `1234` 


`backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=prueba_coches
```

## 2. Migraciones 

cd "C:\Users\ASUS\Desktop\Prueba 1\backend\migraciones"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt


python migrate.py     # crea la base y aplica sql/*.sql
python seed.py        # 11 marcas, 11 coches y el usuario admin


## 3. Iniciar el backend


cd "C:\Users\ASUS\Desktop\Prueba 1\backend"
npm install
npm run dev        # http://localhost:3000


## 4. Iniciar el frontend

cd "C:\Users\ASUS\Desktop\Prueba 1\frontend"
npm install
npm run dev        # http://localhost:5173


## 5. ¿Dónde pide los datos el frontend?

El frontend **nunca** se conecta a MySQL; siempre pasa por la API:

1. `frontend/src/api.js` → único archivo con `fetch`. Su `BASE` es `/api` y añade el token
   JWT de `localStorage` en cada petición.
2. `frontend/vite.config.js` → proxy de `/api` y `/uploads` hacia `http://localhost:3000`.
3. Cada módulo tiene su capa `api/` que llama a ese cliente:
   - `src/modules/coches/api/coches.api.js` → `getCoches`, `getCoche`, `getMarcas`,
     `crearCoche`, `actualizarCoche`, `eliminarCoche`
   - `src/modules/auth/api/auth.api.js` → `loginRequest`
4. Las páginas consumen esas funciones:
   - `src/modules/coches/pages/Catalogo.jsx` → `getCoches(...)` y `getMarcas()`
   - `src/modules/coches/pages/DetalleCoche.jsx` → `getCoche(id)`
   - `src/modules/auth/context/auth.context.jsx` (usado por `Login`) → `loginRequest(...)`
   - `src/modules/admin/pages/Admin.jsx` → `getCoches(...)` y `eliminarCoche(id)`
   - `src/modules/admin/pages/AdminCoche.jsx` → `getMarcas()`, `getCoche(id)`,
     `crearCoche(...)`, `actualizarCoche(...)`
5. La petición de `src/api.js` llega en el backend a `routes/` → `controllers/`, y los
   controladores ejecutan SQL con el pool de `backend/db.js`.



## 6. Autenticación

Las lecturas son públicas. Crear, editar y eliminar requieren JWT:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@prueba.com\",\"password\":\"admin123\"}"
```

Usa el `token` devuelto: `Authorization: Bearer <token>`.



## 7. Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/auth/login` | Obtiene el token JWT |
| POST | `/api/uploads` | Sube una imagen (JWT), máx. 5 MB |
| GET | `/api/coches` | Lista paginada con filtros |
| GET | `/api/coches/:id` | Detalle de un coche |
| POST | `/api/coches` | Crea un coche (JWT) |
| PUT | `/api/coches/:id` | Actualiza campos enviados (JWT) |
| DELETE | `/api/coches/:id` | Elimina un coche (JWT) |
| GET | `/api/marcas` | Marcas con total de coches |
| GET | `/api/marcas/:id` | Marca con sus coches |
| POST | `/api/marcas` | Crea una marca (JWT) |
| PUT | `/api/marcas/:id` | Actualiza una marca (JWT) |
| DELETE | `/api/marcas/:id` | Elimina una marca sin coches (JWT) |



## 8. Build del frontend

cd frontend
npm run build      # genera dist/
npm run preview    # sirve dist/ en http://localhost:4173

## 9. proyecto a otra PC

**En esta PC**, copia sin `node_modules`, `.venv`, `dist` ni `.env`:


robocopy "C:\Users\ASUS\Desktop\Prueba 1" "D:\Prueba 1" /E /XD node_modules .venv dist .git /XF .env


**En la otra PC** (Node.js 22+ y MySQL 8/9 con Workbench):


# 1. Migraciones y datos
cd "D:\Prueba 1\backend\migraciones"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python migrate.py
python seed.py

# 2. Backend
cd "D:\Prueba 1\backend"
Copy-Item .env.example .env      # escribe DB_PASSWORD (y cambia JWT_SECRET)
npm install
npm run dev

# 3. Frontend (otra terminal)
cd "D:\Prueba 1\frontend"
npm install
npm run dev
```

`migrate.py` crea la base automáticamente; solo necesita que el usuario de MySQL tenga
permiso de `CREATE DATABASE`. Comprobación: <http://localhost:3000/api/health> →
`{"ok":true}` y <http://localhost:5173> muestra el catálogo.