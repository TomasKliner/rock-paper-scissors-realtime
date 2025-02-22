import client from "../../utils/socketio";
import SocketIoContext from "../contexts/socketioContext";

export default function SocketIoProvider({ children }) {
  return <SocketIoContext.Provider value={{ client }}>{children}</SocketIoContext.Provider>;
}
