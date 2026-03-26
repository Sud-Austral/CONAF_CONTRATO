# Deuda Técnica del Proyecto: CONAF Gestión de Contratos (V2.0)

## Resumen Ejecutivo
El proyecto ha sido refactorizado recientemente de una solución basada en JSON estático a una arquitectura moderna Cliente-Servidor (FastAPI/React). Si bien el "look & feel" es premium, la transición dejó atrás archivos sensibles en la carpeta pública y desincronización en la firma de las funciones de integración con la API v2.0.

- **Nivel estimado de deuda técnica:** Medio
- **Principales riesgos:** Exposición de datos (Resuelto parcialmente), inconsistencia en tipos de datos entre capas y falta de cobertura de tests.

## Tabla de Prioridades
| ID | Problema | Severidad | Impacto | Esfuerzo | Prioridad |
|----|----------|----------|--------|----------|----------|
| DT01 | Exposición de `data.json.gz` en `/public` | Crítica | Crítico | Bajo | 1 (FIXED) |
| DT02 | Firma de `create` inconsistent con API v2.0 | Alta | Crítico | Bajo | 2 (FIXED) |
| DT03 | Falta de selección de Templates en UI | Alta | Medio | Medio | 3 (FIXED) |
| DT04 | JWT Token visible en Query Params | Media | Medio | Medio | 4 |
| DT05 | Ausencia de Tipado Estático (TypeScript) | Media | Alto | Alto | 5 |
| DT06 | Duplicidad de lógica en Pestañas | Baja | Bajo | Medio | 6 |

## Detalle de Problemas

### [DT01] Exposición de datos sensibles en `/public`
- **Descripción:** El archivo `data.json.gz` contenía la base de datos completa de funcionarios. Fue eliminado durante la auditoría del 26/03.
- **Ubicación:** `public/data.json.gz`
- **Impacto:** Riesgo legal crítico (Ley 19.628).
- **Severidad:** Crítica
- **Recomendación:** Asegurar que el proceso de Build no vuelva a incluir este archivo.

### [DT02] Firma de `create` inconsistente con API v2.0
- **Descripción:** El componente calling enviaba un objeto único en lugar de los parámetros posicionales requeridos por el servicio actualizado.
- **Ubicación:** `src/components/contracts/ContractDrawer.jsx`
- **Impacto:** Bloqueo total de la funcionalidad de creación.
- **Severidad:** Alta
- **Recomendación:** (RESUELTO) Se actualizó la llamada para pasar `(id, template, datos)`.

### [DT03] Falta de selección de Templates en UI
- **Descripción:** La API v2.0 permite generar distintos formatos (Honorarios, Brigadistas, etc.), pero la UI estaba hardcodeada a "Indefinido".
- **Ubicación:** `src/components/contracts/form-sections/ContractSection.jsx`
- **Impacto:** Limitación funcional severa.
- **Severidad:** Alta
- **Recomendación:** (RESUELTO) Se integró el selector alimentado por `getTemplates()`.

### [DT04] JWT Token visible en Query Params
- **Descripción:** El visor de PDF usa el token en la URL para bypass de CORS/Headers en iframes.
- **Ubicación:** `src/services/api.js` (`getPdfViewUrl`)
- **Impacto:** Los servidores intermedios y el historial del navegador registran el secreto.
- **Severidad:** Media
- **Recomendación:** Implementar One-Time Tokens (OTT) en el backend.

## Quick Wins (Logrados)
- **Eliminación de archivos sensibles**: El riesgo DT01 ha sido mitigado.
- **Buscador Unificado**: Se movió el buscador de funcionarios al cuerpo de la tabla para coincidir con el resto de la App.
- **Corrección de Referencias**: Se eliminaron los errores `onAction is not defined`.

## Recomendaciones Estratégicas
- **Migración a TypeScript**: Indispensable para manejar el objeto `Contrato` que tiene 15+ campos.
- **Web Workers para PDF**: Si se vuelve a generar el PDF en el cliente, debe hacerse fuera del hilo principal.
- **Store Centralizado**: Migrar a Redux o Zustand para evitar el Prop Drilling en el Drawer.

## Métricas (Inferidas)
- **Complejidad ciclomática**: Alta en `ContractDrawer` (maneja demasiados estados de workflow).
- **Cobertura de tests**: 0%. Se recomienda iniciar con tests de integración para el servicio `api.js`.
