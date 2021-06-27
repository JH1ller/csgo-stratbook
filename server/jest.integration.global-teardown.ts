interface ServerEntry {
  dispose(): Promise<void>;
}

module.exports = async function () {
  await ((global as any).__BACKEND_INSTANCE__ as ServerEntry).dispose();
};
