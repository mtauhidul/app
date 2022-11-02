import randomExt from 'random-ext'
import { DateTime } from 'luxon'

export default ({ patientId, count = 1 }) => {
    return new Array(count).fill(null).map((_item, idx) => {
        const id = `wbc-obs-${patientId}-${idx}`
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
                            system : 'http://loinc.org',
                            code : '26464-8',
                            display : 'Leukocytes [#/volume] in blood'
                          },
                    ],
                    text: 'Leukocytes [#/volume] in blood'
                },
                subject: {
                    reference: `Patient/${patientId}`,
                },
                valueQuantity : {
                    value : randomExt.float(15, 1),
                    system : 'http://unitsofmeasure.org',
                    unit: '10*3/uL',
                    code : '10*3/uL'
                  }
            },
            request: {
                method: 'PUT',
                url: `Observation/${id}`
            },
        }
    })
}
