const crud = (pool: any) => (table: string) => {
  return {
    async query() {},
    async read() {},
  };
};

// todo: crud accept real db provider poll, crud(db(options))
export default (options: any) => crud(options);
