const handleErrorsAsync = async (func) => {
  try {
    const result = await func();
    return result;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

export default handleErrorsAsync;
