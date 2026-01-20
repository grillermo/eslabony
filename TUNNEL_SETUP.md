# Running Behind Cloudflare Tunnel

Since you are the only user, we've optimized the app for standalone execution.

## 1. Build the App
The app is configured to output a standalone build which includes only necessary files for production.

```bash
npm run build
```

## 2. Start the Production Server
You can run the standalone server directly or use the start script.

```bash
npm start
```
By default, this runs on port 3000.

## 3. Cloudflare Tunnel Setup

Assuming you have `cloudflared` installed.

1.  **Authenticate**:
    ```bash
    cloudflared tunnel login
    ```

2.  **Create a Tunnel**:
    ```bash
    cloudflared tunnel create link-saver
    ```

3.  **Configure Ingress**:
    Create a `config.yml` file:
    ```yaml
    tunnel: <Tunnel-UUID>
    credentials-file: /path/to/.cloudflared/<Tunnel-UUID>.json

    ingress:
      - hostname: links.yourdomain.com
        service: http://localhost:3000
      - service: http_status:404
    ```

4.  **Route DNS**:
    ```bash
    cloudflared tunnel route dns link-saver links.yourdomain.com
    ```

5.  **Run the Tunnel**:
    ```bash
    cloudflared tunnel run link-saver
    ```

## Notes
- **Security**: The app currently uses a hardcoded token `SECRET_TOKEN_123` for write operations. Since you are behind Cloudflare Tunnel, you can also add **Cloudflare Access** (Zero Trust) to protect the entire application (including GET requests) with your email/SSO. This is highly recommended even for personal use.
- **Port**: If you need to change the port, use `PORT=3000 npm start`.
