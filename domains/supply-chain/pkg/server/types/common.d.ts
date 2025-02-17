declare module common {
  type Context = {
    api: Record<string, any>;
  };

  type RPCMessage = {
    jsonrpc: '2.0';
    name: string;
    method: string;
    params?: any;
    id?: string;
  };
}
