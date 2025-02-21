# 🌿 WeedDOM

<div align="center">
  <img src="https://raw.githubusercontent.com/likhonsheikh54/WeedJS/refs/heads/main/DOM/IMG_1663.png" alt="WeedDOM Logo" width="200" height="200"/>
  
  <p align="center">
    <strong>Advanced Web Integration & Domain Analytics Toolkit</strong>
  </p>
  
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#usage">Usage</a> •
    <a href="#api">API</a> •
    <a href="#support">Support</a>
  </p>
</div>

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

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/likhonsheikh54">likhonsheikh54</a>
</div>
