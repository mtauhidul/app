import randomExt from 'random-ext'
import { DateTime } from 'luxon'
import fetch from 'node-fetch'
import Jabber from 'jabber'
const jabber = new Jabber()

import createBpObs from './create-obervations/blood-pressure.mjs'
import createTempObs from './create-obervations/body-temperature.mjs'
import createHRObs from './create-obervations/heart-rate.mjs'
import createRRObs from './create-obervations/respiratory-rate.mjs'
import createWBCs from './create-obervations/white-blood-cells-count.mjs'
import createHemoglobin from './create-obervations/hemoglobin.mjs'
import createStoolSample from './create-obervations/stool-sample.mjs'

const patients = [
    {
        id: 'alpha',
        gender: 'male',
        name: ['Antonio', 'Adams'],
        age: 0
    },
    {
        id: 'beta',
        gender: 'male',
        name: ['Brian', 'Brooks'],
        age: 0
    },
    {
        id: 'gamma',
        gender: 'female',
        name: ['Gabrielle', 'Green'],
        age: 0
    },
    {
        id: 'delta',
        gender: 'female',
        name: ['Daisy', 'Davos'],
        age: 0
    },
    {
        id: 'epsilon',
        gender: 'male',
        name: ['Eric', 'Edwards'],
        age: 0
    },
    {
        id: 'zeta',
        gender: 'male',
        name: ['Zachary', 'Zimmerman'],
        age: 0
    },
    {
        id: 'eta',
        gender: 'female',
        name: ['Emma', 'Evans'],
        age: 0
    },
    {
        id: 'theta',
        gender: 'female',
        name: ['Tea', 'Torres'],
        age: 0
    },
    {
        id: 'iota',
        gender: 'male',
        name: ['Ian', 'Iallos'],
        age: 0
    },
    {
        id: 'kappa',
        gender: 'male',
        name: ['Kevin', 'King'],
        age: 0
    },
    {
        id: 'lambda',
        gender: 'female',
        name: ['Lora', 'Lavoie'],
        age: 0
    },
    {
        id: 'mu',
        gender: 'female',
        name: ['Mara', 'Miller'],
        age: 0
    },
    {
        id: 'nu',
        gender: 'male',
        name: ['Nathan', 'North'],
        age: 0
    },
    {
        id: 'xi',
        gender: 'male',
        name: ['Xavier', 'Smith'],
        age: 0
    },
    {
        id: 'omicron',
        gender: 'female',
        name: ['Ophelia', 'Ortiz'],
        age: 0
    },
    {
        id: 'pi',
        gender: 'female',
        name: ['Pamela', 'Parker'],
        age: 0
    },
    {
        id: 'rho',
        gender: 'male',
        name: ['Richard', 'Reynolds'],
        age: 0
    },
    {
        id: 'sigma',
        gender: 'male',
        name: ['Steven', 'Scott'],
        age: 0
    },
    {
        id: 'tau',
        gender: 'female',
        name: ['Tara', 'Turner'],
        age: 0
    },
    {
        id: 'upsilon',
        gender: 'female',
        name: ['Umah', 'Una'],
        age: 0
    },
    {
        id: 'phi',
        gender: 'male',
        name: ['Philip', 'Phillps'],
        age: 0
    },
    {
        id: 'chi',
        gender: 'male',
        name: ['Harry', 'Hill'],
        age: 0
    },
    {
        id: 'psi',
        gender: 'female',
        name: ['Peggy', 'Porter'],
        age: 0
    },
    {
        id: 'omega',
        gender: 'female',
        name: ['Olivia', 'Ortega'],
        age: 0
    },
]

const practitioners = [
    {
        id: 'md01',
        name: ['John', 'Smith']
    },
    {
        id: 'md02',
        name: ['Sonya', 'Laurence']
    },
    {
        id: 'md03',
        name: ['Harold', 'Evans']
    },
    {
        id: 'md04',
        name: ['Natalie', 'Alexis']
    }
]

const otherResourceTypes = [
    'Location',
    'Encounter',
    'MedicationRequest',
    'Condition',
    // 'Observation',
    'FamilyMemberHistory',
    'Procedure',
    'ServiceRequest',
    'MedicationAdministration',
    'DocumentReference',
    // 'Binary',
    // 'AllergyIntolerance',
]

const createResource = (resourceType, patientId, id) => {
    const newResource = {
        resource: {
            resourceType,
            id,
            subject: {
                reference: `Patient/${patientId}`
            }
        },
        request: {
            method: 'PUT',
            url: `${resourceType}/${id}`
        }
    }

    if (resourceType === 'Encounter') {
        newResource.resource.location = [
            {
                location: {
                    "reference": `Location/${`Location-${patientId}-0`.toLowerCase()}`,

                }
            }
        ]
    }

    if (resourceType === 'Observation') {
        newResource.resource.status = "final"
        newResource.resource.category = [
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
        ]
    }

    if (resourceType === 'Condition') {
        const display = `${jabber.createFullName(false).split(" ").pop()}ox`

        newResource.resource.clinicalStatus = {
            coding: [
                {
                    system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
                    version: "4.0.0",
                    code: "active",
                    display: "Active"
                }
            ],
            text: "Active"
        }
        newResource.resource.verificationStatus = {
            coding: [
                {
                    system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                    version: "4.0.0",
                    code: "confirmed",
                    display: "Confirmed"
                }
            ],
            text: "Confirmed"
        }
        newResource.resource.category = [
            {
                coding: [
                    {
                        system: "http://terminology.hl7.org/CodeSystem/condition-category",
                        code: "problem-list-item",
                        display: "Problem List Item"
                    }
                ],
                text: "Problem List Item"
            }
        ]
        newResource.resource.code = {
            coding: [
                {
                    system: "fake-cond-codes",
                    code: `C.${randomExt.string(2)}-${randomExt.integer(99999, 10000)}`,
                    display,
                },
            ],
            text: display,
        }
        newResource.resource.onsetDateTime = `${randomExt.integer(2021, 1980)}-0${randomExt.integer(9, 1)}-${randomExt.integer(29, 10)}`
    }

    if (resourceType === 'MedicationRequest') {
        const display = `${jabber.createFullName(false).split(" ").pop()}ium`
        const ml = randomExt.integer(5000, 5)

        newResource.resource.status = 'active'
        newResource.resource.medicationCodeableConcept = {
            coding: [
                {
                    system: "fake-med-codes",
                    code: `M.${randomExt.string(2)}-${randomExt.integer(99999, 10000)}`,
                    display,
                },
            ],
            text: display,
        }
        newResource.resource.dosageInstruction = [
            {
                text: `${ml} mL`,
                doseAndRate: [
                    {
                        doseQuantity: {
                            value: ml,
                            unit: "mL",
                            system: "http://unitsofmeasure.org",
                            code: "mL"
                        }
                    }
                ]
            }
        ]
    }

    return newResource
}

const createResources = (resourceType, patientId, count = 1) => {
    return new Array(count).fill(null).map((_null, idx) => createResource(resourceType, patientId, `${resourceType}-${patientId}-${idx}`.toLowerCase()))
}

const exec = async () => {
    const timeout = process.env.TIMEOUT || 5000
    const entry = patients.reduce((reduced, patient) => {
        const age = randomExt.integer(99, 20)
        const year = DateTime.now().year - age

        const patientFHIR = {
            resource: {
                resourceType: 'Patient',
                id: patient.id,
                gender: patient.gender,
                identifier: [
                    {
                        "type": {
                            coding: [
                                {
                                    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    code: "MR"
                                }
                            ]
                        },
                        system: "http://hospital.smarthealthit.org",
                        "value": `MRN-${patient.id}`
                    }
                ],
                name: [
                    {
                        given: [patient.name[0]],
                        family: [patient.name[1]],
                    }
                ],
                birthDate: DateTime.fromJSDate(randomExt.date(new Date(`${year}-12-31`), new Date(`${year}-01-01`))).toISODate(),
                generalPractitioner: [
                    {
                        reference: `Practitioner/${randomExt.pick(practitioners).id}`
                    }
                ],
            },
            request: {
                method: 'PUT',
                url: `Patient/${patient.id}`
            }
        }

        const newData = [
            patientFHIR,
            ...otherResourceTypes.reduce((reduced, resourceType) => {
                return [
                    ...reduced,
                    ...createResources(resourceType, patient.id, 5)
                ]
            }, []),
            ...createBpObs({ patientId: patient.id }),
            ...createTempObs({ patientId: patient.id }),
            ...createHRObs({ patientId: patient.id }),
            ...createRRObs({ patientId: patient.id }),
            ...createWBCs({ patientId: patient.id }),
            ...createHemoglobin({ patientId: patient.id }),
            ...createStoolSample({ patientId: patient.id }),
        ]

        return [
            ...reduced,
            ...newData,
        ]
    }, [])

    practitioners.forEach(({ id, name }) => {
        entry.unshift({
            resource: {
                resourceType: "Practitioner",
                id,
                name: [
                    {
                        given: [name[0]],
                        family: [name[1]],
                    }
                ],
            },
            request: {
                method: 'PUT',
                url: `Practitioner/${id}`
            }
        })
    })

    const chunkSize = process.env.CHUNK_SIZE || 100
    const entryLength = entry.length
    const chunks = Math.ceil(entryLength / chunkSize)

    for (let i = 0; i < chunks; i += 1) {
        const bundle = {
            resourceType: 'Bundle',
            type: 'transaction',
            entry: entry.slice(i * chunkSize, (i + 1) * chunkSize),
        }

        await new Promise(async (resolve) => {
            try {
                const response = await fetch(process.env.URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bundle) }).then((res) => res.json())

                console.log(response)
            } catch (err) {
                console.error(!!err)
            }
            setTimeout(() => resolve(), timeout)
        })

        console.log(i, bundle.entry.length)
    }
}

exec()
