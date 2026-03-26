# Documentación Técnica Detallada: API de Gestión de Contratos CONAF

> **Versión**: 2.0 (actualizado 2026-03-26)  
> Esta documentación define la verdad única del contrato entre sistemas. Consumir para integración frontend ↔ backend.

---

## 1. Arquitectura de Seguridad y Autenticación

El sistema implementa OAuth2 con flujo de Password Bearer utilizando Tokens JWT (JSON Web Tokens).

### 1.1 Flujo de Autenticación (Login)
- **URL**: `POST /api/auth/login`
- **Formato**: `application/x-www-form-urlencoded`
- **Campos**:
  - `username`: Email del funcionario (obligatorio).
  - `password`: Contraseña (mínimo 8 caracteres).
- **Ejemplo de Cuerpo (form-data)**:
  ```
  username=admin@conaf.cl&password=supersecretpassword
  ```
- **Respuesta Exitosa (HTTP 200)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nombre": "Administrador Sistema",
      "email": "admin@conaf.cl",
      "rol": "admin"
    }
  }
  ```
- **Rol de Usuario (`rol_enum`)**:
  - `admin`: Acceso total, incluyendo creación de usuarios y borrado de logs.
  - `revisor`: Puede gestionar empleados y ciclos de vida de contratos.

### 1.2 Persistencia del Token
- El token debe enviarse en la cabecera `Authorization` de todas las peticiones subsiguientes:
  `Authorization: Bearer <access_token>`
- El token tiene una duración configurada por `ACCESS_TOKEN_EXPIRE_MINUTES` (usualmente 8 horas).
- **Fallback para iframes**: el token puede enviarse como query param `?token=<jwt>` cuando el contexto no permite cabeceras (ver sección 4.3).

### 1.3 Obtener Perfil Actual
- **URL**: `GET /api/auth/me`
- **Uso**: Validar la sesión al cargar la página en el frontend.

---

## 2. Gestión de Empleados

### 2.1 Listado y Búsqueda (`GET /api/empleados/`)
Permite visualizar la nómina de funcionarios con filtros avanzados.
- **Parámetros de Query**:
  - `search`: Texto para búsqueda parcial en `nombre_completo` o coincidencia exacta en `rut`.
  - `activo`: Filtrar por funcionarios vigentes (`true`) o desvinculados (`false`).
  - `skip`: (int) Paginación - registros a saltar.
  - `limit`: (int) Paginación - máximo de registros (máx. 200).
- **Respuesta (Array de objetos)**:
  ```json
  [
    {
      "id": "uuid",
      "rut": "12.345.678-k",
      "nombre_completo": "Pedro Juan Sánchez",
      "organismo_nombre": "Departamento de Desarrollo",
      "tipo_cargo": "Analista III",
      "remuneracion_bruta_mensual": 1850700.50,
      "tipo_de_contrato": "Honorarios",
      "fecha_inicio": "2023-05-15",
      "activo": true,
      "created_at": "2024-03-25T12:00:00Z"
    }
  ]
  ```

### 2.2 Creación de Funcionario (`POST /api/empleados/`)
- **Validación Crítica**: El RUT debe ser único en el sistema. Debe contener el dígito verificador.
- **Formato de Dinero**: `remuneracion_bruta_mensual` debe enviarse como número (float/decimal).

### 2.3 Edición y Regla de Negocio (PUT)
Si el frontend edita cualquiera de estos campos críticos:
1. `tipo_cargo`
2. `remuneracion_bruta_mensual`
3. `tipo_de_contrato`

**El sistema Backend automáticamente marcará como INVÁLIDOS todos los contratos cuya firma esté en proceso (no completados).** El frontend debe notificar al usuario sobre esta invalidación.

---

## 3. Ciclo de Vida del Contrato (Workflow)

El contrato pasa por 5 estados obligatorios. Las transiciones son estrictamente lineales; saltarse un paso retorna **HTTP 409 Conflict**.

### 3.1 Flujo Operativo (Diagrama de Estados)
```
PENDIENTE → REVISADO → IMPRESO → ESPERANDO_FIRMA → COMPLETADO
                                                         ↑
                                              POST /escaneado (PDF firmado)
```
El flag `invalido: true` puede activarse en cualquier estado intermedio si los datos del empleado cambian. Bloquea todas las transiciones hasta regenerar el contrato.

### 3.2 Objeto Contrato — Campos de Respuesta Completos

Todos los endpoints de contratos retornan el mismo objeto enriquecido:

```json
{
  "id": "uuid",
  "codigo_unico": "CONAF-2026-00001",
  "empleado_id": "uuid",
  "empleado_nombre": "Pedro Juan Sánchez",
  "rut": "12.345.678-k",
  "tipo_cargo": "Analista III",
  "estado": "ESPERANDO_FIRMA",
  "datos_formulario": { "remuneracion_bruta_mensual": 1200000 },
  "invalido": false,
  "pdf_generado_path": "contratos/uuid/generado.pdf",
  "pdf_escaneado_path": null,
  "revisado_en": "2026-03-25T10:00:00Z",
  "impreso_en": "2026-03-25T11:00:00Z",
  "ip_impresion": "192.168.1.10",
  "esperando_firma_en": "2026-03-25T12:00:00Z",
  "completado_en": null,
  "created_at": "2026-03-25T09:00:00Z",
  "updated_at": "2026-03-25T12:00:00Z"
}
```

> `empleado_nombre`, `rut` y `tipo_cargo` se resuelven mediante JOIN — el frontend no necesita queries adicionales al empleado.

---

## 4. Endpoints de Contratos

### 4.1 Listar Contratos (`GET /api/contratos/`)

**Parámetros de Query:**

| Parámetro    | Tipo    | Default | Descripción |
|--------------|---------|---------|-------------|
| `estado`     | string  | —       | Filtro exacto: `PENDIENTE`, `REVISADO`, `IMPRESO`, `ESPERANDO_FIRMA`, `COMPLETADO` |
| `empleado_id`| uuid    | —       | Filtrar por empleado específico |
| `invalido`   | boolean | —       | `true` solo contratos inválidos |
| `has_pdf`    | boolean | —       | `true` solo contratos con PDF generado |
| `search`     | string  | —       | Búsqueda parcial en `nombre_completo` o RUT exacto |
| `skip`       | int     | `0`     | Registros a saltar (paginación) |
| `limit`      | int     | `50`    | Máximo de registros (máx. `200`) |

**Cabecera de respuesta para paginación:**
```
X-Total-Count: 142
```
Contiene el total de registros que coinciden con el filtro (sin aplicar `skip`/`limit`). Usar para calcular número de páginas en el frontend.

**Ejemplo:**
```
GET /api/contratos/?estado=ESPERANDO_FIRMA&search=Pedro&skip=0&limit=20
X-Total-Count: 5
```

### 4.2 Listar Templates Disponibles (`GET /api/contratos/templates`)
Retorna los 10 formatos oficiales disponibles. El frontend debe usarlos para poblar los selectores de tipo de documento.
- **Respuesta**:
  ```json
  [
    { "id": "contrato_indefinido", "label": "Contrato Indefinido", "descripcion": "Planta estándar" },
    { "id": "contrato_plazo_fijo", "label": "Contrato Plazo Fijo", "descripcion": "Vencimiento fijo" },
    { "id": "contrato_honorarios", "label": "Contrato Honorarios", "descripcion": "Suma alzada" },
    { "id": "contrato_practica",    "label": "Convenio Práctica",  "descripcion": "Estudiantes" },
    { "id": "contrato_brigadista",  "label": "Contrato Brigadista", "descripcion": "Combate de incendios" },
    { "id": "anexo_generic",       "label": "Anexo Genérico",     "descripcion": "Modificación libre" },
    { "id": "anexo_remuneracion",  "label": "Anexo Remuneración", "descripcion": "Ajuste sueldo" },
    { "id": "anexo_jornada",       "label": "Anexo Jornada",      "descripcion": "Cambio horario" },
    { "id": "anexo_traslado",      "label": "Anexo Traslado",     "descripcion": "Cambio unidad" },
    { "id": "anexo_extension",     "label": "Anexo Extensión",    "descripcion": "Prórroga plazo" }
  ]
  ```

### 4.3 Crear Contrato (`POST /api/contratos/`)
- **Payload**:
  ```json
  {
    "empleado_id": "uuid",
    "template_id": "contrato_indefinido", // ID de la lista anterior
    "datos_formulario": {
      "signer_name": "...",
      "nueva_remuneracion": 1500000,     // Según el template usado
      "fecha_termino": "2026-12-31"     // Ver nota de campos específicos
    }
  }
  ```
- **Nota de Campos Dinámicos**: Cada template lee campos específicos de `datos_formulario` (ej: `contrato_practica` busca `institucion_educativa`). Se recomienda al frontend enviar todos los campos relevantes del formulario UI dentro de este objeto JSON.
- **Nota para Anexos**: Si el `template_id` es `anexo_modificacion`, se pueden enviar campos adicionales como `contrato_referencia` y `clausulas_modificadas` dentro de `datos_formulario`.
- **Acción Backend**: Se genera el archivo `generado.pdf` usando el motor de templates seleccionado.
- **Respuesta**: El objeto Contrato con el `pdf_generado_path` asignado.

### 4.4 Descargar / Visualizar PDF (`GET /api/contratos/{id}/pdf`)

**Endpoint unificado** para el PDF generado y el PDF escaneado.

| Query Param | Tipo    | Default      | Descripción |
|-------------|---------|--------------|-------------|
| `type`      | string  | `generado`   | `generado` → PDF del sistema \| `scanned` → PDF firmado escaneado |
| `preview`   | boolean | `false`      | `true` → `Content-Disposition: inline` (abre en browser) \| `false` → descarga |
| `token`     | string  | —            | JWT fallback cuando no se puede enviar header (iframes, etc.) |

**Autenticación**: header `Authorization: Bearer <jwt>` tiene prioridad. Si no viene, se usa `?token=<jwt>`.

**Ejemplos de uso en el frontend:**

```js
// 1. Descargar PDF generado (con axios + blob — modo recomendado)
const res = await axios.get(`/api/contratos/${id}/pdf`, {
  responseType: 'blob',
  headers: { Authorization: `Bearer ${token}` }
})
const url = URL.createObjectURL(res.data)
const a = document.createElement('a')
a.href = url; a.download = `contrato-${codigo}.pdf`; a.click()

// 2. Visualizar PDF escaneado en iframe (sin cabeceras → usa ?token=)
iframeEl.src = `/api/contratos/${id}/pdf?type=scanned&preview=true&token=${token}`

// 3. Abrir en nueva pestaña
window.open(`/api/contratos/${id}/pdf?preview=true`, '_blank')
// ⚠️ Para nueva pestaña sin CORS usar el modo blob:
const blobUrl = URL.createObjectURL((await axios.get(..., { responseType: 'blob' })).data)
window.open(blobUrl, '_blank')
```

**Errores posibles:**
- `404` si `pdf_generado_path` o `pdf_escaneado_path` es `null` (archivo no generado aún).
- `404` si el archivo no existe en el volumen (inconsistencia grave).
- `401` si no se provee ningún token.

### 4.4 Transiciones de Estado (`PATCH`)

Todos los endpoints de transición retornan el **objeto contrato completo y actualizado** (sección 3.2). El frontend puede actualizar el estado en memoria sin hacer un GET adicional.

| Endpoint | Transición | Notas |
|----------|-----------|-------|
| `PATCH /api/contratos/{id}/revisar` | `PENDIENTE → REVISADO` | Falla si `invalido: true` |
| `PATCH /api/contratos/{id}/imprimir` | `REVISADO → IMPRESO` | Registra IP del cliente |
| `PATCH /api/contratos/{id}/esperando-firma` | `IMPRESO → ESPERANDO_FIRMA` | — |

### 4.5 Subir Escaneado y Completar (`POST /api/contratos/{id}/escaneado`)
- **Tipo**: `multipart/form-data`
- **Campo**: `file` — PDF binario firmado (MIME: `application/pdf`). Rechaza otros tipos con `HTTP 400`.
- **Transición**: `ESPERANDO_FIRMA → COMPLETADO`
- **Respuesta**: Objeto contrato completo con `pdf_escaneado_path` asignado y `completado_en` registrado.

```js
const form = new FormData()
form.append('file', pdfBlob, 'contrato_firmado.pdf')
await axios.post(`/api/contratos/${id}/escaneado`, form, {
  headers: { Authorization: `Bearer ${token}` }
})
```

### 4.6 Historial de Auditoría (`GET /api/contratos/{id}/history`)
Retorna todos los eventos del ciclo de vida ordenados cronológicamente.
```json
[
  { "estado": "CREADO", "usuario": "Ana Gómez", "fecha": "2026-03-25T09:00:00Z" },
  { "estado": "REVISADO", "usuario": "Carlos López", "fecha": "2026-03-25T10:30:00Z" }
]
```

---

## 5. Gestión de Archivos y Volúmenes

- **Ruta Base**: `/data/` (volumen persistente Railway).
- **Estructura**: `/data/contratos/{contrato_uuid}/generado.pdf` y `escaneado.pdf`.
- **Acceso**: Siempre via los endpoints de descarga. El path guardado en BD es relativo (`contratos/uuid/generado.pdf`); el backend construye la ruta absoluta internamente.

---

## 6. Implementación del Frontend (Ejemplos Fetch)

### Interceptor de Token (Auth)
```javascript
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token')
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
  const res = await fetch(url, { ...options, headers })
  if (res.status === 401) window.location.href = '/login'
  return res
}
```

### Paginación con X-Total-Count
```javascript
const res = await fetch(`/api/contratos/?estado=PENDIENTE&skip=0&limit=20`, {
  headers: { Authorization: `Bearer ${token}` }
})
const total = parseInt(res.headers.get('X-Total-Count') ?? '0')
const contratos = await res.json()
const totalPages = Math.ceil(total / 20)
```

---

## 7. Monitoreo y Salud (Health)

### `GET /health`
```json
{ "status": "ok", "service": "conaf-contratos-api", "database": "ok" }
```
Si hay fallo de DB: `"status": "degraded"` (siempre HTTP 200 para no interrumpir el tráfico de Railway).

---

## 8. Diccionario de Errores Comunes (HTTP 4xx/5xx)

| Código | Detalle | Acción Sugerida Frontend |
|--------|---------|--------------------------|
| `400` | Archivo no es PDF | Validar MIME antes de enviar |
| `401` | No Autorizado / Token inválido | Redirigir a `/login` |
| `403` | Prohibido | El rol `revisor` no tiene permiso para esta acción |
| `404` | Recurso no encontrado | Mostrar pantalla de error de recurso |
| `409` | Conflicto | RUT duplicado, estado incorrecto, o contrato inválido |
| `422` | Error de Validación | Campo con formato inválido (RUT, email, UUID) |

---

## 9. Carga Masiva (Bulk Import)

### `POST /api/empleados/bulk-import`
Realiza un "Upsert" automático. Si el RUT ya existe, actualiza. Si no, crea.
```json
[
  {
    "rut": "11.111.111-1",
    "nombre_completo": "Ejemplo 1",
    "organismo_nombre": "División A",
    "tipo_cargo": "Cargo X",
    "remuneracion_bruta_mensual": 1000000,
    "tipo_de_contrato": "Honorarios"
  }
]
```

---

## 10. Despliegue y Variables de Entorno

| Variable | Valor Producción |
|----------|-----------------|
| `DATABASE_URL` | `postgresql://...` (Railway Postgres) |
| `DATA_VOLUME_PATH` | `/data` |
| `SECRET_KEY` | Clave segura generada |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `480` (8 horas) |
| `CORS_ORIGINS` | No aplica — CORS está abierto a `*` en producción actual |

---

## 11. Apéndice: Transiciones Válidas de Estado

```
PENDIENTE  →  REVISADO          PATCH /revisar          (falla si invalido=true)
REVISADO   →  IMPRESO           PATCH /imprimir         (registra IP)
IMPRESO    →  ESPERANDO_FIRMA   PATCH /esperando-firma
ESPERANDO_FIRMA → COMPLETADO    POST  /escaneado        (requiere PDF)
```

Intentar cualquier otra transición retorna **HTTP 409 Conflict** con detalle del estado actual.

---
*Documento mantenido en `CONAF_API_FRONTEND_DOC.md`. Última actualización: 2026-03-26.*
## 5. Operaciones de Sistema (Backup y Restauración)

En entornos como Railway sin acceso directo a archivos, usa estos endpoints para mover PDFs entre entornos. **Requiere rol ADMIN.**

### 5.1 Exportar todo (`GET /api/system/export-pdfs`)
Descarga un archivo ZIP (`backup_contratos_conaf.zip`) con toda la estructura de `/data/contratos`.
- **Uso**: Ideal para backups locales.
- **Formato**: ZIP manteninedo `{contrato_uuid}/generado.pdf`.

### 5.2 Importar desde ZIP (`POST /api/system/import-pdfs`)
Sube un archivo ZIP para poblar el volumen `/data/contratos` de forma masiva.
- **Payload**: `file` (Binary .zip) via `multipart/form-data`.
- **Nota**: Sobrescribe archivos existentes con el mismo nombre y ruta.
