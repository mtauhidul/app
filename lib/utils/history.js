export function historyPush(path, props, prefixProp = null) {
  const prefix = prefixProp || props?.match?.params?.state || '';
  const url = `/${prefix}${path}${window.location.search}`;

  if (props && props.history) {
    return props.history.push(url);
  }
  return null;
}
export function historyReplace(path, props, prefixProp = null) {
  const prefix = prefixProp || props?.match?.params?.state || '';
  const url = `${prefix}${path}${window.location.search}`;
  if (props && props.history) {
    return props.history.replace(url);
  }
  return null;
}
