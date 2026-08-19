function generateTraceId(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;


  
  let traceId = '';
  for (let i = 0; i < length; i++) {
    traceId += chars[getRandomInteger(1, charsLength)];
  }
  
  
  return traceId;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { generateTraceId };