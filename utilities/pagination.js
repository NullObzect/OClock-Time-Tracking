const pageNumbers = (total, max, current) => {
  const half = Math.floor(max / 2);
  let to = max
  if (current + half >= total) {
    to = total;
  } else if (current > half) {
    to = current + half
  }
  const from = to - max
  return Array.from({ length: max }, (_, i) => (i + 1) + from)
}

// Pagination Button action function

function PaginationButtons(totalPages, maxPageVisible = 10, currentPage = 1) {
  let pages = pageNumbers(totalPages, maxPageVisible, currentPage)
  let currentPageBtn = null;
  const buttons = new Map()
  const fragment = document.createDocumentFragment()
  const paginationButtonContainer = document.createElement('div');
  paginationButtonContainer.className = 'pagination-buttons'

  const disabled = {
    start: () => pages[0] === 1,
    prev: () => currentPage === 1,
    end: () => pages.slice(-1)[0] === totalPages,
    next: () => currentPage === totalPages,
  }

  // Create Button and button details

  const createAndSetupButtons = (label = '', cls = '', disabled = false, handleClick = () => {}) => {
    const button = document.createElement('button');
    button.textContent = label;
    button.className = `page-btn ${cls}`
    button.disabled = disabled
    button.addEventListener('click', (event) => {
      handleClick(event);
      this.update();
      paginationButtonContainer.value = currentPage;
      paginationButtonContainer.dispatchEvent(new Event('change'));
    })
    return button
  }

  const onPageButtonClick = (e) => currentPage = Number(e.currentTarget.textContent)

  const onPageButtonUpdate = (index) => (btn) => {
    btn.textContent = pages[index]
    if (pages[index] === currentPage) {
      currentPageBtn.classList.remove('active')
      btn.classList.add('active')
      currentPageBtn = btn;
      currentPageBtn.focus()
    }
  }

  buttons.set(createAndSetupButtons('start', 'start-page', disabled.start(), () => currentPage = 1), (btn) => btn.disabled = disabled.start())
  buttons.set(createAndSetupButtons('prev', 'prev-page', disabled.prev(), () => currentPage -= 1), (btn) => btn.disabled = disabled.prev())

  pages.forEach((pageNumber, index) => {
    const isCurrentPage = pageNumber === currentPage
    const button = createAndSetupButtons(pageNumber, isCurrentPage ? 'active' : '', false, onPageButtonClick)
    if (isCurrentPage) {
      currentPageBtn = button;
    }
    buttons.set(button, onPageButtonUpdate(index))
  })

  buttons.set(createAndSetupButtons('next', 'next-page', disabled.next(), () => currentPage += 1), (btn) => btn.disabled = disabled.next())

  buttons.set(createAndSetupButtons('end', 'end-page', disabled.end(), () => currentPage = totalPages), (btn) => btn.disabled = disabled.end())
  buttons.forEach((_, btn) => {
    fragment.appendChild(btn)
  })

  this.render = (container = document.body) => {
    paginationButtonContainer.appendChild(fragment)
    console.log('render', container.children.length)
    if (container.children.length === 1) {
      container.removeChild(container.children[0])
    }
    container.appendChild(paginationButtonContainer)
  }

  this.update = (newPageNumber = currentPage) => {
    currentPage = newPageNumber
    pages = pageNumbers(totalPages, maxPageVisible, currentPage)
    buttons.forEach((updateButton, button) => updateButton(button))
  }
  this.onChange = (handler) => {
    paginationButtonContainer.addEventListener('change', handler);
  }
}

module.exports = PaginationButtons
