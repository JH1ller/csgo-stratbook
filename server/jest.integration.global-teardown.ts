interface ServerEntry {
  dispose(): Promise<void>;
}

module.exports = async function () {
  if ((global as any).__BACKEND_INSTANCE__) {
    await ((global as any).__BACKEND_INSTANCE__ as ServerEntry).dispose();
  }
};
