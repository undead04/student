type ResponseWrapper<T> = {
  statusCode: number;
  message: T;
  data: T;
};
export default ResponseWrapper;
