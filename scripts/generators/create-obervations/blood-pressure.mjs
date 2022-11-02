import randomExt from 'random-ext'
import { DateTime } from 'luxon'

export default ({ patientId, count = 5 }) => {
    return new Array(count).fill(null).map((_item, idx) => {
        const id = `bp-obs-${patientId}-${idx}`
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
                            system: "http://loinc.org",
                            code: "85354-9",
                            display: "Blood pressure panel with all children optional"
                        }
                    ],
                    text: "Blood pressure systolic & diastolic"
                },
                subject: {
                    reference: `Patient/${patientId}`,
                },
                component: [
                    {
                        code: {
                            coding: [
                                {
                                    system: "http://loinc.org",
                                    code: "8480-6",
                                    display: "Systolic blood pressure"
                                }
                            ]
                        },
                        valueQuantity: {
                            value: randomExt.integer(150, 100),
                            unit: "mmHg",
                            system: "http://unitsofmeasure.org",
                            code: "mm[Hg]"
                        }
                    },
                    {
                        code: {
                            coding: [
                                {
                                    system: "http://loinc.org",
                                    code: "8462-4",
                                    display: "Diastolic blood pressure"
                                }
                            ]
                        },
                        valueQuantity: {
                            value: randomExt.integer(100, 60),
                            unit: "mmHg",
                            system: "http://unitsofmeasure.org",
                            code: "mm[Hg]"
                        }
                    }
                ]
            },
            request: {
                method: 'PUT',
                url: `Observation/${id}`
            },
        }
    })
}