describe('Conditional html', () => {
    const { isChecked } = require('../../../../app/helpers/answer-options')

    test('check function isChecked - data is string of array and option is string', () => {
        const data = [ 'Pig' ]
        const option = 'Pig'
    
        const result = isChecked(data, option)
        expect(result).toBe(true)
      })


      test('check function isChecked - data null and option is string', () => {
        const data = null
        const option = 'Sole trader'
    
        const result = isChecked(data, option)
        expect(result).toBe(false)
      })

      test('check function isChecked - data null and option is string', () => {
        const data = null
        const option = 'Yes'
    
        const result = isChecked(data, option)
        expect(result).toBe(false)
      })

      test('check function isChecked - data null and option is string', () => {
        const data = [ 'Pig' ]
        const option = 'Beef'
    
        const result = isChecked(data, option)
        expect(result).toBe(false)
      })

      test('check function isChecked - data is string of array and option is string', () => {
        const data = ['Constructing or improving buildings for processing', 'Processing equipment or machinery'] 
        const option = 'Constructing or improving buildings for processing'
    
        const result = isChecked(data, option)
        expect(result).toBe(true)
      })
      test('check function isChecked - data is string of array and option is string', () => {
        const data = ['Constructing or improving buildings for processing', 'Processing equipment or machinery'] 
        const option = 'Processing equipment or machinery'
    
        const result = isChecked(data, option)
        expect(result).toBe(true)
      })
})

