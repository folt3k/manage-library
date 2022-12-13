export const mapParamToArray = <T>(param: T | T[] | undefined): T[] => {
  if (Array.isArray(param)) {
    return param;
  }

  if (typeof param === "string") {
    return [param];
  }

  return [];
};
