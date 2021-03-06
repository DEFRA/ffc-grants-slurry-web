function addSummaryRow (object, rating, request) {
  return {
    key: object.key,
    answers: [
      {
        key: object.key,
        title: object.title,
        input: [{ value: request.yar.get(object.yarKey) }]
      }],
    rating,
    title: object.title,
    desc: object.desc ?? '',
    url: object.url,
    order: object.order,
    unit: object?.unit,
    pageTitle: object.pageTitle,
    fundingPriorities: object?.fundingPriorities
  }
}

module.exports = {
  addSummaryRow
}
