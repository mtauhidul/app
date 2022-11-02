var randomExt = require('random-ext');

const patientId = "SMART-9995679";

const entry = new Array(20).fill(null)
    .map(() => ({
        value: randomExt.float(35, 42),
        date: randomExt.date(new Date(), new Date(2021, 01, 01)).getTime(),
    }))
    .sort((a, b) => b.date - a.date)
    .map(({ value, date }, idx) => {
        return {
            "resource": {
                "resourceType": "Observation",
                "id": `${patientId}-temperature-${idx}`,
                "status": "final",
                "category": [
                    {
                        "coding": [
                            {
                                "system": "http://hl7.org/fhir/observation-category",
                                "code": "vital-signs",
                                "display": "Vital Signs",
                                "userSelected": false
                            }
                        ],
                        "text": "Vital Signs"
                    }
                ],
                "code": {
                    "coding": [
                        {
                            "system": "http://loinc.org",
                            "code": "8310-5",
                            "display": "temperature",
                            "userSelected": false
                        }
                    ],
                    "text": "temperature"
                },
                "subject": {
                    "reference": `Patient/${patientId}`
                },
                "effectiveDateTime": new Date(date).toISOString().slice(0, 10),
                "valueQuantity": {
                    "value": value,
                    "unit": "Cel",
                    "system": "http://unitsofmeasure.org",
                    "code": "Cel"
                }
            },
            "request": {
                "method": "PUT",
                "url": `Observation/${patientId}-temperature-${idx}`
            }
        }
    });

console.log(JSON.stringify({
    resourceType: "Bundle",
    type: "transaction",
    entry
}));
