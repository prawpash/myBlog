export const generateRandomId = async (length: number = 16) => {
  const data = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const dataLength = data.length;
  let randomId = "";

  for (let i = 0; i < length; i++) {
    randomId += data.charAt(Math.floor(Math.random() * dataLength));
  }

  return randomId;
};
