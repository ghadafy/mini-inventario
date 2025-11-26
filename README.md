# Mini-Inventario — Configuración de Calidad con CodeClimate (Qlty)

Este proyecto utiliza **CodeClimate Qlty** para analizar la calidad del código.  
La configuración **NO está en el repositorio**, sino en la **plataforma web**.

---

## Configurar Análisis en CodeClimate (Qlty)

1️⃣ Subir o tener el proyecto en GitHub  
2️⃣ En la web de CodeClimate:

- Ir a **Projects**
- Seleccionar este repositorio
- Ir a **Settings → Analysis Config**
  3️⃣ Pegar el siguiente contenido en la sección **QLTY.TOML**
  4️⃣ Guardar con **Save**
  5️⃣ Volver a **Overview** y ejecutar **Re-build** (o esperar análisis automático)

---

## 🛠 Configuración a pegar: QLTY.TOML

> Esta configuración activa análisis completos para:
>
> - JavaScript (ESLint)
> - CSS (Stylelint)
> - Duplicación de código
> - Reglas de mantenibilidad

```toml
version = "1.0"

[analyzers]
enabled = ["eslint", "stylelint", "duplication"]

[analyzers.eslint]
extensions = ["js"]
exclude = ["node_modules/", "dist/", "build/"]

[analyzers.stylelint]
extensions = ["css"]

[analyzers.duplication]
languages = ["javascript", "css"]
mass_threshold = 40

[rules]
argument-count-threshold = 4
method-lines-threshold = 40
file-lines-threshold = 350
method-complexity-threshold = 10
nested-control-flow-threshold = 4
return-statements-threshold = 4
```
