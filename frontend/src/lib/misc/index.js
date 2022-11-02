import { DateTime } from 'luxon';
import { matchPath } from 'react-router';
import codeMapping from '../../../../lib/utils/constants';

export function getAppState() {
  const match =
    matchPath(window.location.pathname, { path: '/:state/:rest?' }) || {};
  const marchParams = match.params || {};
  return marchParams.state;
}
export function getSMARTState() {
  const params = new URLSearchParams(window.location.search);
  return params.get('state');
}
export async function getPatientData({
  smartStatus,
  fhir = {},
  fhir_SetPatientMedicalData = () => {},
  fhir_SetPatientChart = () => {},
}) {
  const { patientCDR = '' } = fhir?.smart?.data?.state?.tokenResponse || {};
  const { smartId } = fhir?.parsed?.patientDemographics?.data || {};

  if (smartStatus === 'ready') {
    const patientEHRBundledData =
      fhir?.flaggedConditions?.data?.[patientCDR || smartId]?.bundle?.entry ||
      [];
    const result = patientEHRBundledData.reduce((reduced, { resource }) => {
      if (resource) {
        return {
          ...reduced,
          [resource.resourceType]: [
            resource,
            ...(reduced[resource.resourceType] || []),
          ],
        };
      }
      return reduced;
    }, {});

    Object.keys(result).forEach((resourceType) => {
      const dataRaw = result[resourceType];
      let data = {};

      if (resourceType === 'Observation') {
        dataRaw
          .reduce((reduced, item) => {
            if (item.valueQuantity || item.valueCodeableConcept) {
              reduced.push(item);
            }

            if (Array.isArray(item.component)) {
              item.component.forEach((comp) => {
                reduced.push({
                  category: item.category,
                  effectiveDateTime: item.effectiveDateTime,
                  ...comp,
                });
              });
            }

            return reduced;
          }, [])
          .sort(
            (a, b) =>
              DateTime.fromISO(a.effectiveDateTime).toMillis() -
              DateTime.fromISO(b.effectiveDateTime).toMillis()
          )
          .forEach((obs) => {
            const category = obs?.category?.[0]?.coding?.[0]?.code;
            const codeMap = codeMapping.get(obs?.code?.coding?.[0]?.code) || {};
            const code = codeMap?.key || obs?.code?.coding?.[0]?.code;

            data[category] = data[category] || {};

            data[category][code] = data[category][code] || {
              key: codeMap?.key || code,
              display: codeMap?.display || '',
              data: [],
            };

            const date = DateTime.fromISO(obs.effectiveDateTime).toFormat(
              'MM/dd/yyyy'
            );

            let value =
              obs?.valueQuantity?.value ||
              obs?.valueCodeableConcept?.text ||
              obs?.valueCodeableConcept?.coding?.[0]?.display;

            if (code === 'wbc') {
              value = Math.round(value * 1000);
            }

            if (code === 'hmg') {
              value = Math.round(value * 10) / 10;
            }

            data[category][code].data.push({
              date,
              value,
            });
          });

        const vitals = [
          {
            label: 'T',
            value:
              data?.['vital-signs']?.temp?.data?.slice(-1)?.[0]?.value || '-',
            units: '°C',
          },
          {
            label: 'BP',
            value: `${
              data?.['vital-signs']?.sbp?.data?.slice(-1)?.[0]?.value || '-'
            }/${
              data?.['vital-signs']?.dbp?.data?.slice(-1)?.[0]?.value || '-'
            }`,
            units: '',
          },
          {
            label: 'P',
            value:
              data?.['vital-signs']?.hr?.data?.slice(-1)?.[0]?.value || '-',
            units: '',
          },
          {
            label: 'RP',
            value:
              data?.['vital-signs']?.rp?.data?.slice(-1)?.[0]?.value || '-',
            units: '',
          },
        ];

        const labs = [
          ...Object.keys(data?.laboratory || {})
            .map((key) => {
              const lab = data.laboratory[key];
              if (lab?.data?.[0]?.value) {
                return {
                  label: lab.display,
                  value: lab?.data?.[0]?.value,
                };
              }
            })
            .filter((item) => !!item),
          {
            label: 'Blood Culture',
            value: 'Negative',
          },
          {
            label: 'Urinalysis',
            value: '2+',
          },
          {
            label: 'MAP',
            value: null,
          },
        ];

        fhir_SetPatientChart({
          labs,
          vitals,
        });
      } else {
        data = dataRaw;
      }

      fhir_SetPatientMedicalData({ smartId, resourceType, data });
    });
  }
}
