import vendors from "../src/data/vendors.json" with { type: "json" };

const allowedDomains = new Map([
  ["google", ["google.com"]],
  ["apple", ["icloud.com"]],
  ["samsung", ["samsung.com"]],
  ["xiaomi", ["i.mi.com", "mi.com"]],
  ["huawei", ["huawei.com"]],
  ["oppo", ["oppo.com"]],
  ["haveibeenpwned", ["haveibeenpwned.com"]]
]);

let hasFailure = false;

for (const vendor of vendors) {
  let response = await fetch(vendor.officialUrl, {
    method: "HEAD",
    redirect: "follow"
  }).catch((error) => ({ error }));

  if (!response.error && response.status === 405) {
    response = await fetch(vendor.officialUrl, {
      method: "GET",
      redirect: "follow"
    }).catch((error) => ({ error }));
  }

  if (response.error) {
    hasFailure = true;
    console.error(`${vendor.name}: request failed - ${response.error.message}`);
    continue;
  }

  const finalHost = new URL(response.url).hostname.replace(/^www\./, "");
  const knownDomains = allowedDomains.get(vendor.id) ?? [];
  const domainOk = knownDomains.some((domain) => finalHost === domain || finalHost.endsWith(`.${domain}`));

  if (!response.ok || !domainOk) {
    hasFailure = true;
    console.error(`${vendor.name}: ${response.status} ${response.url}`);
    continue;
  }

  console.log(`${vendor.name}: ok (${response.status}) ${response.url}`);
}

process.exit(hasFailure ? 1 : 0);
