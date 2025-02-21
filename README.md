# WeedJS

![WeedJS Logo](https://raw.githubusercontent.com/likhonsheikh54/WeedJS/refs/heads/main/DOM/IMG_1663.png)

**WeedJS** is a powerful JavaScript toolkit designed to streamline web development by integrating essential features like Google Tag Manager, automatic URL submission to IndexNow, and dynamic breadcrumb generation. This toolkit is perfect for developers looking to enhance their web applications effortlessly.

## Features

- **Automatic Google Tag Manager Integration**: Easily mount Google Tag Manager for efficient tracking.
- **URL Submission to IndexNow**: Automatically submit your site's URLs for quicker indexing.
- **Dynamic Breadcrumb Generation**: Improve your site's navigation and SEO with automatically generated breadcrumbs.
- **Success Loader**: Visually confirm successful operations with a centered success loader.
- **Global API Access**: Customize WeedJS functionality with a global API for tailored solutions.

## Installation

To incorporate WeedJS into your project, simply include the script in your HTML document as follows:

```html
<script src="https://weed-js.vercel.app/WeedDOM.js"></script>
```

## How to Use WeedJS

### Step 1: Include the Script

Add the following script tag within the `<head>` section of your HTML file:

```html
<script src="https://weed-js.vercel.app/WeedDOM.js"></script>
```

### Step 2: Automatic Integrations

Upon loading the script, WeedJS will automatically:
- Mount Google Tag Manager using the provided ID.
- Submit your site’s URLs to the IndexNow API.
- Generate breadcrumbs dynamically based on the page structure.

### Step 3: Display Success Loader

If the integrations are successful, a success loader will be displayed automatically at the center of your webpage. This loader is sourced from:

```
https://raw.githubusercontent.com/likhonsheikh54/WeedJS/refs/heads/main/DOM/success.svg
```

The success loader will hide automatically after a few seconds, providing a seamless user experience.

## Example Usage

Below is an example of a simple HTML page using WeedJS:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>WeedJS Test Page</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://weed-js.vercel.app/WeedDOM.js"></script>
</head>
<body>
  <h1>Welcome to WeedJS Test Page</h1>
  <p>This page demonstrates WeedJS functionality.</p>
</body>
</html>
```

## Why Use WeedJS?

WeedJS simplifies the integration of essential web functionalities, allowing developers to focus more on building features rather than dealing with repetitive setup tasks. The automatic URL submission and breadcrumb generation enhance SEO and user experience, making it a valuable tool for modern web development.

## API Reference

WeedJS exposes a global API for further customization. For example, you can push custom events to Google Tag Manager as follows:

```javascript
WeedDOM.gtm.push({ event: 'customEvent', action: 'testClick' });
```

### Loader Control

You can manually show or hide the success loader using:

```javascript
WeedDOM.showLoader();  // To show the loader
WeedDOM.hideLoader();  // To hide the loader
```

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

For any questions or support, please reach out via the GitHub Issues page or contact me directly.

---

<div align="center">
  <img src="https://star-history.com/#likhonsheikh54/WeedDOM&Date" alt="Star History">
</div>

---

<div align="center">
  <h2>🌟 Modern and Colorful WeedJS 🌟</h2>
  <p>Experience the future of web development with WeedJS!</p>
</div>

---

<div align="center">
  <h2>🌿 WeedDOM - Advanced Web Integration & Domain Analytics Toolkit 🌿</h2>
  <p>Version: 1.0.0</p>
  <p>Repository: <a href="https://github.com/likhonsheikh54/WeedJS">https://github.com/likhonsheikh54/WeedJS</a></p>
  <p>Author: likhonsheikh54 (GitHub: likhon sheikh)</p>
  <p>Powered by: <a href="https://t.me/RecentCoders">https://t.me/RecentCoders</a> & <a href="https://www.v4os.org">https://www.v4os.org</a></p>
  <p>Co-powered by: <a href="https://vortexcybersecurity.org">https://vortexcybersecurity.org</a></p>
  <p>Description: WeedDOM automatically integrates GTM, handles IndexNow URL submissions, generates dynamic breadcrumbs, and scans connected external domains. Upon successful integration, a centered success loader is displayed using the SVG at: <a href="https://raw.githubusercontent.com/likhonsheikh54/WeedJS/refs/heads/main/DOM/success.svg">success.svg</a></p>
</div>
