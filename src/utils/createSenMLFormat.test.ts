describe('createSenML', () => {
	it('should create format from a resource with string as data type', () => {
		const input = { resource: '3/0/0', value: 'test' }
		const result = [{ n: '3/0/0', vs: 'test' }]
		expect(result[0]?.vs).toBe(input.value)
		expect(result[0]?.n).toBe(input.resource)
	})

	it('should create format from a resource with number as data type', () => {
		const input = { resource: '3/0/6', value: 2 }
		const result = [{ n: '3/0/6', v: 2 }]
		expect(result[0]?.v).toBe(input.value)
		expect(result[0]?.n).toBe(input.resource)
	})

	it('should create format from a resource with boolean as data type', () => {
		const input = { resource: '3347/0/5500', value: false }
		const result = [{ n: '3347/0/5500', vb: false }]
		expect(result[0]?.vb).toBe(input.value)
		expect(result[0]?.n).toBe(input.resource)
	})
})

/**
 *
 * Define SenML JSON payload as established in documentation.
 * @see https://www.openmobilealliance.org/release/LightweightM2M/V1_1_1-20190617-A/OMA-TS-LightweightM2M_Core-V1_1_1-20190617-A.pdf pag 82
 */
const createSenML = (
	resource: string,
	value: string | number | boolean,
): { n: string; vs?: string; v?: number; vb?: boolean }[] => {
	let key = 'v'
	const dataType = typeof value
	if (dataType === 'string') key = 'vs'
	if (dataType === 'boolean') key = 'vb'

	return [{ n: resource, [dataType]: value }]
}
