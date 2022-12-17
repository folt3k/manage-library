export const formatQueryParamDate = (date: string, type: "from" | "to"): string => {
  if (!type) {
    throw new Error('You have to pass "type" argument.');
  }

  const _date = new Date(date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));

  if (type === "to") {
    _date.setHours(23, 59, 59, 999);
  }

  return _date.toISOString();
};
