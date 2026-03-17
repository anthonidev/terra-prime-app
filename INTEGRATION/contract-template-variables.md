# API de Variables de Plantilla

> Módulo: `contract` | Rol requerido: `SYS` | Autenticación: Bearer JWT

Este endpoint devuelve el catálogo de variables predefinidas disponibles para insertar en las plantillas de contrato. Son variables del sistema que se resuelven automáticamente al generar un contrato desde una venta.

---

## Base URL

```
/api/contract-template-variables
```

---

## Endpoints

### 1. Listar variables predefinidas

```
GET /api/contract-template-variables
GET /api/contract-template-variables?category=CLIENT
```

**Query params:**

| Param      | Tipo               | Requerido | Descripción                                                                                     |
| ---------- | ------------------ | --------- | ----------------------------------------------------------------------------------------------- |
| `category` | `VariableCategory` | No        | Filtrar por categoría (`SYSTEM`, `SALE`, `FINANCING`, `CLIENT`, `PROJECT`, `PAYMENT`, `CUSTOM`) |

**Response `200`:**

```json
[
  {
    "key": "system.currentDate",
    "label": "Fecha actual",
    "category": "SYSTEM",
    "type": "DATE",
    "description": "Fecha actual del sistema"
  },
  {
    "key": "system.currentYear",
    "label": "Año actual",
    "category": "SYSTEM",
    "type": "TEXT",
    "description": "Año actual del sistema"
  },
  {
    "key": "financing.lot.schedule",
    "label": "Cronograma de pagos de lote",
    "category": "FINANCING",
    "type": "TABLE",
    "description": "Cronograma de cuotas del lote: número de cuota, fecha de pago, monto",
    "options": {
      "columns": [
        { "key": "numberCuote", "label": "N° Cuota" },
        { "key": "expectedPaymentDate", "label": "Fecha" },
        { "key": "couteAmount", "label": "Monto" }
      ]
    }
  },
  {
    "key": "payment.reservation",
    "label": "Pagos de separación",
    "category": "PAYMENT",
    "type": "LIST",
    "description": "Lista de pagos realizados para la separación",
    "options": {
      "itemLabel": "Pago"
    }
  }
]
```

---

## Catálogo completo de variables

### SYSTEM (2)

| Key                  | Label        | Type |
| -------------------- | ------------ | ---- |
| `system.currentDate` | Fecha actual | DATE |
| `system.currentYear` | Año actual   | TEXT |

### SALE (6)

| Key                           | Label                              | Type     |
| ----------------------------- | ---------------------------------- | -------- |
| `sale.lotAmount`              | Monto del lote                     | CURRENCY |
| `sale.urbanDevelopmentAmount` | Monto habilitación urbana          | CURRENCY |
| `sale.type`                   | Tipo de venta                      | SELECT   |
| `sale.contractDate`           | Fecha de contrato                  | DATE     |
| `sale.reservationAmount`      | Monto de separación                | CURRENCY |
| `sale.maximumHoldPeriod`      | Fecha límite de pago de separación | DATE     |

### FINANCING (8)

| Key                                         | Label                       | Type     | Options                                                    |
| ------------------------------------------- | --------------------------- | -------- | ---------------------------------------------------------- |
| `financing.lot.initialAmount`               | Cuota inicial de lote       | CURRENCY | -                                                          |
| `financing.lot.quantityCoutes`              | Cantidad de cuotas de lote  | NUMBER   | -                                                          |
| `financing.lot.interestRate`                | Tasa de interés de lote     | NUMBER   | -                                                          |
| `financing.lot.schedule`                    | Cronograma de pagos de lote | TABLE    | `columns: [numberCuote, expectedPaymentDate, couteAmount]` |
| `financing.urbanDevelopment.initialAmount`  | Cuota inicial de HU         | CURRENCY | -                                                          |
| `financing.urbanDevelopment.quantityCoutes` | Cantidad de cuotas de HU    | NUMBER   | -                                                          |
| `financing.urbanDevelopment.interestRate`   | Tasa de interés de HU       | NUMBER   | -                                                          |
| `financing.urbanDevelopment.schedule`       | Cronograma de pagos de HU   | TABLE    | `columns: [numberCuote, expectedPaymentDate, couteAmount]` |

### CLIENT (5)

| Key               | Label                       | Type |
| ----------------- | --------------------------- | ---- |
| `client.fullName` | Nombre completo del cliente | TEXT |
| `client.document` | Documento de identidad      | TEXT |
| `client.address`  | Dirección del cliente       | TEXT |
| `client.phone`    | Teléfono del cliente        | TEXT |
| `client.email`    | Email del cliente           | TEXT |

### PROJECT (6)

| Key                 | Label               | Type   |
| ------------------- | ------------------- | ------ |
| `project.name`      | Nombre del proyecto | TEXT   |
| `project.currency`  | Moneda del proyecto | TEXT   |
| `project.lotName`   | Lote                | TEXT   |
| `project.lotArea`   | Área del lote       | NUMBER |
| `project.blockName` | Bloque del lote     | TEXT   |
| `project.stageName` | Etapa del lote      | TEXT   |

### PAYMENT (3)

| Key                   | Label                          | Type | Options             |
| --------------------- | ------------------------------ | ---- | ------------------- |
| `payment.reservation` | Pagos de separación            | LIST | `itemLabel: "Pago"` |
| `payment.lotInitial`  | Pagos de cuota inicial de lote | LIST | `itemLabel: "Pago"` |
| `payment.lot`         | Pagos de cuotas de lote        | LIST | `itemLabel: "Pago"` |

---

## Uso en el frontend

Estas variables se usan en el editor de plantillas (Tiptap) para insertar marcadores que luego se reemplazan con datos reales al generar un contrato. El frontend debería:

1. Llamar a `GET /api/contract-template-variables` para obtener el catálogo
2. Mostrar las variables agrupadas por `category` en un panel lateral o dropdown
3. Al seleccionar una variable, insertarla en el editor como un nodo especial con el `key` como identificador
4. El `type` indica cómo se renderizará el valor al generar el contrato:
   - `TEXT`, `NUMBER`, `DATE`, `CURRENCY`, `BOOLEAN` → valor inline
   - `SELECT` → valor inline seleccionado de las opciones
   - `TABLE` → tabla con las columnas definidas en `options.columns`
   - `LIST` → lista de items repetidos
