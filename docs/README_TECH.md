# Documentación Técnica: Sistema de Gestión de Contratos CONAF (Frontend)

## 📋 Generalidades
Este proyecto es una **SPA (Single Page Application)** construida en **React 18** y **Vite**. Está diseñada para gestionar el ciclo de vida de contratos físicos de funcionarios de CONAF, integrándose con una API REST en Python (FastAPI).

## 🏗️ Arquitectura de Componentes
- **Vistas Principales**: `ContractsPage.jsx` gestiona las pestañas de estados (Funcionarios, Con PDF, Completados, Pendientes).
- **Gestor de Detalle**: `ContractDrawer.jsx` centraliza la creación y el workflow de un funcionario específico.
- **Workflow Engine**: `PhysicalSignatureWorkflow.jsx` contiene la máquina de estados lineal (`PENDIENTE` → `REVISADO` → `IMPRESO` → `ESPERANDO_FIRMA` → `COMPLETADO`).

## 📡 Integración con API (v2.0)
El servicio centralizado se encuentra en `src/services/api.js`.

### Funciones Críticas:
- `getTemplates()`: Lista los formatos de documento (Indefinido, Honorarios, etc.) registrados en el servidor.
- `create(empleadoId, templateId, datos)`: Genera un nuevo contrato en el backend. Los `datos` se envían como JSON dinámico (`datos_formulario`).
- `getPdfViewUrl(id, type)`: Genera la URL para el visor de PDF (`iframe` / `window.open`) inyectando el token JWT necesario para autenticación.

## ⚙️ Configuración y Entorno
El sistema requiere las siguientes variables en `.env.local`:
- `VITE_API_BASE_URL`: URL del backend FastAPI (ej: `https://conafbackend-production.up.railway.app`).

## 🛡️ Seguridad y Cumplimiento
- **Autenticación**: OAuth2 Password Bearer (JWT) almacenado en `localStorage`.
- **Privacidad**: Los datos sensibles NO se sirven de forma estática; toda visualización requiere un token válido en los headers o en query params específicos de corta duración.

## 🛠️ Guía de Desarrollo: Añadir Nuevo Estado
1. Actualizar `CONTRACT_STATES` (pendiente centralizar en constantes).
2. Modificar el switch en `PhysicalSignatureWorkflow.jsx` para incluir el nuevo bloque visual.
3. Asegurar que el backend soporte la nueva transición para evitar errores 409 (Conflicto).

---
*Documento generado automáticamente por la auditoría técnica del 26/03/2026.*
