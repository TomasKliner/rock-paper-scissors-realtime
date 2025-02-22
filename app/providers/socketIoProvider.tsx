'use client';
import { useMemo } from 'react';
import client from "../../utils/socketio";
import SocketIoContext from "../contexts/socketioContext";

export default function SocketIoProvider({ children }) {
  const value = useMemo(() => ({ client }), []);
  return <SocketIoContext.Provider value={value}>{children}</SocketIoContext.Provider>;
}
