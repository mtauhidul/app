import randomExt from 'random-ext'
import { DateTime } from 'luxon'

export default ({ patientId, count = 5 }) => {
    return new Array(count).fill(null).map((_item, idx) => {
        const id = `hr-obs-${patientId}-${idx}`
        return {
            resource: {
                id,
                resourceType: 'Observation',
                effectiveDateTime: DateTime.now().toUTC().minus({ days: idx * randomExt.integer(30, 20) }).toISODate(),
                status: "final",
                category: [
                    {
                        coding: [
                            {
                                system: "http://terminology.hl7.org/CodeSystem/observation-category",
                                code: "vital-signs",
                                display: "Vital Signs"
                            }
                        ],
                        text: "Vital Signs"
                    }
                ],
                code: {
                    coding: [
                        {
                            system: 'http ://loinc.org',
                            code: '8867-4',
                        }
                    ]
                },
                subject: {
                    reference: `Patient/${patientId}`,
                },
                valueQuantity: {
                    value: randomExt.integer(120, 45),
                    unit: '/min',
                    code: '/min',
                    system: 'http://unitsofmeasure.org',
                }
            },
            request: {
                method: 'PUT',
                url: `Observation/${id}`
            },
        }
    })
}