import ReactDOM from "react-dom/client";
import App from "./App";
import 'font-awesome/css/font-awesome.min.css';
import "./index.css";
import { DataProvider } from "./store/DataContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <DataProvider>
    <App />
  </DataProvider>
);
