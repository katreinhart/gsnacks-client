function navbarTemplate() {
  return `<div class='container-fluid navigation'>
  <div class='row'>
    <div class='col-10'>
      <ul>
        <a href='/#/'><li>Home</li></a>
        <a href='/#/index'><li>View All</li></a>
        <a href='/#/edit'><li>Add/Edit</li></a>
      </ul>
    </div>
    <div class='col-2'>
      <a href=''>Log Out</a>
    </div>
  </div>
</div>`
}

module.exports = {
  navbarTemplate,
}
