// Wrapper function to handle asynchronous route handlers and forward errors to Express
const asycnHandler = (fn) => {
  return (res, req, next) => {
    Promise.resolve(fn(res, req, next)).catch((err) => next(err));
  };
};

export default asycnHandler;
