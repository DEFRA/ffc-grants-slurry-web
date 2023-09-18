const { crumbToken } = require('./test-helper')
const standardisedCostObject = {
	data: {
		grantScheme: {
			key: 'SLURRY01',
			name: 'Slurry Infrastructure Grant'
		},
		desirability: {
			catagories: [
				{
					key: "cat-separator",
					title: "Slurry separator equipment",
					items: [
						{
							item: "Screen press",
							amount: 21234,
							unit: "per unit"
						},
						{
							item: "Screw press",
							amount: 22350,
							unit: "per unit"
						},
						{
							item: "Gantry",
							amount: 5154,
							unit: "per unit"
						},
						{
							item: "Concrete pad",
							amount: 6414,
							unit: "per unit"
						},
						{
							item: "Concrete bunker",
							amount: 168.18,
							unit: "per square metre"
						}
					]
				},
			],
			overallRating: {
				score: null,
				band: null
			}
		}
	}
}
describe('Page: /solid-fraction-storage', () => {
	const varList = {
		coverType: null,
		existingCover: "no",
		applyingFor: "fake",
		applicantType: "Beef",
		projectType: "fake",
		storageType: "hello",
		separator: "Yes",
		separatorType: "fake",
		separatorOptions: null,
		standardisedCostObject: standardisedCostObject,
		gantry: "Yes",
	};
	jest.mock('../../../../app/helpers/session', () => ({
		setYarValue: (request, key, value) => null,
		getYarValue: (request, key) => {
			if (varList[ key ]) return varList[ key ]
			else return undefined
		}
	}))
	// GET Tests
	it('page loads successfully, with all the options', async () => {
		const options = {
			method: 'GET',
			url: `${global.__URLPREFIX__}/solid-fraction-storage`
		}
		const response = await global.__SERVER__.inject(options)
		expect(response.statusCode).toBe(200)
		expect(response.payload).toContain('What type of solid fraction storage will you have?') // title
		expect(response.payload).toContain('You must stack your solid fraction on an impermeable surface to prevent leaking into the soil.') // hint text
		expect(response.payload).toContain('Concrete pad') // option 1
		expect(response.payload).toContain('(Grant amount: £6,414 per unit)') // option 1 hint text
		expect(response.payload).toContain('Concrete bunker') // option 2
		expect(response.payload).toContain('Maximum grant contribution is up to 100m²') // option 2 hint text line 1
		expect(response.payload).toContain('(Grant amount: £168.18 per square metre)') // option 2 hint text line 2
		expect(response.payload).toContain('Enter size') // option 2 - conditional input
		expect(response.payload).toContain('I already have a solid fraction storage') // option 3
	})
	it('page loads with correct back link', async () => {
		const options = {
			method: 'GET',
			url: `${global.__URLPREFIX__}/solid-fraction-storage`
		}
		const response = await global.__SERVER__.inject(options)
		expect(response.statusCode).toBe(200)
		expect(response.payload).toContain('<a href=\"gantry\" class=\"govuk-back-link\">Back</a>')
	})
	// POST Tests
	it('should returns error message if no options were selected', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/solid-fraction-storage`,
			payload: { crumb: crumbToken },
			headers: {
				cookie: 'crumb=' + crumbToken
			}
		}
		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(200)
		expect(postResponse.payload).toContain('Select what type of solid fraction storage you will have')
	})
	it('should returns error message if Concrete bunker was selected without entering the size', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/solid-fraction-storage`,
			payload: { solidFractionStorage: 'Concrete bunker', crumb: crumbToken },
			headers: {
				cookie: 'crumb=' + crumbToken
			}
		}
		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(200)
		expect(postResponse.payload).toContain('Enter concrete bunker size')
	})
	it('should returns error message if Concrete bunker was selected with invalid number for size', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/solid-fraction-storage`,
			payload: { solidFractionStorage: 'Concrete bunker', concreteBunkerSize: '99.99', crumb: crumbToken },
			headers: {
				cookie: 'crumb=' + crumbToken
			}
		}
		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(200)
		expect(postResponse.payload).toContain('Size must be a whole number')
	})
	it('should returns error message if Concrete bunker was selected with invalid whole number (over 99999) for size', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/solid-fraction-storage`,
			payload: { solidFractionStorage: 'Concrete bunker', concreteBunkerSize: '999999', crumb: crumbToken },
			headers: {
				cookie: 'crumb=' + crumbToken
			}
		}
		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(200)
		expect(postResponse.payload).toContain('Size must be between 1-99999')
	})
	it('should returns error message if Concrete bunker was selected with invalid whole number (less than 1) for size', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/solid-fraction-storage`,
			payload: { solidFractionStorage: 'Concrete bunker', concreteBunkerSize: '0', crumb: crumbToken },
			headers: {
				cookie: 'crumb=' + crumbToken
			}
		}
		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(200)
		expect(postResponse.payload).toContain('Size must be between 1-99999')
	})
	it('User selects "Concrete bunker" with a valid whole number for size - advances to /other-items', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/solid-fraction-storage`,
			payload: { solidFractionStorage: 'Concrete bunker', concreteBunkerSize: '99999', crumb: crumbToken },
			headers: {
				cookie: 'crumb=' + crumbToken
			}
		}
		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(302)
		expect(postResponse.headers.location).toBe('other-items')
	})
	it('User selects "Concrete pad" - advances to /other-items', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/solid-fraction-storage`,
			payload: { solidFractionStorage: 'Concrete pad', crumb: crumbToken },
			headers: {
				cookie: 'crumb=' + crumbToken
			}
		}
		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(302)
		expect(postResponse.headers.location).toBe('other-items')
	})
	it('User selects "I already have a solid fraction storage" - advances to /other-items', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/solid-fraction-storage`,
			payload: { solidFractionStorage: 'I already have a solid fraction storage', crumb: crumbToken },
			headers: {
				cookie: 'crumb=' + crumbToken
			}
		}
		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(302)
		expect(postResponse.headers.location).toBe('other-items')
	})
})