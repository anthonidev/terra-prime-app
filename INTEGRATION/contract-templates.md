# API de Plantillas de Contrato

> Módulo: `contract` | Rol requerido: `SYS` | Autenticación: Bearer JWT

Todos los endpoints requieren header `Authorization: Bearer <token>` y el usuario debe tener rol `SYS`.

---

## Base URL

```
/api/contract-templates
```

---

## Endpoints

### 1. Crear plantilla (borrador)

```
POST /api/contract-templates
```

**Body:**

```json
{
  "name": "Contrato de compraventa estándar",
  "description": "Plantilla para ventas al contado",
  "content": { "type": "doc", "content": [] },
  "projectId": "uuid-del-proyecto",
  "customVariables": [
    {
      "key": "custom.testigo1",
      "label": "Nombre del testigo 1",
      "type": "TEXT",
      "defaultValue": null,
      "options": null
    },
    {
      "key": "custom.tipoGarantia",
      "label": "Tipo de garantía",
      "type": "SELECT",
      "defaultValue": null,
      "options": {
        "items": ["Hipotecaria", "Personal", "Fiduciaria"]
      }
    }
  ]
}
```

| Campo             | Tipo     | Requerido | Descripción                                                 |
| ----------------- | -------- | --------- | ----------------------------------------------------------- |
| `name`            | `string` | Si        | Nombre de la plantilla (max 200 chars)                      |
| `description`     | `string` | No        | Descripción (max 500 chars)                                 |
| `content`         | `object` | No        | Contenido Tiptap JSON (puede guardarse vacío como borrador) |
| `projectId`       | `UUID`   | Si        | ID del proyecto asociado                                    |
| `customVariables` | `array`  | No        | Variables personalizadas de la plantilla                    |

**Custom Variable:**

| Campo          | Tipo             | Requerido   | Descripción                                     |
| -------------- | ---------------- | ----------- | ----------------------------------------------- |
| `key`          | `string`         | Si          | Identificador único de la variable              |
| `label`        | `string`         | Si          | Etiqueta para mostrar en UI                     |
| `type`         | `VariableType`   | Si          | Tipo de variable (ver enums)                    |
| `defaultValue` | `string`         | No          | Valor por defecto                               |
| `options`      | `object \| null` | Condicional | Requerido si type es `SELECT`, `TABLE` o `LIST` |

**Response `201`:**

```json
{
  "id": "uuid-generado",
  "name": "Contrato de compraventa estándar",
  "description": "Plantilla para ventas al contado",
  "content": { "type": "doc", "content": [] },
  "status": "DRAFT",
  "isActive": true,
  "project": { "id": "uuid-del-proyecto" },
  "customVariables": [
    {
      "id": "uuid-variable",
      "key": "custom.testigo1",
      "label": "Nombre del testigo 1",
      "type": "TEXT",
      "defaultValue": null,
      "options": null,
      "createdAt": "2026-03-12T...",
      "updatedAt": "2026-03-12T..."
    }
  ],
  "createdAt": "2026-03-12T...",
  "updatedAt": "2026-03-12T..."
}
```

---

### 2. Listar plantillas (paginado)

```
GET /api/contract-templates?projectId=uuid&page=1&limit=10&order=DESC&status=DRAFT&term=compraventa
```

**Query params:**

| Param       | Tipo                     | Requerido | Default | Descripción                 |
| ----------- | ------------------------ | --------- | ------- | --------------------------- |
| `projectId` | `UUID`                   | Si        | -       | Filtrar por proyecto        |
| `page`      | `number`                 | No        | `1`     | Página actual               |
| `limit`     | `number`                 | No        | `10`    | Items por página            |
| `order`     | `ASC \| DESC`            | No        | `DESC`  | Orden por fecha de creación |
| `status`    | `ContractTemplateStatus` | No        | -       | Filtrar por estado          |
| `term`      | `string`                 | No        | -       | Buscar por nombre (ILIKE)   |

> Nota: Las plantillas eliminadas (soft delete) nunca aparecen en el listado (`isActive = false` se excluye automáticamente).

**Response `200`:**

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Contrato de compraventa estándar",
      "description": "Plantilla para ventas al contado",
      "content": { "type": "doc", "content": [] },
      "status": "DRAFT",
      "isActive": true,
      "customVariables": [...],
      "createdAt": "2026-03-12T...",
      "updatedAt": "2026-03-12T..."
    }
  ],
  "meta": {
    "totalItems": 25,
    "itemsPerPage": 10,
    "totalPages": 3,
    "currentPage": 1
  }
}
```

---

### 3. Detalle de plantilla

```
GET /api/contract-templates/:id
```

**Params:**

| Param | Tipo   | Descripción        |
| ----- | ------ | ------------------ |
| `id`  | `UUID` | ID de la plantilla |

**Response `200`:**

```json
{
  "id": "uuid",
  "name": "Contrato de compraventa estándar",
  "description": "Plantilla para ventas al contado",
  "content": { "type": "doc", "content": [...] },
  "status": "DRAFT",
  "isActive": true,
  "project": {
    "id": "uuid-proyecto",
    "name": "Proyecto Sol",
    "..."
  },
  "customVariables": [
    {
      "id": "uuid-variable",
      "key": "custom.testigo1",
      "label": "Nombre del testigo 1",
      "type": "TEXT",
      "defaultValue": null,
      "options": null,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Response `404`:** `Plantilla con id <uuid> no encontrada`

---

### 4. Actualizar plantilla

```
PATCH /api/contract-templates/:id
```

> Solo se pueden editar plantillas en estado `DRAFT`. Si la plantilla está en `ACTIVE` o `INACTIVE`, retorna `400`.

**Params:**

| Param | Tipo   | Descripción        |
| ----- | ------ | ------------------ |
| `id`  | `UUID` | ID de la plantilla |

**Body** (todos los campos opcionales):

```json
{
  "name": "Nombre actualizado",
  "description": "Nueva descripción",
  "content": { "type": "doc", "content": [...] },
  "customVariables": [
    {
      "key": "custom.nuevaVariable",
      "label": "Nueva variable",
      "type": "TEXT"
    }
  ]
}
```

> **Importante:** No se puede cambiar el `projectId`. Al enviar `customVariables`, se reemplazan TODAS las variables custom existentes (delete + insert).

**Response `200`:** Plantilla actualizada completa (mismo formato que detalle)

**Response `400`:** `Solo se pueden editar plantillas en estado BORRADOR`

---

### 5. Publicar plantilla

```
PATCH /api/contract-templates/:id/publish
```

Cambia el estado de `DRAFT` a `ACTIVE`. No requiere body.

**Response `200`:** Plantilla con `status: "ACTIVE"`

**Response `400`:** `Solo se pueden publicar plantillas en estado BORRADOR`

---

### 6. Despublicar plantilla

```
PATCH /api/contract-templates/:id/unpublish
```

Cambia el estado de `ACTIVE` a `DRAFT`. No requiere body.

**Response `200`:** Plantilla con `status: "DRAFT"`

**Response `400`:** `Solo se pueden despublicar plantillas en estado ACTIVO`

---

### 7. Eliminar plantilla (soft delete)

```
DELETE /api/contract-templates/:id
```

Marca la plantilla como inactiva (`isActive = false`, `status = INACTIVE`). Disponible en cualquier estado.

**Response `200`:** Plantilla con `status: "INACTIVE"` e `isActive: false`

---

## Flujo de estados

```
         POST (crear)
              │
              ▼
           DRAFT ◄──── PATCH /api/contract-templates/:id/unpublish
           │    │                  ▲
           │    │                  │
           │    └── PATCH /api/contract-templates/:id/publish ──► ACTIVE
           │                                  │
           ▼                                  ▼
  DELETE /api/contract-templates/:id ───► INACTIVE
```

- `DRAFT` → se puede editar, publicar o eliminar
- `ACTIVE` → se puede despublicar o eliminar (NO editar)
- `INACTIVE` → estado final (soft deleted), no aparece en listados

---

## Enums

### ContractTemplateStatus

| Valor      | Descripción                                     |
| ---------- | ----------------------------------------------- |
| `DRAFT`    | Borrador, editable                              |
| `ACTIVE`   | Publicada, visible para generación de contratos |
| `INACTIVE` | Eliminada (soft delete)                         |

### VariableType

| Valor      | Campo `options`                                 | Descripción                      |
| ---------- | ----------------------------------------------- | -------------------------------- |
| `TEXT`     | `null`                                          | Texto libre                      |
| `NUMBER`   | `null`                                          | Valor numérico                   |
| `DATE`     | `null`                                          | Fecha                            |
| `CURRENCY` | `null`                                          | Monto monetario                  |
| `BOOLEAN`  | `null`                                          | Verdadero/Falso                  |
| `SELECT`   | `{ items: string[] }`                           | Lista de opciones seleccionables |
| `TABLE`    | `{ columns: { key: string, label: string }[] }` | Tabla con columnas definidas     |
| `LIST`     | `{ itemLabel: string }`                         | Lista de items repetibles        |

### VariableCategory

| Valor       | Descripción                                |
| ----------- | ------------------------------------------ |
| `SYSTEM`    | Variables del sistema (fecha actual, etc.) |
| `SALE`      | Datos de la venta                          |
| `FINANCING` | Datos de financiamiento                    |
| `CLIENT`    | Datos del cliente                          |
| `PROJECT`   | Datos del proyecto/lote                    |
| `PAYMENT`   | Datos de pagos                             |
| `CUSTOM`    | Variables personalizadas por plantilla     |

---

## Errores comunes

| Status | Mensaje                                                  | Causa                                               |
| ------ | -------------------------------------------------------- | --------------------------------------------------- |
| `400`  | `Solo se pueden editar plantillas en estado BORRADOR`    | Intentar editar una plantilla ACTIVE/INACTIVE       |
| `400`  | `Solo se pueden publicar plantillas en estado BORRADOR`  | Intentar publicar una plantilla que no es DRAFT     |
| `400`  | `Solo se pueden despublicar plantillas en estado ACTIVO` | Intentar despublicar una plantilla que no es ACTIVE |
| `400`  | Validation errors                                        | Campos requeridos faltantes o formatos inválidos    |
| `401`  | Unauthorized                                             | Token JWT inválido o expirado                       |
| `403`  | Forbidden                                                | Usuario no tiene rol SYS                            |
| `404`  | `Plantilla con id <uuid> no encontrada`                  | ID no existe o plantilla eliminada                  |
