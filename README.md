# 🌿 WeedDOM

<div align="center">
  <img src="https://raw.githubusercontent.com/likhonsheikh54/WeedJS/refs/heads/main/DOM/IMG_1663.png" alt="WeedDOM Logo" width="200" height="200"/>
  
  <p align="center">
    <strong>Advanced Web Integration & Domain Analytics Toolkit</strong>
  </p>
  
  <p align="center">
    <a href="#table-of-contents">Table of Contents</a> •
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#support">Support</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
</div>

## 📑 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Support](#support)
- [Contributing](#contributing)
- [License](#license)

## ⚡ Quick Start

```html
<script src="https://weed-js.vercel.app/WeedDOM.js"></script>
```

## 🚀 Features

- 🔄 **Smart Integration** - One-time loader with session management
- 📊 **GTM Setup** - Automatic Google Tag Manager integration
- 🔍 **IndexNow API** - Automated URL submission system
- 🧭 **Smart Navigation** - Dynamic breadcrumb generation
- 📱 **Domain Analysis** - Connected domains and backlinks scanning
- ⚡ **Modern UI** - Sleek success indicators and transitions

## 📥 Installation

To include WeedDOM in your project, add the following script tag to your HTML file:

```html
<script src="https://weed-js.vercel.app/WeedDOM.js"></script>
```

## 💻 Usage

```javascript
// Push GTM event
WeedDOM.gtm.push({
  event: 'user_action',
  category: 'engagement'
});

// Analyze domains
WeedDOM.scanner.analyze()
  .then(console.log);

// Reset session
WeedDOM.session.reset();
```

## 📚 API Reference

### GTM Methods
```javascript
WeedDOM.gtm.push(data)
```

### Scanner Methods
```javascript
WeedDOM.scanner.analyze()
WeedDOM.scanner.getDomains()
WeedDOM.scanner.getBacklinks()
```

### Configuration
```javascript
WeedDOM.config.get()
WeedDOM.config.update(newConfig)
```

## 🤝 Support

- 📧 [Report Issues](https://github.com/likhonsheikh54/WeedJS/issues)
- 💬 [Telegram](https://t.me/RecentCoders)
- 🌐 [Website](https://www.v4os.org)

## 🛠 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or fixes.

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/likhonsheikh54">likhonsheikh54</a>
</div>
