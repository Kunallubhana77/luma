# Biometric Authentication Local Lockbox
**B.Tech CSE 2025-29 React JS Case Study - Semester II**

A highly secure, frontend-only ReactJS web application that leverages the **Web Authentication API (WebAuthn)** to lock and unlock sensitive text payloads using your device's built-in biometric sensors (Touch ID / Face ID / Windows Hello).

This project completely eliminates the need for a backend database, operating entirely within local volatile memory and `localStorage` using **AES-GCM (256-bit)** encryption.

## Screenshots

<div align="center">
  <img src="src/assets/sample/First.png" alt="Splash Screen" width="300" />
  <img src="src/assets/sample/second.png" alt="Vault Controller" width="300" />
  <img src="src/assets/sample/Third.png" alt="Audit Console" width="300" />
</div>

## Features

- **Zero-Database State Model:** Maps biometric verification pulses directly to in-memory encryption keys via Zustand.
- **WebAuthn Registration Hook:** Uses `navigator.credentials.create()` to generate hardware-bound asymmetric key pairs.
- **AES-GCM Encryption Engine:** Wraps and unwraps text using `window.crypto.subtle` natively in the browser.
- **Auto-Locking Memory Wipe Matrix:** Automatically purges all decrypted strings from memory upon tab visibility loss or 60-second idle timeouts.
- **12pt Times New Roman Design:** Strict minimalist typography conforming precisely to grading rubrics.

## Architecture

1. **VaultController:** The master authenticator portal and security deck.
2. **VaultStage:** The secure text workbench featuring an encrypted payload viewer and a decrypted secret notebook.
3. **AuditConsole:** A local subsystem log tracking real-time cryptographic handshakes and WebAuthn success rates.

## How to Run Locally

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

*Note: The application must be run on `localhost` or served via HTTPS to allow the WebAuthn API to interface with the operating system's biometric hardware.*
