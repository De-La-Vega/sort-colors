# 🎨 Color Sorting Tool

A small in-browser utility that helps **analyze, group, and clean up messy color palettes** — especially useful when a project lacks a proper design system and contains many nearly identical colors.

👉 **[Try it live on GitHub Pages](https://de-la-vega.github.io/sort-colors/)**

---

## 🧩 Use Case

In large or legacy projects, it’s common to find multiple near-duplicate colors like  
`#5e80ff`, `#5f81fe`, `#6082ff`, etc.  
This app helps to:

- Paste all color values from your codebase (in HEX format)
- Instantly **visualize** and **sort** them by various metrics
- Identify and remove duplicate or similar shades
- Form a clean and consistent palette for your style guide

---

## ⚙️ Sorting Methods

The app supports several sorting algorithms to help you understand and compare colors:

| Method | Description |
|--------|--------------|
| **Sort by Distance** | Groups colors by perceptual closeness to basic hues (red, blue, gray, etc.) |
| **Sort by Hue (HSV)** | Orders colors by hue angle on the color wheel |
| **Sort by Saturation (hSv)** | Sorts from grayish/desaturated to vivid colors |
| **Sort by Value (hsV)** | Sorts from dark to bright colors |
| **Sort by Luma** | Sorts by perceived brightness based on RGB weighting |

---

## 🧠 How It Works

Each color is parsed and converted to **RGB** and **HSV** values.  
The app calculates the following parameters:

- **Hue** — position on the color wheel  
- **Saturation** — intensity or purity of the color  
- **Value** — brightness level  
- **Luma** — perceived brightness based on weighted RGB  
- **Distance** — proximity to reference colors (e.g., red, green, blue, etc.)

The sorted color lists are then displayed as a series of colored blocks, allowing you to quickly compare tones and brightness visually.

---

## 🪄 Features

- Paste any list of HEX colors  
- Adjustable color box width and height  
- Remove colors inline with a single click  
- Real-time sorting and visualization  
- Works entirely client-side (no dependencies, no backend)

---

## 🛠️ Stack

- **Vanilla JavaScript**
- **HTML**
- **CSS**

All color logic and sorting algorithms are implemented manually — including RGB/HSV conversion and color distance computation.

---

## 📄 License

MIT License  
Copyright (c) 2021 Vitaliy Kirenkov
