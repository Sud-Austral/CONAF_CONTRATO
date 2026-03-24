# Deuda Técnica del Proyecto: CONAF Gestión de Personal

## Resumen Ejecutivo
El proyecto es una aplicación React/Vite moderna y funcional orientada a la visualización de datos de personal y gestión de contratos con firma electrónica (FES). Aunque la interfaz es de alta calidad (premium), existen riesgos estructurales en la gestión de datos, seguridad y escalabilidad de la lógica de negocio.

- **Nivel estimado de deuda técnica:** Medio / Alto
- **Principales riesgos:** Exposición de datos sensibles (RUT/Salarios) en archivos públicos, falta de persistencia eficiente para datasets grandes y lógica de validación acoplada a la UI.

## Tabla de Prioridades
| ID | Problema | Severidad | Impacto | Esfuerzo | Prioridad |
|----|----------|----------|--------|----------|----------|
| DT01 | Exposición de datos sensibles en `/public` | Crítica | Crítico | Bajo | 1 |
| DT03 | Descompresión Gzip en Hilo Principal | Alta | Medio | Medio | 2 |
| DT05 | Mapeo Frágil en DataParser | Alta | Alto | Bajo | 3 |
| DT02 | Falta de Tipado Estático (TypeScript) | Media | Medio | Alto | 4 |
| DT04 | Lógica de Negocio Acoplada a Componentes | Media | Bajo | Medio | 5 |

## Detalle de Problemas

### [DT01] Exposición de datos sensibles en `/public`
- **Descripción:** El archivo `data.json.gz` se encuentra en la carpeta pública. Cualquier usuario con la URL puede descargar la base de datos completa de funcionarios, incluyendo RUTs y remuneraciones.
- **Ubicación:** `public/data.json.gz`
- **Impacto:** Riesgo legal y de privacidad grave (Ley 19.628 de protección de datos).
- **Severidad:** Crítica
- **Esfuerzo estimado:** Bajo (Mover a backend con autenticación)
- **Recomendación:** Implementar un middleware de API que sirva los datos solo tras autenticación exitosa.

### [DT03] Descompresión Gzip en Hilo Principal
- **Descripción:** La descompresión de 8MB de datos se realiza en el hilo principal de JS, lo que bloquea la UI durante varios segundos en dispositivos móviles.
- **Ubicación:** `src/utils/dataParser.js` (Función `fetchData`)
- **Impacto:** Experiencia de usuario (Jank/Freeze) en el arranque.
- **Severidad:** Alta
- **Esfuerzo estimado:** Medio
- **Recomendación:** Mover la lógica de `pako.ungzip` y `JSON.parse` a un **Web Worker**.

### [DT05] Mapeo Frágil en DataParser
- **Descripción:** Las columnas se mapean manualmente basándose en nombres que pueden cambiar (ej: el error reciente donde `base` era `tipo_de_contrato`).
- **Ubicación:** `src/utils/dataParser.js`
- **Impacto:** Rotura de la aplicación ante cambios mínimos en el dataset original.
- **Severidad:** Alta
- **Esfuerzo estimado:** Bajo
- **Recomendación:** Implementar un esquema de validación (Zod) o una capa de transformación con mayor tolerancia a errores.

## Quick Wins
- **DT05-Fix:** Centralizar los nombres de las columnas en constantes para facilitar cambios rápidos.
- **Contraste:** Ya corregido en la última iteración, pero requiere una revisión final de daltonismo.
- **Documentación:** Llenar el `README.md` con la arquitectura detectada para nuevos desarrolladores.

## Riesgos Críticos
- **Seguridad de Datos:** La presencia del JSON en `/public` es el riesgo más inminente que debe resolverse antes de un despliegue real en producción.

## Recomendaciones Estratégicas
- **Migración a TypeScript:** Para un proyecto de gestión legal y financiera, la seguridad de tipos es indispensable para evitar `TypeError: ... is not a function`.
- **Persistencia en IndexedDB:** Almacenar los datos ya parseados localmente para evitar redescargar y redescomprimir los 8MB en cada recarga de la página.
- **Arquitectura de Dominio:** Extraer la lógica de cálculo de KPIs de `aggregations.js` a servicios puros testeables individualmente.

## Métricas
- **Complejidad:** Media (Componentes como `ContractDrawer` gestionan demasiado estado).
- **Cobertura de tests:** 0% (No se detectaron archivos `.test.js` o `.spec.js`).
- **Nivel de acoplamiento:** Alto entre la estructura del dataset y la visualización.
