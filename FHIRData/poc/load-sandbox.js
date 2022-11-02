const fs = require("fs");
const fetch = require("node-fetch");
const sandboxURL = "https://api.logicahealth.org/HookR4/open";

const parseResource = (resource) => {
    return {
        resource,
        request: {
            method: "PUT",
            url: `${resource.resourceType}/${resource.id}`
        }
    }
}

fetch(`${sandboxURL}/Patient?_id=SMART-1768562`)
    .then((res) => res.json())
    .then((res) => {
        res.entry.forEach(async ({ resource: patient }) => {

            const bundle = {
                resourceType: "Bundle",
                type: "transaction",
                entry: []
            }

            const patientId = patient.id;

            bundle.entry.push(parseResource(patient))

            const resourceTypes = [
                "Observation", "Condition", "AllergyIntolerance",
                "MedicationRequest", "Encounter"
            ];
            
            await Promise.all(resourceTypes.map((async (resourceType) => {
                const resources = await fetch(`${sandboxURL}/${resourceType}?patient=${patientId}&_count=200`).then((res) => res.json())

                const resourcesEntry = resources.entry || [];

                resourcesEntry.forEach(({ resource: rawRes }) => {
                    bundle.entry.push(parseResource(rawRes))
                })

                return resources;
            })))

            console.log("--=--\n--=--\n--=--\n--=--\n--=--")
            console.log(bundle.entry.length)
            console.log("--=--\n--=--\n--=--\n--=--\n--=--")
            fs.writeFileSync(`parsed/${patientId}.json`, JSON.stringify(bundle, null, 4))
        })
    })