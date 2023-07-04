import { createSenML } from './createSenMLFormat'

describe('createSenML', () => {
	it('should create format from a resource with string as data type', () => {
		const input = { resource: '3/0/0', value: 'test' }
		const result = createSenML(input.resource, input.value)
		expect(result[0]?.vs).toBe(input.value)
		expect(result[0]?.n).toBe(input.resource)
	})

	it('should create format from a resource with number as data type', () => {
		const input = { resource: '3/0/6', value: 2 }
		const result = createSenML(input.resource, input.value)
		expect(result[0]?.v).toBe(input.value)
		expect(result[0]?.n).toBe(input.resource)
	})

	it('should create format from a resource with boolean as data type', () => {
		const input = { resource: '3347/0/5500', value: false }
		const result = createSenML(input.resource, input.value)
		expect(result[0]?.vb).toBe(input.value)
		expect(result[0]?.n).toBe(input.resource)
	})
})
