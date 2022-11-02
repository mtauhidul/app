/* eslint-disable no-fallthrough */

import { Decimal } from 'decimal.js'

// Temperature

export const FAHRtoCELS_PARAM = '0.5555555556'
export const CELStoFAHR_PARAM = '1.8'

// U/{time} --------------------------------------------------------------------

export const U_per_MINUTES_IN_U_per_SECOND = '60'
export const U_per_HOURS_IN_U_per_SECOND = '3600'
export const U_per_SECONDS_IN_U_per_MINUTES = '0.01666666667'
export const U_per_HOURS_IN_U_per_MINUTES = '60'
export const U_per_SECONDS_IN_U_per_HOUR = '0.0002777777778'
export const U_per_MINUTES_IN_U_per_HOUR = '0.01666666667'

// Time ------------------------------------------------------------------------

export const MINUTES_IN_SECOND = '0.0166667'
export const HOURS_IN_SECOND = '0.000277778'
export const SECONDS_IN_MINUTES = '60'
export const HOURS_IN_MINUTES = '0.0166667'
export const SECONDS_IN_HOUR = '3600'
export const MINUTES_IN_HOUR = '60'

export const MONTHS_IN_YEAR = '12'
export const YEARS_IN_MONTH = '0.0833334'

export function getNumberOfDigits(input) {
    let inputString = `${input}`
    inputString = inputString.replace('.', '')
    inputString = `${+inputString}`
    return inputString.length
}

export function toPrecision(input, prc, exact = false) {
    if (exact) {
        return `${input}`
    }

    const inputFloat = parseFloat(input)
    const rounded = inputFloat.toPrecision(prc)
    const float = parseFloat(rounded)
    const decimalPlaces = (`${rounded.indexOf('e+') > -1 ? float : rounded}`.split('.')[1] || []).length

    return decimalPlaces > 0 ? float.toFixed(decimalPlaces) : `${float}`
}

export function getSignFig(inputMeasurementStringRaw, exact = false, hardPrecision = 0) {
    const inputMeasurementString = `${inputMeasurementStringRaw}`
    if (hardPrecision) {
        return hardPrecision
    }

    if (exact) {
        return 100
    }

    if (inputMeasurementString) {
        const d = new Decimal(inputMeasurementString)
        return d.precision() - d.decimalPlaces() + 2
    }
    return null
}

// window.getSignFig = getSignFig
//
// window.convert = convert

export function performConversion(
    inputMeasurementRaw, convertRateRaw, _precision = 10, options = {},
) {
    const exact = options.exact || false
    const hardPrecision = options.hardPrecision || null

    if (inputMeasurementRaw) {
        const inputMeasurementString = `${inputMeasurementRaw}`

        // Set high precision for exact numbers
        const prc = getSignFig(inputMeasurementString, exact, hardPrecision)
        let DecimalLocal
        if (prc) {
            DecimalLocal = Decimal.clone({ precision: prc })
        }
        else {
            DecimalLocal = Decimal.clone()
        }
        const inputMeasurement = new DecimalLocal(inputMeasurementString)
        const convertRate = new DecimalLocal(convertRateRaw)

        const result = DecimalLocal
            .mul(inputMeasurement, convertRate)
            .toString()

        return toPrecision(result, prc, exact)
    }

    return null
}

// -----------------------------------------------------------------------------

export function FAHRtoCELS(fahrs, _rounding = 10, _precision = 10, options = {}) {
    const exact = options.exact || false
    const hardPrecision = options.hardPrecision || null

    // Set high precision for exact numbers
    const prc = getSignFig(fahrs, exact, hardPrecision)
    let DecimalLocal
    if (prc) {
        DecimalLocal = Decimal.clone({ precision: prc })
    }
    else {
        DecimalLocal = Decimal.clone()
    }

    // (32°F − 32) × 5/9
    const result = new DecimalLocal(fahrs).sub(32).mul(FAHRtoCELS_PARAM)
        .toString()

    return toPrecision(result, prc, exact)
}
export function CELStoFAHR(celcs, _rounding = 10, _precision = 10, options = {}) {
    const exact = options.exact || false
    const hardPrecision = options.hardPrecision || null

    // Set high precision for exact numbers
    const prc = getSignFig(celcs, exact, hardPrecision)
    let DecimalLocal
    if (prc) {
        DecimalLocal = Decimal.clone({ precision: prc })
    }
    else {
        DecimalLocal = Decimal.clone()
    }

    // (0°C × 9/5) + 32
    const result = new Decimal(celcs).mul(CELStoFAHR_PARAM).add(32)
        .toString()

    return toPrecision(result, prc, exact)
}

export function hoursToSeconds(hours, rounding = 10, hardPrecision) {
    return performConversion(hours, SECONDS_IN_HOUR, rounding, { hardPrecision, exact: true })
}

export function hoursToMinutes(hours, rounding = 10, hardPrecision) {
    return performConversion(hours, MINUTES_IN_HOUR, rounding, { hardPrecision, exact: true })
}

export function minutesToSeconds(minutes, rounding = 10, hardPrecision) {
    return performConversion(minutes, SECONDS_IN_MINUTES, rounding, { hardPrecision, exact: true })
}

export function minutesToHours(minutes, rounding = 10, hardPrecision) {
    return performConversion(minutes, HOURS_IN_MINUTES, rounding, { hardPrecision, exact: true })
}

export function secondsToMinutes(seconds, rounding = 10, hardPrecision) {
    return performConversion(seconds, MINUTES_IN_SECOND, rounding, { hardPrecision, exact: true })
}

export function secondsToHours(seconds, rounding = 10, hardPrecision) {
    return performConversion(seconds, HOURS_IN_SECOND, rounding, { hardPrecision, exact: true })
}

export function monthsToYears(months, _rounding = 10, _hardPrecision) {
    return Decimal.div(months, 12).toPrecision().toString()
}

export function yearsToMonths(years, _rounding = 10, _hardPrecision) {
    return `${+Decimal.mul(years, 12).toPrecision()}`
}

// -----------------------------------------------------------------------------

export function U_per_hoursToU_per_Seconds(hours, rounding = 10, hardPrecision) {
    return performConversion(hours, U_per_SECONDS_IN_U_per_HOUR, rounding, { hardPrecision, exact: true })
}

export function U_per_hoursToU_per_Minutes(hours, rounding = 10, hardPrecision) {
    return performConversion(hours, U_per_MINUTES_IN_U_per_HOUR, rounding, { hardPrecision, exact: true })
}

export function U_per_minutesToU_per_Seconds(minutes, rounding = 10, hardPrecision) {
    return performConversion(minutes, U_per_SECONDS_IN_U_per_MINUTES, rounding, { hardPrecision, exact: true })
}

export function U_per_minutesToU_per_Hours(minutes, rounding = 10, hardPrecision) {
    return performConversion(minutes, U_per_HOURS_IN_U_per_MINUTES, rounding, { hardPrecision, exact: true })
}

export function U_per_secondsToU_per_Minutes(seconds, rounding = 10, hardPrecision) {
    return performConversion(seconds, U_per_MINUTES_IN_U_per_SECOND, rounding, { hardPrecision, exact: true })
}

export function U_per_secondsToU_per_Hours(seconds, rounding = 10, hardPrecision) {
    return performConversion(seconds, U_per_HOURS_IN_U_per_SECOND, rounding, { hardPrecision, exact: true })
}

// -----------------------------------------------------------------------------
export function convert(options) {
    const inputValue = options.inputValue
    const inputUnits = options.inputUnits
    const outputUnits = options.outputUnits.toLowerCase()
    const rounding = options.rounding
    const hardPrecision = options.hardPrecision

    if (inputValue === null || inputValue === undefined || Number.isNaN(inputValue)) {
        return inputValue
    }

    const units = (inputUnits || '').trim().toLowerCase()
    switch (units) {
        // Temperature -----------------------------------------------------
        case 'f':
        case '°f':
        case 'fh':
        case 'of':
        case 'f.':
        case 'fahr':
        case 'degf':
        case '[degf]':
            switch (outputUnits) {
                case 'f':
                case '°f':
                case 'fh':
                case 'of':
                case 'f.':
                case 'fahr':
                case 'degf':
                case '[degf]':
                    return `${inputValue}`
                case 'c':
                case '°c':
                case 'c.':
                case 'cel':
                case 'cels':
                    return FAHRtoCELS(inputValue, rounding, hardPrecision)
            }

        case 'c':
        case '°c':
        case 'c.':
        case 'cel':
        case 'cels':
            switch (outputUnits) {
                case 'c':
                case '°c':
                case 'c.':
                case 'cel':
                case 'cels':
                    return `${inputValue}`
                case 'f':
                case '°f':
                case 'fh':
                case 'of':
                case 'f.':
                case 'fahr':
                case 'degf':
                case '[degf]':
                    return CELStoFAHR(inputValue, rounding, hardPrecision)
            }
        // U/{time} --------------------------------------------------------
        case 'U/h':
        case 'U/hr':
        case 'U/hours':
        case 'U/hour':
        case 'U/hrs':
            switch (outputUnits) {
                case 'U/h':
                case 'U/hr':
                case 'U/hours':
                case 'U/hour':
                case 'U/hrs':
                    return `${inputValue}`
                case 'U/min':
                case 'U/mins':
                case 'U/minute':
                case 'U/minutes':
                    return U_per_hoursToU_per_Minutes(inputValue, rounding, hardPrecision)
                case 'U/s':
                case 'U/sec':
                case 'U/second':
                case 'U/seconds':
                    return U_per_hoursToU_per_Seconds(inputValue, rounding, hardPrecision)
            }
        case 'U/min':
        case 'U/mins':
        case 'U/minute':
        case 'U/minutes':
            switch (outputUnits) {
                case 'U/h':
                case 'U/hr':
                case 'U/hours':
                case 'U/hour':
                case 'U/hrs':
                    return U_per_minutesToU_per_Hours(inputValue, rounding, hardPrecision)
                case 'U/min':
                case 'U/mins':
                case 'U/minute':
                case 'U/minutes':
                    return `${inputValue}`
                case 'U/s':
                case 'U/sec':
                case 'U/second':
                case 'U/seconds':
                    return U_per_minutesToU_per_Seconds(inputValue, rounding, hardPrecision)
            }
        case 'U/s':
        case 'U/sec':
        case 'U/second':
        case 'U/seconds':
            switch (outputUnits) {
                case 'U/h':
                case 'U/hr':
                case 'U/hours':
                case 'U/hour':
                case 'U/hrs':
                    return U_per_secondsToU_per_Hours(inputValue, rounding, hardPrecision)
                case 'U/min':
                case 'U/mins':
                case 'U/minute':
                case 'U/minutes':
                    return U_per_secondsToU_per_Minutes(inputValue, rounding, hardPrecision)
                case 'U/s':
                case 'U/sec':
                case 'U/second':
                case 'U/seconds':
                    return `${inputValue}`
            }
        // Time ------------------------------------------------------------
        case 'h':
        case 'hr':
        case 'hours':
        case 'hour':
        case 'hrs':
            switch (outputUnits) {
                case 'h':
                case 'hr':
                case 'hours':
                case 'hour':
                case 'hrs':
                    return `${inputValue}`
                case 'min':
                case 'mins':
                case 'minute':
                case 'minutes':
                    return hoursToMinutes(inputValue, rounding, hardPrecision)
                case 's':
                case 'sec':
                case 'second':
                case 'seconds':
                    return hoursToSeconds(inputValue, rounding, hardPrecision)
            }
        case 'min':
        case 'mins':
        case 'minute':
        case 'minutes':
            switch (outputUnits) {
                case 'h':
                case 'hr':
                case 'hours':
                case 'hour':
                case 'hrs':
                    return minutesToHours(inputValue, rounding, hardPrecision)
                case 'min':
                case 'mins':
                case 'minute':
                case 'minutes':
                    return `${inputValue}`
                case 's':
                case 'sec':
                case 'second':
                case 'seconds':
                    return minutesToSeconds(inputValue, rounding, hardPrecision)
            }
        case 's':
        case 'sec':
        case 'second':
        case 'seconds':
            switch (outputUnits) {
                case 'h':
                case 'hr':
                case 'hours':
                case 'hour':
                case 'hrs':
                    return secondsToHours(inputValue, rounding, hardPrecision)
                case 'min':
                case 'mins':
                case 'minute':
                case 'minutes':
                    return secondsToMinutes(inputValue, rounding, hardPrecision)
                case 's':
                case 'sec':
                case 'second':
                case 'seconds':
                    return `${inputValue}`
            }
        case 'yr':
            switch (outputUnits) {
                case 'yr':
                    return `${inputValue}`
                case 'mo':
                    return yearsToMonths(inputValue, rounding, hardPrecision)
            }

        case 'mo':
            switch (outputUnits) {
                case 'mo':
                    return `${inputValue}`
                case 'yr':
                    return monthsToYears(inputValue, rounding, hardPrecision)
            }
            break
    }

    throw new Error(`Conversion not supported! (inputUnits: "${inputUnits}", outputUnits: "${outputUnits}")`)
}

export default convert
