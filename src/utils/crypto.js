import crypto from 'crypto';
export function hashIt(str) {
  const hash = crypto.createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}
export function matched(activeKey, userPhone) {
  if (activeKey && userPhone) {
    return hashIt(`${userPhone}_hash`) === activeKey;
  }
  return false;
}
