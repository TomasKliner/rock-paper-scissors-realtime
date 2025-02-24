'use client';

import socket from "../../utils/socketio";
import SocketIoContext from "../contexts/socketioContext";

export default function SocketIoProvider({ children }) {
  return <SocketIoContext.Provider value={socket}>{children}</SocketIoContext.Provider>;
}
