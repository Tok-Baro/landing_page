# Tokbaro Landing Page

This project is a simple, static landing page for "Tokbaro" (똑바로), built with HTML and CSS.

## 📂 Project Structure

```
landing/
├── index.html          # Main HTML file (Content & Structure)
├── style.css           # CSS file (Design, Layout, Animations)
├── assets/
│   └── images/
│       ├── mainchar.png    # Character image
│       ├── toklogo.png     # Logo image
│       └── commingsoon.png # (Unused) Badge image
└── README.md           # This documentation file
```

## 🛠 How to Edit

### 1. Changing Text & Content (`index.html`)
Open `index.html` in any text editor (VS Code, Notepad, etc.).
-   **Headlines & Paragraphs**: Look for text inside `<h1>`, `<h2>`, `<p>` tags.
-   **Business Info**: Scroll to the `<footer class="footer">` section at the bottom to update address or business number.

### 2. Changing Design & Colors (`style.css`)
Open `style.css` to modify the look and feel.
-   **Colors**: At the top of the file, under `:root`, you can change the color variables:
    ```css
    :root {
        --primary-color: #4A90E2; /* Change this for the main blue color */
        --secondary-color: #50E3C2; /* Change this for the teal accent */
        /* ... */
    }
    ```
-   **Fonts**: The project uses 'Noto Sans KR' from Google Fonts.
-   **Mobile/Desktop Layout**: Adjustments for screen sizes are at the bottom of the file inside `@media` blocks.

## 🚀 Deployment
Since this is a static site, you can deploy it easily:
-   **GitHub Pages**: Upload these files to a GitHub repository and enable GitHub Pages.
-   **Netlify/Vercel**: Drag and drop the folder to deploy instantly.
-   **Local**: Just double-click `index.html` to view it in your browser.
