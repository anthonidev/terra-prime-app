# Ejemplo de Integracion - API de Ventas (Rol VEN)

Este directorio contiene ejemplos de integracion para consumir la API de ventas de Terra Prime desde otro sistema. Todos los flujos estan documentados desde la perspectiva del rol **VEN (Vendedor)**.

## Estructura de Archivos

```
example-integracion/
├── README.md                              # Este archivo
├── types/
│   └── index.ts                           # Tipos TypeScript de todas las entidades
├── lib/
│   ├── api-client.ts                      # Cliente HTTP (Axios) con auth automatica
│   ├── queries.ts                         # Funciones GET (lectura de datos)
│   ├── mutations.ts                       # Funciones POST/PATCH (escritura de datos)
│   └── validation.ts                      # Esquemas Zod para validacion de formularios
├── hooks/
│   ├── use-my-sales.ts                    # Hook: listar mis ventas
│   ├── use-sale-detail.ts                 # Hook: ver detalle de venta
│   ├── use-create-sale.ts                 # Hook: crear venta (mutations)
│   ├── use-create-sale-queries.ts         # Hook: queries para crear venta (proyectos, lotes, etc.)
│   ├── use-register-payment.ts            # Hook: registrar pago
│   └── use-financing-detail.ts            # Hook: detalle de financiamiento
└── utils/
    ├── currency-formatter.ts              # Formateo de moneda (PEN/USD)
    └── date-formatter.ts                  # Formateo de fechas (UTC)
```

## Requisitos Previos

### Dependencias

```bash
npm install axios @tanstack/react-query zod date-fns date-fns-tz sonner
# o con bun:
bun add axios @tanstack/react-query zod date-fns date-fns-tz sonner
```

### Autenticacion

La API usa **JWT Bearer tokens**. El flujo de autenticacion es:

1. **Login**: `POST /api/auth/login` con `{ document, password }`
2. La respuesta devuelve `{ accessToken, refreshToken, user }`
3. Guardar tokens en `localStorage` (o el mecanismo que prefiera el sistema)
4. El `api-client.ts` inyecta automaticamente el token en cada request
5. Cuando el token expira, se refresca automaticamente via `POST /api/auth/refresh`

### Configuracion del API Client

Modificar `lib/api-client.ts` para apuntar al backend:

```typescript
// Cambiar esta linea con la URL de tu backend
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

---

## Flujo 1: Crear una Venta

### Descripcion

La creacion de venta es un proceso de **5 pasos** secuenciales:

### Paso 1 - Seleccionar Proyecto y Lote

Seleccion en cascada: Proyecto → Etapa → Bloque → Lote

| Endpoint                                 | Metodo | Descripcion                          |
| ---------------------------------------- | ------ | ------------------------------------ |
| `/api/sales/projects/actives`            | GET    | Obtener proyectos activos            |
| `/api/sales/stages/:projectId`           | GET    | Obtener etapas del proyecto          |
| `/api/sales/blocks/:stageId`             | GET    | Obtener bloques de la etapa          |
| `/api/sales/lots/:blockId?status=Activo` | GET    | Obtener lotes disponibles del bloque |

**Flujo:**

```
Proyecto seleccionado → Cargar etapas
Etapa seleccionada    → Cargar bloques
Bloque seleccionado   → Cargar lotes (solo status "Activo")
Lote seleccionado     → Avanzar al Paso 2
```

**Response de lote seleccionado:**

```json
{
  "id": "uuid-del-lote",
  "name": "Lote A-01",
  "area": "120.00",
  "lotPrice": "50000.00",
  "urbanizationPrice": "14000.00",
  "totalPrice": 64000,
  "status": "Activo",
  "blockName": "Mz A",
  "stageName": "Etapa 1",
  "projectName": "Proyecto Sol",
  "projectCurrency": "USD"
}
```

### Paso 2 - Tipo de Venta

El vendedor selecciona:

- **Tipo de venta**: `DIRECT_PAYMENT` (Contado) o `FINANCED` (Financiado)
- **Reserva** (opcional): Si se activa, se debe indicar:
  - `reservationAmount`: Monto de la reserva
  - `maximumHoldPeriod`: Dias maximos de separacion

### Paso 3 - Configuracion de Pago

Segun el tipo de venta:

#### Pago Directo (`DIRECT_PAYMENT`)

Solo se configuran los montos de lote y habilitacion urbana (HU):

- `totalAmount`: Precio total del lote
- `totalAmountUrbanDevelopment`: Precio de habilitacion urbana
- Opcionalmente: cuotas de HU (`quantityHuCuotes`, `firstPaymentDateHu`)

#### Financiado (`FINANCED`)

Se requiere calcular la tabla de amortizacion:

| Endpoint                                      | Metodo | Descripcion                    |
| --------------------------------------------- | ------ | ------------------------------ |
| `/api/sales/financing/calculate-amortization` | POST   | Calcular tabla de amortizacion |

**Request:**

```json
{
  "totalAmount": 50000,
  "initialAmount": 10000,
  "reservationAmount": 0,
  "interestRateSections": [
    {
      "startInstallment": 1,
      "endInstallment": 36,
      "interestRate": 12
    }
  ],
  "firstPaymentDate": "2024-03-01",
  "includeDecimals": false,
  "totalAmountHu": 14000,
  "numberOfPaymentsHu": 12,
  "firstPaymentDateHu": "2024-03-01"
}
```

**Response:**

```json
{
  "installments": [
    {
      "lotInstallmentAmount": 1333.33,
      "lotInstallmentNumber": 1,
      "huInstallmentAmount": 1166.67,
      "huInstallmentNumber": 1,
      "expectedPaymentDate": "2024-03-01",
      "totalInstallmentAmount": 2500.0
    }
  ],
  "meta": {
    "lotInstallmentsCount": 36,
    "lotTotalAmount": 48000,
    "huInstallmentsCount": 12,
    "huTotalAmount": 14000,
    "totalInstallmentsCount": 36,
    "totalAmount": 62000
  }
}
```

**Reglas de negocio:**

- Si `interestRate = 0`: se puede agregar/eliminar cuotas manualmente
- Si `interestRate > 0`: solo se pueden editar montos y fechas de cuotas existentes

### Paso 4 - Datos del Cliente

Primero se crea/actualiza el cliente y opcionalmente garante:

| Endpoint                                | Metodo | Descripcion                           |
| --------------------------------------- | ------ | ------------------------------------- |
| `/api/sales/clients/document/:document` | GET    | Buscar cliente por documento          |
| `/api/sales/clients/guarantors/create`  | POST   | Crear cliente + garante + secundarios |

**Request de creacion:**

```json
{
  "createClient": {
    "leadId": "uuid-del-lead",
    "address": "Av. Principal 123"
  },
  "createGuarantor": {
    "firstName": "Juan",
    "lastName": "Perez",
    "email": "juan@email.com",
    "phone": "999888777",
    "document": "12345678",
    "documentType": "DNI",
    "address": "Calle 456"
  },
  "createSecondaryClient": [
    {
      "firstName": "Maria",
      "lastName": "Lopez",
      "email": "maria@email.com",
      "phone": "999111222",
      "document": "87654321",
      "documentType": "DNI"
    }
  ]
}
```

**Response:**

```json
{
  "clientId": 123,
  "guarantorId": 456,
  "secondaryClientIds": [789]
}
```

### Paso 5 - Confirmacion y Creacion

Se envia toda la data recopilada:

| Endpoint     | Metodo | Descripcion    |
| ------------ | ------ | -------------- |
| `/api/sales` | POST   | Crear la venta |

**Request (venta financiada con reserva):**

```json
{
  "lotId": "uuid-del-lote",
  "saleType": "FINANCED",
  "clientId": 123,
  "totalAmount": 50000,
  "totalAmountUrbanDevelopment": 14000,
  "guarantorId": 456,
  "secondaryClientsIds": [789],
  "initialAmount": 10000,
  "interestRateSections": [{ "startInstallment": 1, "endInstallment": 36, "interestRate": 12 }],
  "quantitySaleCoutes": 36,
  "combinedInstallments": [
    {
      "lotInstallmentAmount": 1333.33,
      "lotInstallmentNumber": 1,
      "huInstallmentAmount": 1166.67,
      "huInstallmentNumber": 1,
      "expectedPaymentDate": "2024-03-01",
      "totalInstallmentAmount": 2500.0
    }
  ],
  "isReservation": true,
  "reservationAmount": 2000,
  "maximumHoldPeriod": 15,
  "quantityHuCuotes": 12,
  "firstPaymentDateHu": "2024-03-01"
}
```

**Request (venta directa simple):**

```json
{
  "lotId": "uuid-del-lote",
  "saleType": "DIRECT_PAYMENT",
  "clientId": 123,
  "totalAmount": 50000,
  "totalAmountUrbanDevelopment": 14000,
  "isReservation": false
}
```

**Response:**

```json
{
  "id": "uuid-venta-creada",
  "type": "FINANCED",
  "totalAmount": 64000,
  "contractDate": "2024-01-15",
  "status": "RESERVATION_PENDING",
  "currency": "USD",
  "createdAt": "2024-01-15T10:30:00Z",
  "reservationAmount": 2000,
  "maximumHoldPeriod": 15,
  "fromReservation": true,
  "client": {
    "address": "Av. Principal 123",
    "firstName": "Carlos",
    "lastName": "Garcia",
    "phone": "999777666",
    "reportPdfUrl": null
  },
  "lot": {
    "id": "uuid-del-lote",
    "name": "Lote A-01",
    "lotPrice": 50000,
    "block": "Mz A",
    "stage": "Etapa 1",
    "project": "Proyecto Sol"
  }
}
```

---

## Flujo 2: Listar Mis Ventas

### Descripcion

El vendedor ve un listado paginado de sus propias ventas con filtros.

| Endpoint                     | Metodo | Descripcion                            |
| ---------------------------- | ------ | -------------------------------------- |
| `/api/sales/all/list/vendor` | GET    | Listar ventas del vendedor autenticado |

### Query Parameters

| Parametro    | Tipo   | Descripcion                              |
| ------------ | ------ | ---------------------------------------- |
| `page`       | number | Numero de pagina (default: 1)            |
| `limit`      | number | Items por pagina (default: 20)           |
| `order`      | string | `ASC` o `DESC` (por fecha de creacion)   |
| `status`     | string | Filtrar por estado (ver StatusSale enum) |
| `type`       | string | `DIRECT_PAYMENT` o `FINANCED`            |
| `projectId`  | string | Filtrar por ID de proyecto               |
| `clientName` | string | Buscar por nombre de cliente             |

### Request

```
GET /api/sales/all/list/vendor?page=1&limit=20&order=DESC&status=PENDING&type=FINANCED
```

### Response

```json
{
  "items": [
    {
      "id": "uuid-de-la-venta",
      "type": "FINANCED",
      "totalAmount": "64000.00",
      "status": "IN_PAYMENT_PROCESS",
      "currency": "USD",
      "createdAt": "2024-01-15T10:30:00Z",
      "reservationAmount": 2000,
      "reservationAmountPaid": 2000,
      "reservationAmountPending": 0,
      "totalAmountPaid": 15000,
      "totalAmountPending": 49000,
      "maximumHoldPeriod": 15,
      "fromReservation": true,
      "client": {
        "firstName": "Carlos",
        "lastName": "Garcia",
        "phone": "999777666",
        "reportPdfUrl": "https://...",
        "document": "12345678"
      },
      "lot": {
        "id": "uuid-del-lote",
        "name": "Lote A-01",
        "area": "120.00",
        "block": "Mz A",
        "stage": "Etapa 1",
        "project": "Proyecto Sol"
      },
      "radicationPdfUrl": "https://...",
      "paymentAcordPdfUrl": "https://...",
      "financing": {
        "quantityCoutes": "36",
        "interestRate": "12",
        "interestRateSections": [
          { "startInstallment": 1, "endInstallment": 36, "interestRate": 12 }
        ],
        "initialAmount": "10000.00",
        "initialAmountPaid": 10000,
        "initialAmountPending": 0
      },
      "urbanDevelopment": {
        "quantityCoutes": "12",
        "initialAmount": "0.00",
        "initialAmountPaid": 0,
        "initialAmountPending": "14000.00"
      }
    }
  ],
  "meta": {
    "totalItems": 45,
    "itemsPerPage": 20,
    "totalPages": 3,
    "currentPage": 1
  }
}
```

### Estados de Venta (StatusSale)

| Estado                         | Descripcion                             | Contexto           |
| ------------------------------ | --------------------------------------- | ------------------ |
| `RESERVATION_PENDING`          | Reserva registrada, sin pagos           | Reserva            |
| `RESERVATION_PENDING_APPROVAL` | Pago de reserva pendiente de aprobacion | Reserva            |
| `RESERVATION_IN_PAYMENT`       | Pago parcial de reserva aprobado        | Reserva            |
| `RESERVED`                     | Reserva completada y aprobada           | Reserva            |
| `PENDING`                      | Venta creada, sin pagos                 | Directa/Financiada |
| `PENDING_APPROVAL`             | Pago pendiente de aprobacion            | Directa/Financiada |
| `IN_PAYMENT`                   | Pago parcial aprobado                   | Directa/Financiada |
| `APPROVED`                     | Venta aprobada                          | Directa            |
| `COMPLETED`                    | Venta completada y totalmente pagada    | Directa            |
| `IN_PAYMENT_PROCESS`           | Inicial aprobada, pagando cuotas        | Financiada         |
| `REJECTED`                     | Rechazada                               | Final              |
| `WITHDRAWN`                    | Retirada/anulada                        | Final              |

---

## Flujo 3: Ver Detalle de una Venta

### Descripcion

Muestra toda la informacion de una venta: datos generales, cliente, lote, pagos, financiamiento.

| Endpoint                                    | Metodo | Descripcion                        |
| ------------------------------------------- | ------ | ---------------------------------- |
| `/api/sales/:id`                            | GET    | Detalle completo de la venta       |
| `/api/sales/:saleId/financing/:financingId` | GET    | Detalle de financiamiento (cuotas) |

### Request Detalle

```
GET /api/sales/uuid-de-la-venta
```

### Response Detalle

```json
{
  "id": "uuid-de-la-venta",
  "type": "FINANCED",
  "totalAmount": 64000,
  "contractDate": "2024-01-15",
  "status": "IN_PAYMENT_PROCESS",
  "currency": "USD",
  "createdAt": "2024-01-15T10:30:00Z",
  "reservationAmount": 2000,
  "reservationAmountPaid": 2000,
  "reservationAmountPending": 0,
  "maximumHoldPeriod": 15,
  "fromReservation": true,
  "totalToPay": 64000,
  "totalAmountPaid": 15000,
  "initialToPay": 10000,
  "initialAmountPaid": 10000,
  "client": {
    "firstName": "Carlos",
    "lastName": "Garcia",
    "address": "Av. Principal 123",
    "phone": "999777666",
    "reportPdfUrl": "https://...",
    "document": "12345678"
  },
  "secondaryClients": [
    {
      "firstName": "Maria",
      "lastName": "Lopez",
      "address": "Calle 456",
      "phone": "999111222"
    }
  ],
  "lot": {
    "id": "uuid-del-lote",
    "name": "Lote A-01",
    "lotPrice": 50000,
    "block": "Mz A",
    "stage": "Etapa 1",
    "project": "Proyecto Sol"
  },
  "radicationPdfUrl": "https://...",
  "paymentAcordPdfUrl": "https://...",
  "guarantor": {
    "firstName": "Juan",
    "lastName": "Perez"
  },
  "liner": { "firstName": "...", "lastName": "..." },
  "vendor": { "firstName": "Vendedor", "lastName": "Demo", "document": "99999999" },
  "paymentsSummary": [
    {
      "id": 1,
      "amount": 2000,
      "status": "APPROVED",
      "createdAt": "2024-01-15T11:00:00Z",
      "reviewedAt": "2024-01-15T15:00:00Z",
      "codeOperation": "OP-001",
      "banckName": "BCP",
      "dateOperation": "2024-01-15",
      "numberTicket": "T-001",
      "paymentConfig": "RESERVATION",
      "reason": null,
      "metadata": null
    },
    {
      "id": 2,
      "amount": 10000,
      "status": "APPROVED",
      "createdAt": "2024-01-20T10:00:00Z",
      "reviewedAt": "2024-01-20T14:00:00Z",
      "codeOperation": "OP-002",
      "banckName": "BCP",
      "dateOperation": "2024-01-20",
      "numberTicket": "T-002",
      "paymentConfig": "INITIAL",
      "reason": null,
      "metadata": null
    }
  ],
  "financing": {
    "lot": {
      "id": "uuid-financing-lot",
      "financingType": "LOT",
      "initialAmount": 10000,
      "initialAmountPaid": 10000,
      "initialAmountPending": 0,
      "interestRate": 12,
      "interestRateSections": [{ "startInstallment": 1, "endInstallment": 36, "interestRate": 12 }],
      "quantityCoutes": 36,
      "totalCouteAmount": 48000,
      "totalPaid": 3000,
      "totalPending": 45000,
      "totalLateFee": 0,
      "totalLateFeeePending": 0,
      "totalLateFeePaid": 0,
      "installments": [
        {
          "id": "uuid-installment-1",
          "numberCuote": 1,
          "couteAmount": 1333.33,
          "coutePending": 0,
          "coutePaid": 1333.33,
          "expectedPaymentDate": "2024-03-01",
          "lateFeeAmount": 0,
          "lateFeeAmountPending": 0,
          "lateFeeAmountPaid": 0,
          "status": "PAID",
          "isParked": false
        }
      ]
    },
    "hu": {
      "id": "uuid-financing-hu",
      "financingType": "HU",
      "initialAmount": 0,
      "initialAmountPaid": 0,
      "initialAmountPending": 0,
      "interestRate": 0,
      "quantityCoutes": 12,
      "totalCouteAmount": 14000,
      "totalPaid": 0,
      "totalPending": 14000,
      "totalLateFee": 0,
      "totalLateFeeePending": 0,
      "totalLateFeePaid": 0,
      "installments": []
    }
  }
}
```

---

## Registrar un Pago (Accion del VEN)

El vendedor puede registrar pagos desde el listado o el detalle de una venta.

| Endpoint                       | Metodo | Descripcion                     |
| ------------------------------ | ------ | ------------------------------- |
| `/api/sales/payments/sale/:id` | POST   | Registrar pago con comprobantes |

### Request

**Content-Type: `multipart/form-data`**

| Campo      | Tipo          | Descripcion                     |
| ---------- | ------------- | ------------------------------- |
| `payments` | string (JSON) | Array de vouchers (stringified) |
| `files`    | File[]        | Archivos de comprobantes        |

**Estructura del JSON `payments`:**

```json
[
  {
    "bankName": "BCP",
    "transactionReference": "REF-001",
    "transactionDate": "2024-01-15",
    "amount": 5000,
    "codeOperation": "OP-12345",
    "fileIndex": 0
  }
]
```

- `fileIndex` indica cual archivo del array `files` corresponde a este voucher
- Se pueden enviar multiples vouchers en un solo pago

### Response

```json
{
  "id": 1,
  "relatedEntityType": "SALE",
  "relatedEntityId": "uuid-de-la-venta",
  "amount": 5000,
  "methodPayment": "TRANSFER",
  "status": "PENDING",
  "createdAt": "2024-01-15T10:30:00Z",
  "vouchers": [
    {
      "id": 1,
      "url": "https://storage.example.com/voucher.pdf",
      "amount": 5000,
      "bankName": "BCP",
      "transactionReference": "REF-001",
      "transactionDate": "2024-01-15"
    }
  ]
}
```

---

## Diagrama Resumen de Endpoints (Rol VEN)

```
CREAR VENTA (Flujo multi-paso)
├── GET  /api/sales/projects/actives              → Proyectos disponibles
├── GET  /api/sales/stages/:projectId             → Etapas del proyecto
├── GET  /api/sales/blocks/:stageId               → Bloques de la etapa
├── GET  /api/sales/lots/:blockId?status=Activo   → Lotes disponibles
├── GET  /api/sales/clients/document/:doc         → Buscar cliente
├── POST /api/sales/financing/calculate-amortization → Calcular cuotas
├── POST /api/sales/clients/guarantors/create     → Crear cliente/garante
└── POST /api/sales                               → Crear venta

LISTAR MIS VENTAS
└── GET  /api/sales/all/list/vendor               → Ventas del vendedor (paginado)

VER DETALLE
├── GET  /api/sales/:id                           → Detalle completo
└── GET  /api/sales/:saleId/financing/:financingId → Detalle de financiamiento

REGISTRAR PAGO (desde listado o detalle)
└── POST /api/sales/payments/sale/:id             → Registrar pago (multipart/form-data)
```

---

## Tecnologias Requeridas

| Tecnologia             | Version | Uso                                           |
| ---------------------- | ------- | --------------------------------------------- |
| React                  | 18+     | UI Framework                                  |
| @tanstack/react-query  | 5+      | Server state management y cache               |
| axios                  | 1+      | HTTP client                                   |
| zod                    | 3+      | Validacion de formularios                     |
| date-fns + date-fns-tz | 3+      | Formateo de fechas                            |
| react-hook-form        | 7+      | Manejo de formularios (opcional, recomendado) |

## Notas Importantes

1. **Autenticacion**: Todas las peticiones requieren el header `Authorization: Bearer <accessToken>`
2. **Moneda**: Los montos se manejan en la moneda del proyecto (`USD` o `PEN`), indicada en `projectCurrency`
3. **Fechas**: Todas las fechas vienen en formato ISO 8601 (UTC). Usar las utilidades de `date-formatter.ts` para mostrar
4. **Paginacion**: Los listados devuelven `{ items: T[], meta: { totalItems, itemsPerPage, totalPages, currentPage } }`
5. **Pagos**: Los archivos de voucher se envian como `multipart/form-data`, no como JSON
6. **Cache**: Los hooks de React Query manejan cache automatico. Ajustar `staleTime` segun necesidades
7. **Errores**: La API devuelve errores con formato `{ message: string }`. Los interceptores manejan 401 automaticamente
