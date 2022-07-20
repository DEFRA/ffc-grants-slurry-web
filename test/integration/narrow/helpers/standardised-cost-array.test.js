const { formatAnswerArray } = require('./../../../../app/helpers/standardised-cost-array')

const objectToSend = {
  data: {
    grantScheme: {
      key: 'SLURRY01',
      name: 'Slurry Infrastructure Grant'
    },
    desirability: {
      catagories: [
        {
          key: 'cat-storage',
          title: 'Storage',
          items: [
            {
              item: 'Above-ground steel tank',
              amount: 22,
              unit: 'per cubic metre'
            },
            {
              item: 'Above-ground concrete tank',
              amount: 17,
              unit: 'per cubic metre'
            },
            {
              item: 'Below-ground in-situ cast-reinforced concrete tank',
              amount: 15,
              unit: 'per cubic metre'
            },
            {
              item: 'Earth-bank lagoon (unlined)',
              amount: 8,
              unit: 'per cubic metre'
            },
            {
              item: 'Earth-bank lagoon (lined)',
              amount: 12,
              unit: 'per cubic metre'
            },
            {
              item: 'Stores using pre-cast rectangular concrete panels',
              amount: 14,
              unit: 'per cubic metre'
            },
            {
              item: 'Large-volume supported slurry bag',
              amount: 20,
              unit: 'per cubic metre'
            },
            {
              item: 'Slatted-floor stores',
              amount: 14,
              unit: 'per cubic metre'
            }
          ]
        },
        {
          key: 'cat-cover-type',
          title: 'Cover type',
          items: [
            {
              item: 'Rigid covers for above-ground steel or concrete stores',
              amount: 8,
              unit: 'per square metre'
            },
            {
              item: 'Fixed flexible covers for above-ground steel and concrete stores and earth-bank lagoons',
              amount: 4,
              unit: 'per square metre'
            },
            {
              item: 'Floating flexible cover for earth-bank lagoons only',
              amount: 3,
              unit: 'per square metre'
            }
          ]
        },
        {
          key: 'cat-reception-pit-type',
          title: 'Reception pit type',
          items: [
            {
              item: 'Glass-reinforced plastic (GRP)',
              amount: 25,
              unit: 'per cubic metre'
            },
            {
              item: 'Plastic',
              amount: 26,
              unit: 'per cubic metre'
            },
            {
              item: 'Pre-cast concrete',
              amount: 27,
              unit: 'per cubic metre'
            },
            {
              item: 'In-situ cast concrete',
              amount: 30,
              unit: 'per cubic metre'
            }
          ]
        },
        {
          key: 'cat-pump-type',
          title: 'Pump type',
          items: [
            {
              item: 'Electric-powered slurry transfer pump',
              amount: 1050,
              unit: 'per pump'
            },
            {
              item: 'Centrifugal chopper pump',
              amount: 2090,
              unit: 'per pump'
            }
          ]
        },
        {
          key: 'cat-pipework',
          title: 'Pipework',
          items: [
            {
              item: 'Galvanised steel pipework 100mm diameter',
              amount: 14,
              unit: 'per metre'
            },
            {
              item: 'Galvanised steel pipework 150mm diameter diameter',
              amount: 24,
              unit: 'per metre'
            }
          ]
        },
        {
          key: 'cat-transfer-channels',
          title: 'Transfer channels',
          items: [
            {
              item: 'Under-floor transfer channels',
              amount: 25,
              unit: 'per metre'
            }
          ]
        },
        {
          key: 'cat-agitator',
          title: 'Agitator',
          items: [
            {
              item: 'Tank wall mixers with tank capacity up to 1,200 cubic metre',
              amount: 350,
              unit: 'per tank'
            },
            {
              item: 'Tank wall mixers with tank capacity up to 8,000 cubic metre',
              amount: 1000,
              unit: 'per tank'
            }
          ]
        },
        {
          key: 'cat-safety-equipment',
          title: 'Safety equipment',
          items: [
            {
              item: 'Inspection platform with ladder for above-ground concrete and steel tanks',
              amount: 800,
              unit: 'per item'
            },
            {
              item: 'Safety fencing for below-ground stores,earth-bank lagoons and slurry bags',
              amount: 55,
              unit: 'per metre'
            }
          ]
        }
      ],
      overallRating: {
        score: null,
        band: null
      }
    }
  }

}

describe('Standardised Cost Answers Array Function', () => {
  test('Should return array correctly when object, question key and key to be found in object sent', () => {
    const mockRequest = {
      yar: { get: (key) => (objectToSend) }
    }

    const response = formatAnswerArray(mockRequest, 'test-answers', 'cat-storage')

    expect(response).toEqual([
      {
        value: 'test-answers-A1',
        text: 'Above-ground steel tank',
        hint: {
          text: 'Grant amount: £22 per cubic metre'
        }
      },
      {
        value: 'test-answers-A2',
        text: 'Above-ground concrete tank',
        hint: {
          text: 'Grant amount: £17 per cubic metre'
        }
      },
      {
        value: 'test-answers-A3',
        text: 'Below-ground in-situ cast-reinforced concrete tank',
        hint: {
          text: 'Grant amount: £15 per cubic metre'
        }
      },
      {
        value: 'test-answers-A4',
        text: 'Earth-bank lagoon (unlined)',
        hint: {
          text: 'Grant amount: £8 per cubic metre'
        }
      },
      {
        value: 'test-answers-A5',
        text: 'Earth-bank lagoon (lined)',
        hint: {
          text: 'Grant amount: £12 per cubic metre'
        }
      },
      {
        value: 'test-answers-A6',
        text: 'Stores using pre-cast rectangular concrete panels',
        hint: {
          text: 'Grant amount: £14 per cubic metre'
        }
      },
      {
        value: 'test-answers-A7',
        text: 'Large-volume supported slurry bag',
        hint: {
          text: 'Grant amount: £20 per cubic metre'
        }
      },
      {
        value: 'test-answers-A8',
        text: 'Slatted-floor stores',
        hint: {
          text: 'Grant amount: £14 per cubic metre'
        }
      }
    ])
  })

  test('Should return blank array if no object', () => {
    const mockRequest = {
      yar: { get: (key) => ({}) }
    }

    const response = formatAnswerArray(mockRequest, 'test-answers', 'cat-storage')

    expect(response).toEqual([])
  })

  test('Should return blank array if key does not match', () => {
    const mockRequest = {
      yar: { get: (key) => ({}) }
    }

    const response = formatAnswerArray(mockRequest, 'test-answers', '1245')

    expect(response).toEqual([])
  })
})
