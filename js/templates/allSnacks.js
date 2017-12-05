function allSnacksTemplate(snacks) {
  const snackDivContent = snacks.map(snack => `<div class='row allSnackRow'> <div class='row'>
        <div class='col-8'>
          <h3><a href='#/snacks/${snack.id}'>${snack.name}</a></h3>
          <p>Average User Rating: <strong>5</strong></p>
          <p>Price: <strong>${snack.price}</strong></p>
          <p>Description: <strong>${snack.description}</strong></p>
        </div>
        <div class='col-4'>
          <img src='${snack.img}' width=250 alt='a picture of ${snack.name}'>
        </div>
      </div></div>`).join('')

  return `<div class='container-fluid mainBody'>
  <div class='row allSnackRow'>
    <div class='col-12'>
      <h1>All Snacks!</h1>
    </div>
  </div>

  ${snackDivContent}`
}

module.exports = {
  allSnacksTemplate,
}
