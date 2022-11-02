const fs = require("fs");

const dataRaw = JSON.parse(fs.readFileSync("data.raw.json").toString());

const data = {
    resourceType: "Bundle",
    type: "transaction",
    entry: dataRaw.entry.map((item) => {
        return {
            resource: item.resource,
            request: {
                method: "PUT",
                url: `${item.resource.resourceType}/${item.resource.id}`
            }
        }
    })
}

fs.writeFileSync("data.parsed.json", JSON.stringify(data, null, 4))
