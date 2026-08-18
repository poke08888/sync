# Walkthrough: Nonelab Studio Setup & Deployment

We have successfully containerized, set up, and deployed the **Nonelab Studio** application on both local and remote environments.

## 1. What Was Accomplished

### Local Development & Setup
- **Extraction**: Extracted [nonelabstudiosrc.zip](file:///Users/kevin/Downloads/nonelabstudiosrc.zip) to the workspace directory: [/Users/kevin/.gemini/antigravity/scratch/nonelabstudio](file:///Users/kevin/.gemini/antigravity/scratch/nonelabstudio).
- **Git Push**:
  - Initialized a Git repository.
  - Linked it to the target remote: `https://github.com/poke08888/videoana.git`.
  - Pushed the `main` branch: [https://github.com/poke08888/videoana.git](https://github.com/poke08888/videoana.git).
- **Local Dev Server**: Initialized and launched the local dev environment (Vite frontend + Express backend) running concurrently in the background.

### Remote VPS Deployment (`150.95.104.255`)
- **Dockerization**:
  - Created a [Dockerfile](file:///Users/kevin/.gemini/antigravity/scratch/nonelabstudio/Dockerfile) using Node 22 Alpine, building the React app into `dist/` and starting the Express server.
  - Created a [docker-compose.yml](file:///Users/kevin/.gemini/antigravity/scratch/nonelabstudio/docker-compose.yml) exposing the app on port `8787` with standard environment configurations.
- **VPS Deployment**:
  - Cloned the repository under `/var/www/videoana` on the VPS.
  - Built the docker image and started the container (`videoana-app`).
- **Nginx Reverse Proxy & SSL**:
  - Configured Nginx site `/etc/nginx/sites-available/video.nonelab.net` on port 80 to proxy requests to `http://127.0.0.1:8787`.
  - Configured client body size limit (`client_max_body_size 250M;`) to allow large video uploads.
  - Set up Certbot SSL to automatically fetch certs and configure redirection to `https://video.nonelab.net`.

---

## 2. Validation & Live Status

### Remote Server
- **URL**: [https://video.nonelab.net/](https://video.nonelab.net/)
- **API Health**: Verified running via [https://video.nonelab.net/api/health](https://video.nonelab.net/api/health).
  ```json
  {"ok":true,"model":"gemini-3-flash-preview","hasEnvKey":false}
  ```
- **SSL Status**: Valid HTTPS enabled via Let's Encrypt.
- **Port**: Exposed internal port `8787` mapped to docker container.

### Local Server
- **Frontend URL**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API**: [http://localhost:8787/](http://localhost:8787/)

---

## 3. Gemini API Key integration

Since there is no `GEMINI_API_KEY` defined in the environment variables, the system behaves as follows:
- **Fallback**: If a user runs an analysis without a key, the app serves pre-loaded **CIMEE** mock data for demo purposes.
- **User-provided Key**: Users can click on **Quản trị** (Admin) in the Web UI, paste their Google Gemini API Key, choose a model, and click **Kết nối**. This key is saved in the browser local storage and sent with all analysis requests.

> [!TIP]
> Make sure to update the active workspace directory in your Antigravity IDE to `/Users/kevin/.gemini/antigravity/scratch/nonelabstudio` to work on this code base.
