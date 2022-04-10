const form = document.querySelector('form')
const loadingElement = document.querySelector('.loading')
const barksElement = document.querySelector('.barks')
const API_URL = 'http://localhost:5000/barks'


loadingElement.style.display = ''

listAllBarks()

form.addEventListener('submit', (event) => {
  
  event.preventDefault()
  const formData = new FormData(form)
  const name = formData.get('name')
  const content = formData.get('content')

  const bark = {
    name,
    content
  }

  form.style.display = 'none'
  loadingElement.style.display = ''

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(bark),
    headers: {
      'content-type': 'application/json'
    }
  }).then(response => response.json())
    .then(createdBark => {
      form.reset()
      setTimeout(() => {
        form.style.display = ''
      }, 5000);
      listAllBarks()
      loadingElement.style.display = ''
    })
})

function listAllBarks(){
  barksElement.innerHTML = ''
  fetch(API_URL)
    .then(response => response.json())
    .then(barks => {
      // console.log(barks);
      barks.reverse()
      barks.forEach(bark => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.style.width = '18 rem'

        const cardContainer = document.createElement('div')
        cardContainer.classList.add('card-body')
        cardContainer.classList.add('text-dark')
        cardContainer.classList.add('bg-light')
        cardContainer.classList.add('border-light')
        cardContainer.classList.add('pb-0')
        
        const header = document.createElement('h2')
        header.textContent = bark.name
        header.classList.add('card-title')

        const contents = document.createElement('h6')
        contents.textContent = `"${bark.content}"`
        contents.classList.add('lead')
        contents.classList.add('card-text')

        const date = document.createElement('pre')
        date.textContent = new Date(bark.created)
        date.classList.add('mb-2')

        cardContainer.appendChild(header)
        cardContainer.appendChild(contents)
        cardContainer.appendChild(document.createElement('br'))
        cardContainer.appendChild(date)

        div.appendChild(cardContainer)
        barksElement.appendChild(div)
      })
      loadingElement.style.display = 'none'
    })
}