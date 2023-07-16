document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    let filter = false;
  
    filterButton.addEventListener('click', () => {
      filter = !filter;
      filterButton.innerText = filter ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
      loadPups();
    });
  
    function loadPups() {
      fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(pups => {
          dogBar.innerHTML = '';
          pups.forEach(pup => {
            if (!filter || pup.isGoodDog) {
              const pupSpan = document.createElement('span');
              pupSpan.innerText = pup.name;
              pupSpan.addEventListener('click', () => showPupInfo(pup));
              dogBar.appendChild(pupSpan);
            }
          });
        });
      }
  
    function showPupInfo(pup) {
      dogInfo.innerHTML = `
        <img src="${pup.image}">
        <h2>${pup.name}</h2>
        <button>${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
      `;
      const button = dogInfo.querySelector('button');
      button.addEventListener('click', () => toggleGoodDog(pup));
    }
  
    function toggleGoodDog(pup) {
      pup.isGoodDog = !pup.isGoodDog;
      fetch(`http://localhost:3000/pups/${pup.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pup),
      })
        .then(response => response.json())
        .then(updatedPup => showPupInfo(updatedPup));
    }
  
    loadPups();
  });