export function name(package_json: any) {
  return package_json.name.replace(/-/g, '_');
}

