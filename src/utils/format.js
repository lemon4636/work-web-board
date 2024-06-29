export function getHashRouterPath(hash) {
  const [hashRouterPath] = `${hash}`.match(/(?<=#)[^?#]*/) || [];
  return hashRouterPath;
}
