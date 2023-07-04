/**
 *
 * Define SenML JSON payload as established in documentation.
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_1_1-20190617-A/OMA-TS-LightweightM2M_Core-V1_1_1-20190617-A.pdf pag 82
 */
export const createSenML = (
	resource: string,
	value: string | number | boolean,
): { n: string; vs?: string; v?: number; vb?: boolean }[] => {
	let key = 'v'
	const dataType = typeof value
	if (dataType === 'string') key = 'vs'
	if (dataType === 'boolean') key = 'vb'

	return [{ n: resource, [dataType]: value }]
}
