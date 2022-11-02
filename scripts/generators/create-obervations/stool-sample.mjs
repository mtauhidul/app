import randomExt from 'random-ext'
import { DateTime } from 'luxon'

const options = [
    {
        coding: [
            {
                system: "http://snomed.info/sct",
                code: "260385009",
                display: "Negative",
            }
        ],
        text: "Negative"
    },
    {
        coding: [
            {
                system: "http://snomed.info/sct",
                code: "186431008",
                display: "CDIFF",
            }
        ],
        text: "CDIFF"
    }
]

export default ({ patientId, count = 1 }) => {
    return new Array(count).fill(null).map((_item, idx) => {
        const id = `stool-obs-${patientId}-${idx}`
        return {
            resource: {
                id,
                resourceType: 'Observation',
                effectiveDateTime: DateTime.now().toUTC().minus({ days: idx * randomExt.integer(30, 20) }).toISODate(),
                status: 'final',
                category: [
                    {
                        coding: [
                            {
                                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                                code: 'laboratory',
                                display: 'Laboratory'
                            }
                        ],
                        text: 'Laboratory'
                    }
                ],
                code: {
                    coding: [
                        {
                            system: 'http://snomed.info/sct',
                            code : '119339001',
                            display: 'Stool specimen (specimen)'
                        },
                    ],
                    text: 'Stool specimen (specimen)'
                },
                subject: {
                    reference: `Patient/${patientId}`,
                },
                valueCodeableConcept: randomExt.pick(options),
            },
            request: {
                method: 'PUT',
                url: `Observation/${id}`
            },
        }
    })
}
