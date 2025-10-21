const asyncHandler = (fn) => async (req, res, next) => {
  try {
    const response = await fn(req, res, next);
    return response;
  } catch (error) {
    console.log("this error: ", error);
    next(error);
  }
};

export default asyncHandler;
