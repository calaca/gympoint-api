export default amount => {
  const regex = /\b(\d+)(\d{2})\b/;
  const amountStr = amount.toString();
  const subst = '$1,$2';

  return amountStr.replace(regex, subst);
};
