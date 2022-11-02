import randomExt from 'random-ext'
import { DateTime } from 'luxon'

export default ({ patientId, count = 2 }) => {
    return new Array(count).fill(null).map((_item, idx) => {
        const id = `hemoglobin-obs-${patientId}-${idx}`
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
                            system: 'http://loinc.org',
                            code: '17856-6',
                            display: 'Hemoglobin A1c/Hemoglobin.total in Blood by HPLC'
                        },
                    ],
                    text: 'Hemoglobin A1c/Hemoglobin.total in Blood by HPLC'
                },
                subject: {
                    reference: `Patient/${patientId}`,
                },
                valueQuantity: {
                    value: randomExt.float(10, 2),
                    unit: '%',
                    system: 'http://unitsofmeasure.org',
                    code: '%'
                }
            },
            request: {
                method: 'PUT',
                url: `Observation/${id}`
            },
        }
    })
}
