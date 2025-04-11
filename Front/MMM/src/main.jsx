import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

// 서비스 워커 등록 함수 import
import { registerServiceWorker } from './serviceWorkerRegistration';

createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </RecoilRoot>

);

// 앱이 로드된 직후에 서비스 워커 등록
registerServiceWorker();
