import "@/preflight.css"; // Tailwind CSS preflight styles, scoped to .twpf
import "@/styles.css";
import ReactDOM from "react-dom";
import { CommunicatingIcons } from "./components/LoadingIcon";

ReactDOM.render(<CommunicatingIcons />, document.getElementById("newWindow"));
