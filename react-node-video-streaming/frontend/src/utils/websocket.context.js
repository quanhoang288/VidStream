import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import io from 'socket.io-client';
import { SOCKET_URL } from '../configs';

export const WebsocketContext = createContext(null);

function WebsocketProvider({ children }) {
  const [connection, setConnection] = useState(null);

  const options = useMemo(() => ({}), []);

  useEffect(() => {
    try {
      const socketConnection = io(SOCKET_URL || 'ws://127.0.0.1:8000', options);
      setConnection(socketConnection);
    } catch (err) {
      console.log(err);
    }
  }, [options]);

  return (
    <WebsocketContext.Provider value={connection}>
      {children}
    </WebsocketContext.Provider>
  );
}

export const useWebsocket = () => {
  const ctx = useContext(WebsocketContext);
  if (ctx === undefined) {
    throw new Error('useWebsocket can only be used inside WebsocketContext');
  }
  return ctx;
};

export default WebsocketProvider;
