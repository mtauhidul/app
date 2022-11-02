import randomExt from 'random-ext'
import * as UUID from 'uuid'

import AccessAlarmIcon from '@material-ui/icons/AccessAlarm'
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen'
import AmpStoriesIcon from '@material-ui/icons/AmpStories'
import BarChartIcon from '@material-ui/icons/BarChart'
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter'
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike'
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify'
import NoteIcon from '@material-ui/icons/Note'
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation'

import { DateTime } from 'luxon'
import { randomInteger } from './misc.jsx'

/**
 * Given an array of Coding objects finds and returns the one that contains
 * an MRN (using a code == "MR" check)
 * @export
 * @param {Fhir.Coding[]} codings
 * @returns {Fhir.Coding}
 */
export function findMRNCoding(codings) {
    if (Array.isArray(codings)) {
        return codings.find((coding) => coding.code === 'MR')
    }
    return {}
}
/**
 * Given an array of identifier objects finds and returns the one that contains
 * an MRN
 * @export
 * @param {Fhir.Identifier[]} identifiers
 * @returns {Fhir.Identifier}
 */
export function findMRNIdentifier(identifiers) {
    return identifiers.find((identifier) => !!findMRNCoding(identifier?.type?.coding))
}
/**
 * Given a patient returns his MRN
 * @export
 * @param {Fhir.Patient} patient
 * @param {any} smart
 * @returns {string}
 */
export function getPatientMRN(patient, smart = null) {
    let mrn = null
    const contextMRN = smart?.tokenResponse?.['patient-mrn']
    if (contextMRN) {
        return contextMRN
    }
    if (Array.isArray(patient.identifier) && patient.identifier.length) {
        mrn = findMRNIdentifier(patient.identifier)
        if (mrn) {
            return mrn.value
        }
    }
    return mrn
}
export function sortNames(patient) {
    const names = patient.name || []

    // if multiple names exist pick the most resent one and prefer official names
    if (names.length > 1) {
        names.sort((a, b) => {
            let score = 0
            if (a.period && a.period.end && b.period && b.period.end) {
                const endA = DateTime.fromISO(a.period.end)
                const endB = DateTime.fromISO(b.period.end)
                score = endA.toMillis() - endB.toMillis()
            }
            if (a.use === 'official') {
                score += 1
            }
            if (b.use === 'official') {
                score -= 1
            }
            return score
        })
    }

    return names
}
/**
 * Given a patient returns his name
 * @export
 * @param {Fhir.Patient} patient
 * @returns {string}
 */
export function getPatientName(patient) {
    const names = sortNames(patient)
    const name = names[names.length - 1]
    const out = []
    if (Array.isArray(name.prefix)) {
        out.push(name.prefix.join(' '))
    }
    if (Array.isArray(name.given)) {
        out.push(name.given.join(' '))
    }
    if (Array.isArray(name.family)) {
        out.push(name.family.join(' '))
    }
    else {
        out.push(name.family)
    }
    if (Array.isArray(name.suffix)) {
        out.push(`, ${name.suffix.join(' ')}`)
    }
    return out.join(' ').replace(/ , /g, ', ')
}
export function parseAddress(resource) {
    const addresses = resource.address || []
    return addresses.map((address) => ({
        use: address.use,
        val: [
            (address.line || []).join(' '),
            address.city,
            address.state,
            address.postalCode,
            address.country,
        ].join(' '),
    }))
}
export const parseTelecom = (system) => (resource) => {
    const telecom = resource.telecom || []
    return telecom
        .filter((r) => r.system === system)
        .map((r) => ({ use: r.use, val: r.value }))
}
export function parseNames(resource) {
    const names = sortNames(resource).reverse()
    return names.map((name) => ({
        use: name.use,
        val: [
            Array.isArray(name.given) ? name.given.join(' ') : name.given,
            Array.isArray(name.family) ? name.family.join(' ') : name.family,
        ].filter((n) => !!n).join(' '),
    }))
}

export const parseExtensions = ({ extension = [] }) => extension.map((ext) => {
    const fromExtension = (ext?.extension || []).reduce((reduced, extension) => reduced || extension?.valueString || extension?.valueCoding?.display, '')

    const fromValueCodeableConcept = (ext?.valueCodeableConcept?.coding || []).reduce((reduced, code) => reduced || code?.display || code?.code, '')

    const extType = ext.url || ''

    return {
        type: extType.split('/').pop().replace(/-/g, ' ').toUpperCase(),
        val: ext?.valueCode || fromExtension || fromValueCodeableConcept,
    }
})

export const parsePatient = (data, smart) => {
    const {
        bundleId = null,
        riskType = 'at-risk',
        careBundles = {},
        id: smartId,
        birthDate,
        gender,
    } = data

    const age = Math.floor(DateTime.now().diff(DateTime.fromISO(birthDate)).as('years'))

    const LOS = randomInteger(16, 1)

    const admittanceDate = DateTime.now().minus({ days: LOS })

    const dischargeDate = DateTime.now()

    const notificationPool = [
        'Notification', 'Occurence', 'Event', 'Alert', 'Brief', 'Tip',
    ]

    const iconPool = [
        AccessAlarmIcon, AddToHomeScreenIcon, AmpStoriesIcon,
        BarChartIcon, BusinessCenterIcon, DirectionsBikeIcon,
        FormatAlignJustifyIcon, NoteIcon, TransferWithinAStationIcon,
    ]

    return {
        smartId,
        birthDate,
        gender,
        MRN: getPatientMRN(data, smart),
        name: getPatientName(data),
        address: parseAddress(data),
        names: parseNames(data),
        email: parseTelecom('email')(data),
        phone: parseTelecom('phone')(data),
        age,
        extensions: parseExtensions(data),

        // Experimental data

        notification: (new Array(randomInteger(20, 10)))
            .fill(null)
            .map((_null, idx) => ({
                idx,
                id: UUID.v4(),
                date: DateTime.fromISO(`${randomInteger(2021, 2000)}-${randomInteger(12, 1)}-${randomInteger(28, 1)}`).toISO(),
                label: randomExt.pick(notificationPool),
                icon: randomExt.pick(iconPool),
                viewed: Math.random() > 0.75 ? randomExt.date(new Date(), new Date(2020, 0, 1)).getTime() : null,
            })),

        generalRisks: [
            age > 64 ? 'Over 65' : null,
            Math.random() > 0.5 ? 'ICU Admit' : null,
            Math.random() > 0.5 ? 'Nursing Home' : null,
            Math.random() > 0.5 ? 'Recent Hospitalization' : null,
        ].filter((r) => !!r),

        labs: [],

        problems: [],
        meds: [],

        location: `RM${randomInteger(11, 1)} Bed ${randomInteger(26, 1)}`,

        LOS,

        admittanceDate,

        dischargeDate,

        riskType,
        risk: 0,
        conds: [],
        condsDetails: [],
        bundleId,
        careBundles,
    }
}

export const parseUser = (data) => ({
    smartId: data.id,
    birthDate: data.birthDate,
    gender: data.gender,
    name: getPatientName(data),
    address: parseAddress(data),
    names: parseNames(data),
    email: parseTelecom('email')(data),
    phone: parseTelecom('phone')(data),
    role: data?.roleCode?.[0]?.coding?.[0]?.display,
    specialty: data?.roleSpecialty?.[0]?.coding?.[0]?.display,
})
