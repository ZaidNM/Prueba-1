# Prueba Coches — API REST + Frontend

Backend Node/Express con **SQL ** `mysql2`
migraciones y seed en

frontend **React** con catálogo, filtros, detalle y panel protegido con JWT.


`Prueba 1/`: 

```
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
```

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

```
cd "C:\Users\ASUS\Desktop\Prueba 1\backend\migraciones"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt


python migrate.py     # crea la base y aplica sql/*.sql
python seed.py        # 11 marcas, 11 coches y el usuario admin
```

## 3. Iniciar el backend


```
cd "C:\Users\ASUS\Desktop\Prueba 1\backend"
npm install
npm run dev        # http://localhost:3000
```


## 4. Iniciar el frontend

```
cd "C:\Users\ASUS\Desktop\Prueba 1\frontend"
npm install
npm run dev        # http://localhost:5173
```


## 5. ¿Dónde pide los datos el frontend?

El frontend **nunca** se conecta a MySQL; siempre pasa por la API:

```
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
```


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

```
cd frontend
npm run build      # genera dist/
npm run preview    # sirve dist/ en http://localhost:4173

```

## 9. proyecto a otra PC

**En esta PC**, copia sin `node_modules`, `.venv`, `dist` ni `.env`:

```
robocopy "C:\Users\ASUS\Desktop\Prueba 1" "D:\Prueba 1" /E /XD node_modules .venv dist .git /XF .env

```

**En la otra PC** (Node.js 22+ y MySQL 8/9 con Workbench):



## 10. Docker: qué levanta y qué URLs usar

`docker-compose.yml` levanta 4 cosas: **MySQL**, un contenedor que **migra y siembra** la base, el **backend** y el **frontend** (nginx).

| Qué | URL |
| --- | --- |
| App | http://localhost:8080 |
| API | http://localhost:3001/api |
| Swagger | http://localhost:3001/docs |
| MySQL | localhost:3307 |

- MySQL va en **3307** para no chocar con el MySQL de tu PC (3306).
- Los datos viven en volúmenes (`mysql_data` y `uploads`): sobreviven a un `down`.
- Variables: `DB_PASSWORD` (default `1234`), `DB_NAME` y `JWT_SECRET`.
- En Docker **no** hace falta `backend/.env`: las variables están en `docker-compose.yml`.
- Cómo levantarlo y actualizarlo: **sección 13**.

## 11. Tests y CI

```bash
cd backend
npm test        # 25 tests, no necesita base de datos
```

- `backend/test/validators.test.js`: comprueba que Zod rechace datos malos (precio 0, año 1800, email inválido...).
- `backend/test/app.test.js`: llama a la API de verdad (health, 404, 400, 401 sin token).
- `backend/app.js` es la app; `backend/index.js` solo la pone a escuchar. Así los tests arrancan sin el puerto fijo y sin MySQL.
- `.github/workflows/ci.yml`: en cada push a `main`, GitHub corre los tests y el build del frontend. Si sale rojo, mira la pestaña **Actions** del repo.



## 12. Despliegue en producción (sin Docker)

1. **Backend** en Render/Railway/Fly: build `npm ci`, start `npm start`, con `DB_*`, `JWT_SECRET` y `CLIENT_URL`.
2. **Frontend** en Vercel/Netlify: build `npm ci && npm run build`, publicar `dist` y definir `VITE_API_URL=https://tu-api/api`.
3. **Rutas**: React Router necesita que el hosting devuelva `index.html` en cualquier ruta (Netlify: `/* /index.html 200`; Vercel ya lo hace; nginx ya está configurado).
4. **Imágenes**: lo subido se sirve desde el backend (`/uploads`). Con Docker no hay problema porque nginx hace de proxy; si separas dominios, esas rutas deben apuntar a la API.
5. **Base de datos**: ejecuta `python migrate.py && python seed.py` una vez en producción y cambia la contraseña del admin.

## 13. Docker: cómo activarlo y cómo actualizarlo (paso a paso)

**Requisito:** Docker Desktop instalado y **abierto**. Si no está abierto, falla con `Cannot connect to the Docker daemon`.

### Activarlo la primera vez

```bash
cd "C:\Users\ASUS\Desktop\Prueba 1"
docker compose up --build
```

- La primera vez tarda varios minutos (descarga imágenes y compila). Es normal.
- Deja esa terminal abierta: ahí ves los logs. Cuando el backend y el frontend estén arriba, abre http://localhost:8080.
- Usuario de prueba: `admin@prueba.com` / `admin123`.
- Para cortarlo: `Ctrl + C`.

Comprobar que está sano:

```bash
curl http://localhost:3001/api/health     # debe responder {"ok":true}
docker compose ps                         # mysql "healthy", backend y frontend "Up"
```



### Actualizarlo cuando cambias código

| Qué cambiaste | Qué ejecutar |
| --- | --- |
| Frontend o backend (`.js`, `.jsx`, `.css`) | `docker compose up --build -d` |
| `docker-compose.yml` o variables | `docker compose up --build -d` |
| SQL (`migraciones/sql/`) o `seed.py` | `docker compose down -v` y luego `docker compose up --build` |

- `-d` significa "en segundo plano": no bloquea la terminal.
- `down -v` **borra** la base y las imágenes subidas; al volver a levantar se siembra de cero.
- Las migraciones y el seed se pueden repetir sin duplicar datos (son idempotentes).

### Apagarlo

```bash
docker compose down        # apaga y conserva los datos
docker compose down -v     # apaga y borra todo (base + imágenes)
```

### Si algo falla

```bash
docker compose logs -f backend     # logs en vivo (Ctrl + C para salir)
docker compose logs migrate        # aquí se ve si la base migró y sembró bien
```

- `port is already allocated` → algo usa 8080, 3001 o 3307. Cambia el número de la izquierda en `docker-compose.yml`, por ejemplo `"8081:80"`.
- `Cannot connect to the Docker daemon` → abre Docker Desktop y espera a que diga "Running".
- La web abre pero la API falla al principio → MySQL aún estaba arrancando; espera unos segundos y recarga. Si sigue, revisa `docker compose logs backend`.
